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

    topic.description = marked(getTopicDescription(topic));

    // TODO highlight code

    // console
    return Promise.resolve(getConsole(topic, fileInfo)).then((consoleData) => {
        topic.console = consoleData;
        return topic;
    });
};

let getTopicDescription = (topic) => {
    return topic.description.map((des) => {
        let offset = des.start.text.indexOf(des.start.type);
        return des.content.map(({
            text
        }) => {
            return text.substring(offset);
        }).join('\n');
    }).join('\n');
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
