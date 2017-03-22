'use strict';

let promisify = require('es6-promisify');
let fs = require('fs');
let path = require('path');

const TPL_INDEX_HTML = path.resolve(__dirname, './tpl/index.html');
const TPL_INDEX_JS = path.resolve(__dirname, './tpl/index.js');

module.exports = (infos, targetDir, options) => {
    let tarHTML = path.resolve(targetDir, './index.html');
    let tarJS = path.resolve(targetDir, './index.js');
    return Promise.all([
        copyFile(TPL_INDEX_HTML, tarHTML),
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
