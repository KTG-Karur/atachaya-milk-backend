"use strict";

const { commissionTypeTable } = require("../tables/index.js");
const { commissionType } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createCommissionType(postData) {
  try {
    const query = generateQuery("INSERT", commissionType, commissionTypeTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        commissionTypeId: result.insertId,
      };
      return await getCommissionType(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getCommissionType(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.commissionTypeId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${commissionTypeTable.commissionTypeId} = ${query.commissionTypeId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${commissionTypeTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getCommissionType", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateCommissionType(orgId, commissionTypeId, putData) {
  try {
    const query = generateQuery("UPDATE", commissionType, commissionTypeTable, putData, `WHERE ${commissionTypeTable.commissionTypeId} = ${commissionTypeId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "commissionTypeId": commissionTypeId
      }
      return await getCommissionType(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getCommissionType,
  createCommissionType,
  updateCommissionType
};
