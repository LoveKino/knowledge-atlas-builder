#!/usr/bin/env node

'use strict';

let {
    build
} = require('..');

let yargs = require('yargs');

yargs.usage(`Usage: $0
    -s [knowledge directory]
    -t [targetDir]
    -c [clean]
`).demandOption(['s', 't']).help('h').alias('h', 'help');

let {
    argv
} = yargs;

build(argv.s, argv.t, {
    clean: argv.c
});
