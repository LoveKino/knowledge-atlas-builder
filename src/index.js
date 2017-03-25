'use strict';

let analysis = require('./analysis');
let buildAtlas = require('./buildAtlas');
let path = require('path');
let promisify = require('es6-promisify');
let mkdirp = promisify(require('mkdirp'));

let currentwd = process.cwd();

/**
 * process
 *
 * step1: analysis information from knowledge directory
 *
 * step2: render atlas according to those information
 */
let build = (knowledgeDir, targetDir, options) => {
    knowledgeDir = path.resolve(currentwd, knowledgeDir);
    targetDir = path.resolve(currentwd, targetDir);

    return mkdirp(targetDir).then(() => {
        return analysis(knowledgeDir, options).then((infos) => {
            return buildAtlas(infos, targetDir, options);
        });
    });
};

module.exports = {
    build
};
