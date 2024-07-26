"use strict";

const { advanceTable, paymentHistoryTable } = require("../tables/index.js");
const { advance, paymentHistory } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");
const { createPaymentEntry, updatePaymentEntry } = require("./payment-entry-service.js");

async function createAdvance(postData) {
    try {
      const query = generateQuery("INSERT", paymentHistory, paymentHistoryTable, postData, `;`);
      const result = await scriptsRunner(query);
      const iql = `WHERE ${paymentHistoryTable.supplierId} = ${postData.supplierId}`
      let checkEntry = await getScriptsRunner("getPaymentEntryCheck", iql);
      const paymentEntryReq={
        supplierId : postData.supplierId,
        advanceAmt : postData.advanceAmount,
        isAdvance: 1,
      }
      
      if(checkEntry.length > 0){
        paymentEntryReq.advanceAmt =parseInt(postData.advanceAmount) + parseInt(checkEntry[0].advanceAmt)
        const paymentEntry = await updatePaymentEntry(null, checkEntry[0].paymentEntryId, paymentEntryReq)
      }else{
        const paymentEntry = await createPaymentEntry(paymentEntryReq)
      }
      if (result.serverStatus == 2) {
        const request = {
          paymentHistoryId: result.insertId,
          isAdvance: true
        };
        return await getAdvance(request);
      }
      throw new Error(messages.OPERATION_ERROR);
    } catch (error) {
      throw error;
    }
}

async function getAdvance(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.paymentHistoryId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ph.${paymentHistoryTable.paymentHistoryId} = ${query.paymentHistoryId}`;
      }
      if (query.isAdvance) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ph.${paymentHistoryTable.isAdvance} = ${query.isAdvance}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ph.${paymentHistoryTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getAdvance", iql);
    return result;
  } catch (error) {
    throw error;
  }
}


async function updateAdvance(orgId, paymentHistoryId, putData) {
    try {
      if(putData.isActive == 0){
        const query = generateQuery("DELETE", paymentHistory, null, null, `WHERE ${paymentHistoryTable.paymentHistoryId} = ${paymentHistoryId};`);
        const result = await scriptsRunner(query);
         const iql = `WHERE ph.${paymentHistoryTable.supplierId} = ${putData.supplierId}`
        let checkEntry = await getScriptsRunner("getPaymentHistroyCheck", iql);
        const paymentEntryReq={
          supplierId : putData.supplierId,
          advanceAmt : checkEntry[0].advanceAmount,
        }
        const paymentEntry = await updatePaymentEntry(null, checkEntry[0].paymentEntryId, paymentEntryReq)
        return "deleted Successfully";
      }else{
        const query = generateQuery("UPDATE", paymentHistory, paymentHistoryTable, putData, `WHERE ${paymentHistoryTable.paymentHistoryId} = ${paymentHistoryId};`);
        const result = await scriptsRunner(query);
        const iql = `WHERE ph.${paymentHistoryTable.supplierId} = ${putData.supplierId}`
        let checkEntry = await getScriptsRunner("getPaymentHistroyCheck", iql);
        const paymentEntryReq={
          supplierId : putData.supplierId,
          advanceAmt : checkEntry[0].advanceAmount,
        }
        const paymentEntry = await updatePaymentEntry(null, checkEntry[0].paymentEntryId, paymentEntryReq)
        if (result.serverStatus == 2) {
          const request = {
            "paymentHistoryId": paymentHistoryId,
            isAdvance: true
          }
          return await getAdvance(request)
        }
      }
      throw new Error(messages.OPERATION_ERROR)
    } catch (error) {
      throw error;
    }
  }

module.exports = {
  getAdvance,
  createAdvance,
  updateAdvance
};
