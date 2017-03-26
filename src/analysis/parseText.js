'use strict';

let {
    parseSimpleKVLine
} = require('../util');

// TODO define specification for knowledge
// which can be embed in some kinds of file
// extract information from files accroding to the specification

/**
 * ${prefix} k-topic-start
 *
 * blah blah ...
 *
 * ${prefix} k-topic-end
 */
const TOPIC_START = 'kTopicStart';
const TOPIC_END = 'kTopicEnd';
const TOPIC_DES_START = '@kTopicDesStart'; // align cut
const TOPIC_DES_END = '@kTopicDesEnd';
const TOPIC_PREFIXS = ['#', '//', '\\\*', '<\\\!\\\-\\\-', '/\\\*'];

let getTopicLineReg = (type, prefix) => {
    return new RegExp(`^\\s*${prefix}\\s*${type}(\\s+.*)?$`);
};

let getRegsWithPrefixs = (type) => {
    return TOPIC_PREFIXS.map((prefix) => getTopicLineReg(type, prefix));
};

const TOPIC_START_REGS = getRegsWithPrefixs(TOPIC_START);

const TOPIC_END_REGS = getRegsWithPrefixs(TOPIC_END);

const TOPIC_DES_START_REGS = getRegsWithPrefixs(TOPIC_DES_START);

const TOPIC_DES_END_REGS = getRegsWithPrefixs(TOPIC_DES_END);

let isSomeTopicLine = (regs) => (line) => {
    return regs.findIndex((reg) => reg.test(line)) !== -1;
};

/**
 * ## test
 * [
 *      [["# kTopicStart v=1"], true],
 *      [["* kTopicStart"], true],
 *      [["// kTopicStart"], true],
 *      [["/* kTopicStart"], true],
 *      [["/* kTopicStart"], true],
 *      [["<!-- kTopicStart"], true],
 *      [["# kTopicStarttt"], false]
 * ]
 */
let isTopicStartLine = isSomeTopicLine(TOPIC_START_REGS);

let isTopicEndLine = isSomeTopicLine(TOPIC_END_REGS);

let isTopicDesStartLine = isSomeTopicLine(TOPIC_DES_START_REGS);

let isTopicDesEndLine = isSomeTopicLine(TOPIC_DES_END_REGS);

let getLineAsTopic = (line, lineIndex) => {
    if (isTopicStartLine(line)) {
        return getTopicObject(line, TOPIC_START, lineIndex);
    } else if (isTopicEndLine(line)) {
        return getTopicObject(line, TOPIC_END, lineIndex);
    } else if (isTopicDesStartLine(line)) {
        return getTopicObject(line, TOPIC_DES_START, lineIndex);
    } else if (isTopicDesEndLine(line)) {
        return getTopicObject(line, TOPIC_DES_END, lineIndex);
    }

    return {
        text: line,
        lineIndex
    };
};

let getTopicObject = (line, keyword, lineIndex) => {
    let index = line.indexOf(keyword);
    return {
        type: keyword,
        text: line,
        params: parseSimpleKVLine(line.substring(index + keyword.length)),
        lineIndex
    };
};

module.exports = (text) => {
    let lines = text.split('\n');
    let lineObjects = lines.map(getLineAsTopic);

    let [topics] = getBlocks(lineObjects, TOPIC_START, TOPIC_END);

    return topics.map((topic) => {
        let lines = topic.content;
        let [description, restLines] = getBlocks(lines, TOPIC_DES_START, TOPIC_DES_END);

        topic.description = description;
        topic.content = restLines;

        return topic;
    });
};

let getBlocks = (lineObjects, start, end) => {
    let [blocks, _, rest] = lineObjects.reduce(([blocks, cur, rest], lineObject) => { // eslint-disable-line
        if (lineObject.type === start) {
            if (!cur) {
                cur = {
                    start: lineObject,
                    content: []
                };
            }
        } else if (lineObject.type === end) {
            if (cur) {
                // finished a block
                cur.end = lineObject;
                blocks.push(cur);
                cur = null;
            }
        } else if (cur) {
            cur.content.push(lineObject);
        } else {
            rest.push(lineObject);
        }

        return [blocks, cur, rest];
    }, [
        [], null, []
    ]);

    return [blocks, rest];
};
