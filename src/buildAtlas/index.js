'use strict';

let fs = require('fs');
let path = require('path');
let promisify = require('es6-promisify');
let writeFile = promisify(fs.writeFile);
let mkdirp = promisify(require('mkdirp'));
let uuidv4 = require('uuid/v4');

const TPL_INDEX_HTML = path.resolve(__dirname, './tpl/index.html');
const TPL_INDEX_CSS = path.resolve(__dirname, './tpl/styles.css');
const TPL_INDEX_JS = path.resolve(__dirname, './tpl/index.js');

module.exports = ({
    dirTreeInfo,
    topicInfos
}, targetDir) => {
    let targetDataDir = path.join(targetDir, 'data');
    let targetTopicInfoDir = path.join(targetDataDir, 'topics');

    return Promise.all([
        copyTplFiles(targetDir),

        mkdirp(targetDataDir).then(() => {
            return Promise.all([
                saveData(targetDataDir, dirTreeInfo, 'dirTreeInfo'),

                mkdirp(targetTopicInfoDir).then(() => {
                    return saveTopics(topicInfos, targetTopicInfoDir).then((topicPathMap) => {
                        return saveData(targetDataDir, topicPathMap, 'topicPathMap');
                    });
                })
            ]);
        })
    ]);
};

let saveTopics = (topicInfos, targetTopicInfoDir) => {
    let topicPathMap = {};
    // save topicInfos
    return Promise.all(topicInfos.map((topicInfo) => {
        let id = uuidv4();
        topicPathMap[topicInfo.path] = id;

        return saveData(targetTopicInfoDir, topicInfo.topics, id);
    })).then(() => {
        return topicPathMap;
    });
};

let copyTplFiles = (targetDir) => {
    let tarHTML = path.resolve(targetDir, './index.html');
    let tarCSS = path.resolve(targetDir, './styles.css');
    let tarJS = path.resolve(targetDir, './index.js');

    return Promise.all([
        copyFile(TPL_INDEX_HTML, tarHTML),
        copyFile(TPL_INDEX_CSS, tarCSS),
        copyFile(TPL_INDEX_JS, tarJS)
    ]);
};

let copyFile = (src, tar) => {
    let readable = fs.createReadStream(src);
    let writable = fs.createWriteStream(tar);

    return new Promise((resolve, reject) => {
        readable.pipe(writable).on('finish', resolve);
        writable.on('error', reject);
        readable.on('error', (err) => {
            writable.end();
            reject(err);
        });
    });
};

let saveData = (targetDir, info, id) => {
    let tarPath = path.resolve(targetDir, `${id}.js`);
    let str = `window.jsData("${id}", ${JSON.stringify(info)});`;
    return writeFile(tarPath, str, 'utf-8');
};
