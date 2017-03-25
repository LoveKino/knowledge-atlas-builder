'use strict';

let {
    view, n
} = require('kabanery');

module.exports = view(({
    path,
    onNav
}) => {
    let parts = path.split('/');

    parts.unshift('root');

    return n('div', {
        style: {
            padding: 10,
            display: 'inline-block'
        }
    }, [
        parts.map((part, index) => {
            return n('span', [
                n('a', {
                    style: {
                        color: '#3b3a36'
                    },
                    onclick: () => {
                        onNav && onNav(part, index, parts);
                    }
                }, [part]),

                index !== parts.length - 1 && n('a', {
                    style: {
                        color: '#3b3a36'
                    }
                }, '>')
            ]);
        })
    ]);
});
