"use strict";

const { tankerEntryTable } = require("../tables/index.js");
const { tankerEntry } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createTankerEntry(postData) {
  try {
    const query = generateQuery("INSERT", tankerEntry, tankerEntryTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        tankerEntryId: result.insertId,
      };
      return await getTankerEntry(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getTankerEntry(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.tankerEntryId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` te.${tankerEntryTable.tankerEntryId} = ${query.tankerEntryId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` te.${tankerEntryTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getTankerEntry", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateTankerEntry(orgId, tankerEntryId, putData) {
  try {
    const query = generateQuery("UPDATE", tankerEntry, tankerEntryTable, putData, `WHERE ${tankerEntryTable.tankerEntryId} = ${tankerEntryId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "tankerEntryId": tankerEntryId
      }
      return await getTankerEntry(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getTankerEntry,
  createTankerEntry,
  updateTankerEntry
};
