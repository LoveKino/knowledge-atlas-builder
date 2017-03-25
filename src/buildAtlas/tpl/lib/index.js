'use strict';

require('../../../../node_modules/quick-steady-theme/index.css');

let {
    n, view, mount
} = require('kabanery');

let {
    getDirTreeInfo, getTopic
} = require('./store');

let DirPanel = require('./view/DirPanel');

let FilePanel = require('./view/filePanel');

let PageView = view(({
    fileInfo,
    topics
}, {
    update
}) => {
    return n('div', [
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

        fileInfo.type === 'file' && FilePanel({
            fileInfo,
            topics
        })
    ]);
});

let pageView = null;

window.onload = () => {
    getDirTreeInfo().then((data) => {
        pageView = PageView({
            fileInfo: data
        });
        // render tree
        document.body.appendChild(pageView);

        mount(pageView, document.getElementById('pager'));
    });
};
