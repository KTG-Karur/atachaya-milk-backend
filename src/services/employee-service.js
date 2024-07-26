"use strict";

const { employeeTable } = require("../tables/index.js");
const { employee } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");
const { generateSerialNumber } = require("../utils/appfunction.js");

async function createEmployee(postData) {
  try {
    const condition = ''
    const serialFormat = `AM-EMP-`
    const codeCount = await generateSerialNumber("getEmployeeCode",condition , serialFormat)
    postData.count = codeCount.count
    postData.employeeCode = codeCount.code
    const query = generateQuery("INSERT", employee, employeeTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        employeeId: result.insertId,
      };
      return await getEmployee(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getEmployee(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.employeeId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` emp.${employeeTable.employeeId} = ${query.employeeId}`;
      }
      if (query.userName) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` emp.${employeeTable.userName} = '${query.userName}'`;
      }
      if (query.password) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` emp.${employeeTable.password} = '${query.password}'`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` emp.${employeeTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getEmployee", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateEmployee(orgId, employeeId, putData) {
  try {
    const query = generateQuery("UPDATE", employee, employeeTable, putData, `WHERE ${employeeTable.employeeId} = ${employeeId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "employeeId": employeeId
      }
      return await getEmployee(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getEmployee,
  createEmployee,
  updateEmployee
};
