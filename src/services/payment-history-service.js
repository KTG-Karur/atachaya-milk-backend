"use strict";

const { paymentHistoryTable } = require("../tables/index.js");
const { paymentHistory } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createPaymentHistory(postData) {
  try {
    const query = generateQuery("INSERT", paymentHistory, paymentHistoryTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        paymentHistoryId: result.insertId,
      };
      return await getPaymentHistory(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getPaymentHistory(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.paymentHistoryId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${paymentHistoryTable.paymentHistoryId} = ${query.paymentHistoryId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${paymentHistoryTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getPaymentHistory", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updatePaymentHistory(orgId, paymentHistoryId, putData) {
  try {
    const query = generateQuery("UPDATE", paymentHistory, paymentHistoryTable, putData, `WHERE ${paymentHistoryTable.paymentHistoryId} = ${paymentHistoryId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "paymentHistoryId": paymentHistoryId
      }
      return await getPaymentHistory(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getPaymentHistory,
  createPaymentHistory,
  updatePaymentHistory
};
