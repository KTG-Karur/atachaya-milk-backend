"use strict";

const { stockTransferHistoryTable } = require("../tables/index.js");
const { stockTransferHistory } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createStockTransferHistory(postData) {
  try {
    const query = generateQuery("INSERT", stockTransferHistory, stockTransferHistoryTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        stockTransferHistoryId: result.insertId,
      };
      return await getStockTransferHistory(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getStockTransferHistory(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.stockTransferHistoryId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${stockTransferHistoryTable.stockTransferHistoryId} = ${query.stockTransferHistoryId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${stockTransferHistoryTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getStockTransferHistory", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateStockTransferHistory(orgId, stockTransferHistoryId, putData) {
  try {
    const query = generateQuery("UPDATE", stockTransferHistory, stockTransferHistoryTable, putData, `WHERE ${stockTransferHistoryTable.stockTransferHistoryId} = ${stockTransferHistoryId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "stockTransferHistoryId": stockTransferHistoryId
      }
      return await getStockTransferHistory(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getStockTransferHistory,
  createStockTransferHistory,
  updateStockTransferHistory
};
