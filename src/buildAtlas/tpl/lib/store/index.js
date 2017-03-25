'use strict';

let Data = require('../util/data');

let {
    getData
} = Data();

const DIR_TREE_INFO = 'dirTreeInfo';
const TOPIC_PATH_MAP = 'topicPathMap';

let getDirTreeInfo = () => {
    return getData(DIR_TREE_INFO);
};

let getTopicPathMap = () => {
    return getData(TOPIC_PATH_MAP);
};

let getTopic = (path) => {
    return getTopicPathMap().then((topicPathMap) => {
        let id = topicPathMap[path];
        return getData(id, 'topics');
    });
};

module.exports = {
    getDirTreeInfo,
    getTopicPathMap,
    getTopic
};
