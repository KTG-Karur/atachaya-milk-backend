"use strict";

const { customerSalaryTable } = require("../tables/index.js");
const { customerSalary } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createCustomerSalary(postData) {
  try {
    const query = generateQuery("INSERT", customerSalary, customerSalaryTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        customerSalaryId: result.insertId,
      };
      return await getCustomerSalary(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getCustomerSalary(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.customerSalaryId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${customerSalaryTable.customerSalaryId} = ${query.customerSalaryId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${customerSalaryTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getCustomerSalary", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateCustomerSalary(orgId, customerSalaryId, putData) {
  try {
    const query = generateQuery("UPDATE", customerSalary, customerSalaryTable, putData, `WHERE ${customerSalaryTable.customerSalaryId} = ${customerSalaryId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "customerSalaryId": customerSalaryId
      }
      return await getCustomerSalary(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getCustomerSalary,
  createCustomerSalary,
  updateCustomerSalary
};
