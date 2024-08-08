"use strict";

const { transportEntryTable } = require("../tables/index.js");
const { transportEntry } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createTransportEntry(postData) {
  try {
    const query = generateQuery("INSERT", transportEntry, transportEntryTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        transportEntryId: result.insertId,
      };
      return await getTransportEntry(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getTransportEntry(query) {
    console.log("in-->")
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.transportEntryId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${transportEntryTable.transportEntryId} = ${query.transportEntryId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${transportEntryTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getTransportEntry", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateTransportEntry(orgId, transportEntryId, putData) {
  try {
    const query = generateQuery("UPDATE", transportEntry, transportEntryTable, putData, `WHERE ${transportEntryTable.transportEntryId} = ${transportEntryId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "transportEntryId": transportEntryId
      }
      return await getTransportEntry(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getTransportEntry,
  createTransportEntry,
  updateTransportEntry
};
