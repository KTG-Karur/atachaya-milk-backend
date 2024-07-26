'use strict';
const { databaseTypes } = require('./dataserverhelpers.js');
const MySqlConnector = require('./sql-connector.js')();
const createDatasources = async () => {
  const datasources = {};
  const definition = require('../config/dbConfig.js').databaseConfig;
  for (const setting of definition) {
    let connector;
    if (setting.type == databaseTypes.sql) {
      connector = new MySqlConnector(setting);
      console.log('Connected To MY-SQL')
      await connector.getConnection();
    } else{
      console.log("Mismatched DB....?")
      return
    }
    if (connector)
      datasources[setting.name] = connector;
  }

  return datasources;
};
module.exports = createDatasources;

