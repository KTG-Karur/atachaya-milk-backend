"use strict";

const { purchaseTable, paymentHistoryTable, paymentEntryTable } = require("../tables/index.js");
const { purchase, paymentEntry, paymentHistory } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");
const { updatePaymentEntry, createPaymentEntry } = require("./payment-entry-service.js");
const { createPaymentHistory, updatePaymentHistory, getPaymentHistory } = require("./payment-history-service.js");
const { updateStockHub, createStockHub } = require("./stock-hub-service.js");

async function createPurchase(postData) {
  try {
    const paymentHistory = await createPaymentHistory(postData.paymentHistory)
    postData.paymentHistoryId = paymentHistory[0].paymentHistoryId
    const query = generateQuery("INSERT", purchase, purchaseTable, postData, `;`);
    const result = await scriptsRunner(query);
    
    const iql = `WHERE ${paymentHistoryTable.supplierId} = ${postData.supplierId}`
    
    let checkEntry = await getScriptsRunner("getPaymentEntryCheck", iql);
    
    if (checkEntry.length > 0) {
      const paymentEntry = await updatePaymentEntry(null, checkEntry[0].paymentEntryId, postData.paymentEntryDetails)
    } else {
      const paymentEntry = await createPaymentEntry(postData.paymentEntryDetails,"purchaseEntry")
    }
    let iql2 = ""
    let hubCheck = await getScriptsRunner("getHubCheck", iql2);
    
    const hubRequest={
      totalQty : postData.qty
    }
    
    if (hubCheck.length > 0) {
      hubRequest.totalQty = parseInt(postData.qty) + parseInt(hubCheck[0].totalQty)
      const hubStockRes = await updateStockHub(null, hubCheck[0].stockHubId, hubRequest)
    } else {
      const hubStockRes = await createStockHub(hubRequest)
    }
    
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
    if(putData.isDelete == 1){
      const req={
        paymentHistoryId : putData.paymentHistoryId
      }
      const historyData = await getPaymentHistory(req)
      const updateRequest = {
        advanceAmt : historyData[0]?.advanceAmount || ""
      }
      const paymentEntryQuery = generateQuery("UPDATE", paymentEntry, paymentEntryTable, updateRequest, `WHERE ${paymentEntryTable.supplierId} = ${putData.supplierId};`);
      const resultEntry = await scriptsRunner(paymentEntryQuery);

      const query = generateQuery("DELETE", purchase, null, null, `WHERE ${purchaseTable.purchaseId} = ${purchaseId};`);
      const result = await scriptsRunner(query);

      const historyQuery = generateQuery("DELETE", paymentHistory, null, null, `WHERE ${paymentHistoryTable.paymentHistoryId} = ${putData.paymentHistoryId};`);
      const historyResult = await scriptsRunner(historyQuery);
      return true;
    }else{
      const query = generateQuery("UPDATE", purchase, purchaseTable, putData, `WHERE ${purchaseTable.purchaseId} = ${purchaseId};`);
      const result = await scriptsRunner(query);
      const iql = `WHERE ${paymentHistoryTable.supplierId} = ${putData.supplierId}`
      let checkEntry = await getScriptsRunner("getPaymentEntryCheck", iql);
      if (checkEntry.length > 0) {
        const paymentEntry = await updatePaymentEntry(null, checkEntry[0].paymentEntryId, putData.paymentEntryDetails)
      } else {
        const paymentEntry = await createPaymentEntry(putData.paymentEntryDetails)
      }
      
      const paymentHistory = await updatePaymentHistory(null, putData.paymentHistory.paymentHistoryId ,putData.paymentHistory)
      if (result.serverStatus == 2) {
        const request = {
          "purchaseId": purchaseId
        }
        return await getPurchase(request)
      }
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
