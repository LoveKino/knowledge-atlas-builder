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
    return n('pre class="card"', [
        // source
        n('code',
            topic.content.map(({
                text
            }) => {
                return text;
            }).join('\n')
        )
    ]);
};
