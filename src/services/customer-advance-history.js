"use strict";

const { customerAdvanceHistoryTable } = require("../tables/index.js");
const { customerAdvanceHistory } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createCustomerAdvanceHistory(postData) {
  try {
    const query = generateQuery("INSERT", customerAdvanceHistory, customerAdvanceHistoryTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        customerAdvanceHistoryId: result.insertId,
      };
      return await getCustomerAdvanceHistory(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getCustomerAdvanceHistory(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.customerAdvanceHistoryId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${customerAdvanceHistoryTable.customerAdvanceHistoryId} = ${query.customerAdvanceHistoryId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${customerAdvanceHistoryTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getCustomerAdvanceHistory", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateCustomerAdvanceHistory(orgId, customerAdvanceHistoryId, putData) {
  try {
    const query = generateQuery("UPDATE", customerAdvanceHistory, customerAdvanceHistoryTable, putData, `WHERE ${customerAdvanceHistoryTable.customerAdvanceHistoryId} = ${customerAdvanceHistoryId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "customerAdvanceHistoryId": customerAdvanceHistoryId
      }
      return await getCustomerAdvanceHistory(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getCustomerAdvanceHistory,
  createCustomerAdvanceHistory,
  updateCustomerAdvanceHistory
};
