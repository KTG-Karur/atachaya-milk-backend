"use strict";

const { customerAdvanceTable } = require("../tables/index.js");
const { customerAdvance } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createCustomerAdvance(postData) {
  try {
    const query = generateQuery("INSERT", customerAdvance, customerAdvanceTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        customerAdvanceId: result.insertId,
      };
      return await getCustomerAdvance(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getCustomerAdvance(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.customerAdvanceId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${customerAdvanceTable.customerAdvanceId} = ${query.customerAdvanceId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${customerAdvanceTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getCustomerAdvance", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateCustomerAdvance(orgId, customerAdvanceId, putData) {
  try {
    const query = generateQuery("UPDATE", customerAdvance, customerAdvanceTable, putData, `WHERE ${customerAdvanceTable.customerAdvanceId} = ${customerAdvanceId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "customerAdvanceId": customerAdvanceId
      }
      return await getCustomerAdvance(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getCustomerAdvance,
  createCustomerAdvance,
  updateCustomerAdvance
};
