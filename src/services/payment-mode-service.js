"use strict";

const { paymentModeTable } = require("../tables/index.js");
const { paymentMode } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createPaymentMode(postData) {
  try {
    const query = generateQuery("INSERT", paymentMode, paymentModeTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        paymentModeId: result.insertId,
      };
      return await getPaymentMode(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getPaymentMode(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.paymentModeId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${paymentModeTable.paymentModeId} = ${query.paymentModeId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${paymentModeTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getPaymentMode", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updatePaymentMode(orgId, paymentModeId, putData) {
  try {
    const query = generateQuery("UPDATE", paymentMode, paymentModeTable, putData, `WHERE ${paymentModeTable.paymentModeId} = ${paymentModeId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "paymentModeId": paymentModeId
      }
      return await getPaymentMode(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getPaymentMode,
  createPaymentMode,
  updatePaymentMode
};
