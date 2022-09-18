#!/usr/bin/env node
const yargs = require('yargs');
const utils = require('./utils')

const { startSession } = require('../dist/main.js')

if (yargs.argv._[0] == null) {
    utils.showHelp()
}

if (yargs.argv._[0] == 'start') {
    if (yargs.argv.late) {
        startSession(late = true)
    } else {
        startSession()
    }   
}