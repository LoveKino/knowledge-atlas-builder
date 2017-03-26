'use strict';

let {
    exec
} = require('child_process');

let uuidv4 = require('uuid/v4');
let promisify = require('es6-promisify');
let fs = require('fs');
let path = require('path');
let del = require('del');
let writeFile = promisify(fs.writeFile);

let defaultRunTypeMap = {
    c: 'gcc'
};

let getRunType = (topic, fileInfo) => {
    return topic.start.params.tar || defaultRunTypeMap[path.extname(fileInfo.path).substring(1)];
};

let gcc = (topic) => {
    let {
        content
    } = topic;

    let tmpCName = `${uuidv4()}.c`,
        tmpOName = `${uuidv4()}.o`;
    let tmpCFile = path.resolve(__dirname, tmpCName);
    let tmpOFile = path.resolve(__dirname, tmpOName);

    let clear = () => {
        return del([tmpCFile, tmpOFile], {
            force: true
        });
    };

    return writeFile(tmpCFile, content, 'utf-8').then(() => {
        return new Promise((resolve, reject) => {
            exec(`gcc -o ${tmpOName} ${tmpCName} && ./${tmpOName}`, {
                cwd: __dirname
            }, (err, stdout) => {
                if (err) reject(err);
                else resolve(stdout);
            });
        }).then((str) => {
            return clear().then(() => {
                return str;
            });
        }).catch((err) => {
            return clear().then(() => {
                throw err;
            });
        });
    });
};

let runConsoleMap = {
    gcc
};

module.exports = (topic, fileInfo) => {
    let runType = getRunType(topic, fileInfo);
    let run = runConsoleMap[runType];

    return run && run(topic);
};
