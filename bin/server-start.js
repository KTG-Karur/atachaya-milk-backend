'use strict';

function logStart(port, environment, logService) {
    const pkgJSON = require('../package.json');
    const writeInfo = logService.getInfoLogger('server');

    writeInfo(`Starting ${pkgJSON.name} on port ${port}, environment is ${environment}`);
}

module.exports = logStart;