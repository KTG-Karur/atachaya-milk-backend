"use strict";

const { expensiveTable } = require("../tables/index.js");
const { expensive } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createExpensive(postData) {
  try {
    const query = generateQuery("INSERT", expensive, expensiveTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        expensiveId: result.insertId,
      };
      return await getExpensive(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getExpensive(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.expensiveId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` e.${expensiveTable.expensiveId} = ${query.expensiveId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` e.${expensiveTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getExpensive", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateExpensive(orgId, expensiveId, putData) {
  try {
    const query = generateQuery("UPDATE", expensive, expensiveTable, putData, `WHERE ${expensiveTable.expensiveId} = ${expensiveId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "expensiveId": expensiveId
      }
      return await getExpensive(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getExpensive,
  createExpensive,
  updateExpensive
};
