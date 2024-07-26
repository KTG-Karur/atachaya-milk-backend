"use strict";

const { centerTable } = require("../tables/index.js");
const { center } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");
const { generateSerialNumber } = require("../utils/appfunction.js");

async function createCenter(postData) {
  try {
    const condition = ''
    const serialFormat = `AM-CEN-`
    const codeCount = await generateSerialNumber("getCenterCode",condition , serialFormat)
    postData.count = codeCount.count
    postData.centerCode = codeCount.code
    const query = generateQuery("INSERT", center, centerTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        centerId: result.insertId,
      };
      return await getCenter(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getCenter(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.centerId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${centerTable.centerId} = ${query.centerId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${centerTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getCenter", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateCenter(orgId, centerId, putData) {
  try {
    const query = generateQuery("UPDATE", center, centerTable, putData, `WHERE ${centerTable.centerId} = ${centerId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "centerId": centerId
      }
      return await getCenter(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getCenter,
  createCenter,
  updateCenter
};
