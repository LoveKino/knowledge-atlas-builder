'use strict';

let {
    getDirTreeInfo, getTopic
} = require('../store');


let findFile = (data, path) => {
    return findFileByParts(data, path.split('/'));
};

let findFileByParts = (data, parts) => {
    if (!parts.length) return data;
    return findFileByParts(getNextFile(data, parts[0]), parts.slice(1));
};

let getNextFile = (data, name) => {
    if (data.type === 'directory') {
        return data.files.find((file) => file.name === name);
    }
};

let getAtlasPageData = (path) => {
    return getDirTreeInfo().then((data) => {
        let fileInfo = data;
        if (path) {
            fileInfo = findFile(data, path);
        }

        let pageData = {
            fileInfo
        };
        if (fileInfo.type === 'file') {
            return getTopic(fileInfo.path).then((topics) => {
                pageData.topics = topics;
                return pageData;
            });
        } else {
            return pageData;
        }
    });
};

module.exports = {
    findFile,
    getAtlasPageData
};
