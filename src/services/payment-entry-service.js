"use strict";

const { paymentEntryTable } = require("../tables/index.js");
const { paymentEntry } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createPaymentEntry(postData) {
  try {
    console.log(postData)
    const query = generateQuery("INSERT", paymentEntry, paymentEntryTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        paymentEntryId: result.insertId,
      };
      return await getPaymentEntry(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getPaymentEntry(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.paymentEntryId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` pe.${paymentEntryTable.paymentEntryId} = ${query.paymentEntryId}`;
      }
      if (query.supplierId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` pe.${paymentEntryTable.supplierId} = ${query.supplierId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` pe.${paymentEntryTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getPaymentEntry", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updatePaymentEntry(orgId, paymentEntryId, putData) {
  try {
    const query = generateQuery("UPDATE", paymentEntry, paymentEntryTable, putData, `WHERE ${paymentEntryTable.paymentEntryId} = ${paymentEntryId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "paymentEntryId": paymentEntryId
      }
      return await getPaymentEntry(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getPaymentEntry,
  createPaymentEntry,
  updatePaymentEntry
};
