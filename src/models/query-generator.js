"use strict";

const _ = require("lodash");
const { executionTypes } = require("../helpers/dataserverhelpers");
const { scripts } = require("../scripts");

function generateQuery(
  action,
  tableName,
  tableKeyProperty,
  dataValueProperty,
  returnCondition = ""
) {
  let query = "";
  switch (action) {
    case "INSERT":
      let isArrayData = _.isArray(dataValueProperty);
      let reqData = isArrayData ? dataValueProperty[0] : dataValueProperty;

      var keyData = [];
      var valueData = [];

      for (const proKey in reqData) {
        if (tableKeyProperty[proKey]) {
          keyData.push(tableKeyProperty[proKey]);
          valueData.push(reqData[proKey]);
        }
      }
      let quertValue = `('${valueData.join("','")}')`;
      if (isArrayData) {
        for (let i = 1; i < dataValueProperty.length; i++) {
          var multiValue = [];
          for (const proKey in dataValueProperty[i]) {
            if (tableKeyProperty[proKey]) {
              multiValue.push(dataValueProperty[i][proKey]);
            }
          }
          quertValue += `, ('${multiValue.join("','")}')`;
        }
      }
      query = `INSERT INTO ${tableName} (${keyData.join()}) VALUES ${quertValue} ${returnCondition} `;
      break;

    case "UPDATE":
      
      let isUpdateArrayData = _.isArray(dataValueProperty);
      let reqUpdateData = isUpdateArrayData
        ? dataValueProperty[0]
        : dataValueProperty;

      let queries = [];
      var queryConstructorValue = "";

      if (isUpdateArrayData) {
        /*   for (let i = 0; j < dataValueProperty.length; i++) {
          for (const proKey in dataValueProperty[i]) {
            if (tableKeyProperty[proKey]) {
              queryConstructorValue.push(
                tableKeyProperty[proKey] + `= ${dataValueProperty[i][proKey]}`
              );
            }
            queryUpdateValue = `UPDATE ${tableName} SET ('${queryConstructorValue.join("','")}') ${returnCondition[i]};`;
            queries.push(queryUpdateValue);
          }
        } */
      } else {
        let totalProperties = Object.keys(dataValueProperty).length;
        let currentPropertyIndex = 0;
        for (const proKey in dataValueProperty) {
          if (tableKeyProperty[proKey]) {
            queryConstructorValue += queryConstructorValue ? ", " : " ";
            queryConstructorValue += tableKeyProperty[proKey] + " = '" + reqUpdateData[proKey] + "'";
          }
        
        }
        query = `UPDATE ${tableName} SET ${queryConstructorValue} ${returnCondition} `;
      }
      query = isUpdateArrayData ? queries.join("';'") : query;
      break;

    case "DELETE":
      query = `DELETE FROM ${tableName} ${returnCondition};`;
      break;
  }

  return query;
}

async function getScriptsRunner(scriptName, iql) {
  const res = await global.datasources.atachaya_admin.execute(executionTypes.sql.singleWithReplace, scripts[scriptName], [iql])
    .catch(function (err) {
      throw err;
    });
  return res;
}

async function getScriptsIds(idName) {
  const scriptData = `SELECT LAST_INSERT_ID() AS ${idName};`;
  const res = await global.datasources.atachaya_admin.execute(executionTypes.sql.customQuery, scriptData, [iql])
    .catch(function (err) {
      throw err;
    });
  return res;
}

async function scriptsRunner(query) {
  const res = await global.datasources.atachaya_admin.execute(executionTypes.sql.customQuery, query)
    .catch(function (err) {
      throw err;
    });
  return res;
}

module.exports = {
  generateQuery,
  getScriptsRunner,
  getScriptsIds,
  scriptsRunner,
};
