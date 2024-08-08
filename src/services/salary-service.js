"use strict";

const { salaryTable, entryDetailsTable } = require("../tables/index.js");
const { salary } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createSalary(postData) {
  try {
    const query = generateQuery("INSERT", salary, salaryTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        salaryId: result.insertId,
      };
      return await getSalary(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getSalary(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.salaryId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` s.${salaryTable.salaryId} = ${query.salaryId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` s.${salaryTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getSalary", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function getSalaryEntryDetails(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.month) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` MONTH(${entryDetailsTable.date}) = ${query.month}`;
    }
    if (query.year) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` YEAR(${entryDetailsTable.date}) = ${query.year}`;
    }
    if (query.centerId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${entryDetailsTable.centerId} = ${query.centerId}`;
    }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` s.${salaryTable.isActive} = ${query.isActive}`;
      }
    }
    console.log(iql)
    let result = await getScriptsRunner("getSalaryEntryDetails", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateSalary(orgId, salaryId, putData) {
  try {
    const query = generateQuery("UPDATE", salary, salaryTable, putData, `WHERE ${salaryTable.salaryId} = ${salaryId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "salaryId": salaryId
      }
      return await getSalary(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getSalary,
  createSalary,
  updateSalary,
  getSalaryEntryDetails
};
