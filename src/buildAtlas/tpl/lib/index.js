'use strict';

require('../../../../node_modules/quick-steady-theme/index.css');
require('../../../../node_modules/github-markdown-css/github-markdown.css');

let {
    n, view, mount
} = require('kabanery');

let {
    getTopic
} = require('./store');

let DirPanel = require('./view/DirPanel');

let FilePanel = require('./view/filePanel');

let Nav = require('./view/nav');

let {
    getAtlasPageData
} = require('./model');

let PageView = view(({
    fileInfo,
    topics
}, {
    update
}) => {
    window.location.hash = `#${fileInfo.path}`;

    return n('div', [
        Nav({
            path: fileInfo.path,
            onNav: (part, index, parts) => {
                let path = parts.slice(1, index + 1).join('/');

                getAtlasPageData(path).then(({
                    fileInfo, topics
                }) => {
                    update([
                        ['fileInfo', fileInfo],
                        ['topics', topics]
                    ]);
                });
            }
        }),

        fileInfo.type === 'directory' && DirPanel({
            dirTreeInfo: fileInfo,
            onChosenFile: (file) => {
                if (file.type === 'directory') {
                    update('fileInfo', file);
                } else if (file.type === 'file') {
                    getTopic(file.path).then((topics) => {
                        update([
                            ['topics', topics],
                            ['fileInfo', file]
                        ]);
                    });
                }
            }
        }),

        fileInfo.type === 'file' && topics && FilePanel({
            fileInfo,
            topics
        })
    ]);
});

let pageView = null;

window.onload = () => {
    let path = window.location.hash;
    path = path.substring(1);

    getAtlasPageData(path).then((pageData) => {
        pageView = PageView(pageData);
        mount(pageView, document.getElementById('pager'));
    });
};
