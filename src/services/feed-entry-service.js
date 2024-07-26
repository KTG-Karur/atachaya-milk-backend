"use strict";

const { feedEntryTable } = require("../tables/index.js");
const { feedEntry } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createFeedEntry(postData) {
  try {
    const query = generateQuery("INSERT", feedEntry, feedEntryTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        feedEntryId: result.insertId,
      };
      return await getFeedEntry(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getFeedEntry(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.feedEntryId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` fe.${feedEntryTable.feedEntryId} = ${query.feedEntryId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` fe.${feedEntryTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getFeedEntry", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateFeedEntry(orgId, feedEntryId, putData) {
  try {
    const query = generateQuery("UPDATE", feedEntry, feedEntryTable, putData, `WHERE ${feedEntryTable.feedEntryId} = ${feedEntryId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "feedEntryId": feedEntryId
      }
      return await getFeedEntry(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getFeedEntry,
  createFeedEntry,
  updateFeedEntry
};
