'use strict';

async function serverLog() {
    try {
    const factorConfig = require('../src/config/12-factor-config');
    
    function getLogService(factorConfig) {
        const debug = require('debug');
        debug.enable(factorConfig.debug);

        return require('../src/services/log-service');
    };

    function monitorAndLog(server, port, factorConfig) {
        const logService = getLogService(factorConfig);
        const onError = require('./server-error');
        server.on('error', onError);
        const logStart = require('./server-start');
        logStart(port, factorConfig.nodeEnv, logService);
    }
    
    /* Initialize the db connection here */
    global.datasources = await require('../src/helpers/datasource-connector')()
        .catch(err=>{
            const logService = getLogService(factorConfig);
            logService.getErrorLogger(err.stack);
            console.log(err);
            //  process.exit(1);
        });
        
    const app = require('../src/app');
    const port = parseInt(factorConfig.desiredPort, 10);
    const server = app.listen(port);
    console.log('App is ready to use. running on port : ' + factorConfig.desiredPort);
    monitorAndLog(server, port, factorConfig);
    } catch(e) {
        throw e;
    }
}

serverLog();
