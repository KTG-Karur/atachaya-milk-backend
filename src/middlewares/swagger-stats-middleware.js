'use strict';

const swStats = require('swagger-stats');

const factorConfig = require('../config/12-factor-config');

module.exports = function swaggerStatsFactory() {
    return swStats.getMiddleware({
        uriPath: '/api-stats'
    },);
};
