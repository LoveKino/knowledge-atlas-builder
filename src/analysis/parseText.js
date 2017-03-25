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
const TOPIC_PREFIXS = ['#', '//', '\\\*', '<\\\!\\\-\\\-', '/\\\*'];

let getTopicLineReg = (type, prefix) => {
    return new RegExp(`^\\s*${prefix}\\s*${type}(\\s+.*)?$`);
};

const TOPIC_START_REGS = TOPIC_PREFIXS.map((prefix) => getTopicLineReg(TOPIC_START, prefix));

const TOPIC_END_REGS = TOPIC_PREFIXS.map((prefix) => getTopicLineReg(TOPIC_END, prefix));

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

let getLineAsTopic = (line, lineIndex) => {
    if (isTopicStartLine(line)) {
        return getTopicObject(line, TOPIC_START, lineIndex);
    } else if (isTopicEndLine(line)) {
        return getTopicObject(line, TOPIC_END, lineIndex);
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

    // group
    let [topics] = lineObjects.reduce(([topics, cur], lineObject) => {
        if (lineObject.type === TOPIC_START) {
            if (!cur) {
                cur = {
                    start: lineObject,
                    content: []
                };
            }
        } else if (lineObject.type === TOPIC_END) {
            if (cur) { // finished a topic
                cur.end = lineObject;
                topics.push(cur);
                cur = null;
            }
        } else {
            if (cur) {
                cur.content.push(lineObject);
            }
        }

        return [topics, cur];
    }, [
        [], null
    ]);

    return topics;
};
