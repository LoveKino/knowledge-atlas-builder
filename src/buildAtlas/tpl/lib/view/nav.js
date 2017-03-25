'use strict';

let {
    view, n
} = require('kabanery');

module.exports = view(({
    path
}) => {
    let parts = path.split('/');

    return n('div', [
        parts.map((part) => {
            return n('a', [part]);
        })
    ]);
});
