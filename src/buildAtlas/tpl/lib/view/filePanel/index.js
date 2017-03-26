'use strict';

let {
    view, n
} = require('kabanery');

module.exports = view(({
    topics
}) => {
    return n('div', [
        topics.map(renderTopic)
    ]);
});

let renderTopic = (topic) => {
    return n('div class="card"', {
        style: {
            minWidth: '80%'
        }
    }, [
        // render content
        renderContent(topic),

        // render console
        renderConsole(topic)
    ]);
};

let renderContent = (topic) => {
    return n('div', [
        // render content
        topic.format === 'md' ? n('div', [innerHtmlNode(topic.content)]) : n('pre',
            n('code', [topic.content])
        )
    ]);
};

let renderConsole = (topic) => {
    if (topic.console) {
        return n('pre', {
            style: {
                backgroundColor: '#002833',
                color: '#93a1a1',
                padding: 10
            }
        }, [topic.console]);
    }
};

let innerHtmlNode = (str) => {
    let node = n('article class="markdown-body"');
    node.innerHTML = str;
    return node;
};
