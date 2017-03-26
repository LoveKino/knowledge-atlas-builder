'use strict';

let marked = require('marked');
let path = require('path');
let getConsole = require('./getConsole');

module.exports = (topic, fileInfo) => {
    let contentStr = getContentStr(topic);
    let format = getTopicContentFormat(topic, fileInfo);

    topic.format = format;

    // parse content
    topic.content = format === 'md' ? marked(contentStr) : contentStr;

    // console
    return Promise.resolve(getConsole(topic, fileInfo)).then((consoleData) => {
        topic.console = consoleData;
        return topic;
    });
};

let getTopicContentFormat = (topic, fileInfo) => {
    return topic.start.params.format || path.extname(fileInfo.path).substring(1);
};

let getContentStr = (topic) => {
    return topic.content.map(({
        text
    }) => {
        return text;
    }).join('\n');
};
