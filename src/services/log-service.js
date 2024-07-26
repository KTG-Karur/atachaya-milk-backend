'use strict';

const debug = require('debug');
const factorConfig = require('../config/12-factor-config');

/* eslint-disable no-console */
const factory = {
    getErrorLogger: (name) => {
        const logger = debug(`${factorConfig.appName}:${name} - ERROR`);
        logger.log = console.error.bind(console);
        return logger;
    },
    getWarnLogger: (name) => {
        const logger = debug(`${factorConfig.appName}:${name} - WARN`);
        logger.log = console.warn.bind(console);
        return logger;
    },
    getInfoLogger: (name) => {
        const logger = debug(`${factorConfig.appName}:${name} - INFO`);
        logger.log = console.info.bind(console);
        return logger;
    },
    getDebugLogger: (name) => {
        const logger = debug(`${factorConfig.appName}:${name} - DEBUG`);
        logger.log = console.log.bind(console);
        return logger;
    },
};


module.exports = factory;
