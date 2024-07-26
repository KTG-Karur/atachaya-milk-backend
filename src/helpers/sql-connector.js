"use strict";
const MySql = require("mysql");
const scripts = require("../scripts/sql-scripts");
const { executionTypes } = require("./dataserverhelpers");

module.exports = function () {
  function connector(dbSettings) {
    this.type = dbSettings.type;
    this.name = dbSettings.name;
    this.pool = MySql.createPool(dbSettings); // Creating a MySQL connection pool
    this.pool.on("error", (err) => {
      console.log(`Error on MySQL Pool`);
      console.log("error ", err);
    });
  }

  // Method to get a connection from the pool
  connector.prototype.getConnection = async function () {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(connection);
        }
      });
    });
  };
  /**
* 
  @param executionType define the execution type of the query
  * @param scriptObj use to find query by db type
  * @param parameter query parameters
  * @method execute
  * @returns result of the query execution
  */
  connector.prototype.execute = async function (
    executionType,
    scriptObj,
    parameter
  ) {
    let script;
    if (executionType == executionTypes.sql.singleWithReplace) {
      let index = 1;
      script = scripts[scriptObj];
      parameter.forEach((element) => {
        const toChange = `@param` + index;
        script = script.toString().replace(toChange, element);
        index += 1;
      });
    } else if (executionType === executionTypes.sql.customQuery) {
      script = scriptObj;
    } else {
      throw new Error("Mis-Match ExecutionType...!");
    }
    const client = await this.getConnection();
    let result;
    try {
      result = await queryPromise(client, script);
    } finally {
      if (client) client.release();
    }
    return JSON.parse(JSON.stringify(result));
  };

  function queryPromise(client, sql) {
    return new Promise((resolve, reject) => {
      client.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  return connector;
};
