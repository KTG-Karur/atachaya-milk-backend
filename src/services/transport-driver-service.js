"use strict";

const { transportDriverTable } = require("../tables/index.js");
const { transportDriver } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createTransportDriver(postData) {
  try {
    const query = generateQuery("INSERT", transportDriver, transportDriverTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        transportDriverId: result.insertId,
      };
      return await getTransportDriver(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getTransportDriver(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.transportDriverId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${transportDriverTable.transportDriverId} = ${query.transportDriverId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${transportDriverTable.isActive} = ${query.isActive}`;
      }
    }
    console.log(iql)
    let result = await getScriptsRunner("getTransportDriver", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateTransportDriver(orgId, transportDriverId, putData) {
  try {
    const query = generateQuery("UPDATE", transportDriver, transportDriverTable, putData, `WHERE ${transportDriverTable.transportDriverId} = ${transportDriverId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "transportDriverId": transportDriverId
      }
      return await getTransportDriver(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getTransportDriver,
  createTransportDriver,
  updateTransportDriver
};
