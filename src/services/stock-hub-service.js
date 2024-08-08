"use strict";

const { stockHubTable } = require("../tables/index.js");
const { stockHub } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createStockHub(postData) {
  try {
    const query = generateQuery("INSERT", stockHub, stockHubTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        stockHubId: result.insertId,
      };
      return await getStockHub(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getStockHub(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.stockHubId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${stockHubTable.stockHubId} = ${query.stockHubId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${stockHubTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getStockHub", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateStockHub(orgId, stockHubId, putData) {
  try {
    const query = generateQuery("UPDATE", stockHub, stockHubTable, putData, `WHERE ${stockHubTable.stockHubId} = ${stockHubId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "stockHubId": stockHubId
      }
      return await getStockHub(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getStockHub,
  createStockHub,
  updateStockHub
};
