"use strict";

const { customerTable } = require("../tables/index.js");
const { customer } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");
const { generateSerialNumber } = require("../utils/appfunction.js");

async function createCustomer(postData) {
  try {
    const condition = ''
    const serialFormat = `AM-CUS-`
    const codeCount = await generateSerialNumber("getCustomerCode",condition , serialFormat)
    postData.count = codeCount.count
    postData.customerCode = codeCount.code
    const query = generateQuery("INSERT", customer, customerTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        customerId: result.insertId,
      };
      return await getCustomer(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getCustomer(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.customerId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` c.${customerTable.customerId} = ${query.customerId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` c.${customerTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getCustomer", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateCustomer(orgId, customerId, putData) {
  try {
    const query = generateQuery("UPDATE", customer, customerTable, putData, `WHERE ${customerTable.customerId} = ${customerId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "customerId": customerId
      }
      return await getCustomer(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getCustomer,
  createCustomer,
  updateCustomer
};
