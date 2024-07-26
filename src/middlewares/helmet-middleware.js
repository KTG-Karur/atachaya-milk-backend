'use strict';

const helmet = require('helmet');

module.exports = function helmetFactory() {
    return helmet();
};
