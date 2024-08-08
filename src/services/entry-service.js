"use strict";

const { entryTable, entryDetailsTable } = require("../tables/index.js");
const { entry, entryDetails } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");
const { createEntryDetails } = require("./entry-details-service.js");

async function createEntry(postData) {
  try {
    const query = generateQuery("INSERT", entry, entryTable, postData, `;`);
    const result = await scriptsRunner(query);
    postData.entryDetails = await postData.entryDetails.map((obj) => ({ ...obj, entryId: result.insertId }))
    console.log(postData.entryDetails)
    const entryDetails = await createEntryDetails(postData.entryDetails)
    if (result.serverStatus == 2) {
      const request = {
        entryId: result.insertId,
      };
      return await getEntry(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getEntry(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.entryId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` e.${entryTable.entryId} = ${query.entryId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` e.${entryTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getEntry", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateEntry(orgId, entryId, putData) {
  try {
    const query = generateQuery("UPDATE", entry, entryTable, putData, `WHERE ${entryTable.entryId} = ${entryId};`);
    const result = await scriptsRunner(query);
    const entryDetailsQuery = generateQuery("DELETE", entryDetails, null, null, `WHERE ${entryDetailsTable.entryId} = ${entryId};`);
    const deleteScript = await scriptsRunner(entryDetailsQuery);
    putData.entryDetails = await putData.entryDetails.map((obj) => ({ ...obj, entryId: entryId }))
    const entryDetailsCreate = await createEntryDetails(putData.entryDetails)
    if (result.serverStatus == 2) {
      const request = {
        "entryId": entryId
      }
      return await getEntry(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getEntry,
  createEntry,
  updateEntry
};
