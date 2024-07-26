"use strict";

const { purchaseTable, paymentHistoryTable } = require("../tables/index.js");
const { purchase } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");
const { updatePaymentEntry, createPaymentEntry } = require("./payment-entry-service.js");
const { createPaymentHistory } = require("./payment-history-service.js");

async function createPurchase(postData) {
  try {
    const query = generateQuery("INSERT", purchase, purchaseTable, postData, `;`);
    const result = await scriptsRunner(query);
    const iql = `WHERE ${paymentHistoryTable.supplierId} = ${postData.supplierId}`
    let checkEntry = await getScriptsRunner("getPaymentEntryCheck", iql);
    if (checkEntry.length > 0) {
      const paymentEntry = await updatePaymentEntry(null, checkEntry[0].paymentEntryId, postData.paymentEntryDetails)
    } else {
      const paymentEntry = await createPaymentEntry(postData.paymentEntryDetails)
    }
    const paymentHistory = await createPaymentHistory(postData.paymentHistory)

    if (result.serverStatus == 2) {
      const request = {
        purchaseId: result.insertId,
      };
      return await getPurchase(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getPurchase(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.purchaseId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` p.${purchaseTable.purchaseId} = ${query.purchaseId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` p.${purchaseTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getPurchase", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function getPurchaseDetails(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.purchaseId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` p.${purchaseTable.purchaseId} = ${query.purchaseId}`;
      }
      if (query.supplierId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` p.${purchaseTable.supplierId} = ${query.supplierId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` p.${purchaseTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getPurchaseDetails", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updatePurchase(orgId, purchaseId, putData) {
  try {
    const query = generateQuery("UPDATE", purchase, purchaseTable, putData, `WHERE ${purchaseTable.purchaseId} = ${purchaseId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "purchaseId": purchaseId
      }
      return await getPurchase(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getPurchase,
  createPurchase,
  updatePurchase,
  getPurchaseDetails
};
