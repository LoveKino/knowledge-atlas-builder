'use strict';

let {
    filesTree
} = require('dir-tree-info');
let promisify = require('es6-promisify');
let path = require('path');
let fs = require('fs');
let parseText = require('./parseText');

let readFile = promisify(fs.readFile);

module.exports = (knowledgeDir) => {
    return filesTree(knowledgeDir, 0, path.basename(knowledgeDir, path.extname(knowledgeDir))).then((dirTreeInfo) => {
        dirTreeInfo = wipe(dirTreeInfo, knowledgeDir);

        return Promise.all(parseTreeText(dirTreeInfo, knowledgeDir)).then((topicInfos) => {
            return {
                dirTreeInfo,
                topicInfos
            };
        });
    });
};

let parseTreeText = (dirTreeInfo, knowledgeDir) => {
    if (dirTreeInfo.type === 'file') {
        let realPath = path.resolve(knowledgeDir, dirTreeInfo.path);

        return [readFile(realPath, 'utf-8').then(parseText).then((topics) => {
            return {
                topics,
                path: dirTreeInfo.path // relative path
            };
        })];
    } else if (dirTreeInfo.type === 'directory') {
        let files = dirTreeInfo.files;

        return files.reduce((prev, file) => {
            prev = prev.concat(parseTreeText(file, knowledgeDir));

            return prev;
        }, []);
    }
};

let wipe = (dirTreeInfo, knowledgeDir) => {
    return {
        path: path.relative(knowledgeDir, dirTreeInfo.path),
        name: dirTreeInfo.name,
        type: dirTreeInfo.type,
        files: (dirTreeInfo.files || []).map((file) => {
            return wipe(file, knowledgeDir);
        })
    };
};
