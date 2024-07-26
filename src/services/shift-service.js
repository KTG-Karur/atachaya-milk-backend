"use strict";

const { shiftTable } = require("../tables/index.js");
const { shift } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createShift(postData) {
  try {
    const query = generateQuery("INSERT", shift, shiftTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        shiftId: result.insertId,
      };
      return await getShift(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getShift(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.shiftId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${shiftTable.shiftId} = ${query.shiftId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${shiftTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getShift", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateShift(orgId, shiftId, putData) {
  try {
    const query = generateQuery("UPDATE", shift, shiftTable, putData, `WHERE ${shiftTable.shiftId} = ${shiftId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "shiftId": shiftId
      }
      return await getShift(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getShift,
  createShift,
  updateShift
};
