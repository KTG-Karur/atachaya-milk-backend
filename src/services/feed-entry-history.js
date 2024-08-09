"use strict";

const { feedEntryHistoryTable } = require("../tables/index.js");
const { feedEntryHistory } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createFeedEntryHistory(postData) {
  try {
    const query = generateQuery("INSERT", feedEntryHistory, feedEntryHistoryTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        feedEntryHistoryId: result.insertId,
      };
      return await getFeedEntryHistory(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getFeedEntryHistory(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.feedEntryHistoryId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` feh.${feedEntryHistoryTable.feedEntryHistoryId} = ${query.feedEntryHistoryId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` feh.${feedEntryHistoryTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getFeedEntryHistory", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateFeedEntryHistory(orgId, feedEntryHistoryId, putData) {
  try {
    const query = generateQuery("UPDATE", feedEntryHistory, feedEntryHistoryTable, putData, `WHERE ${feedEntryHistoryTable.feedEntryHistoryId} = ${feedEntryHistoryId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "feedEntryHistoryId": feedEntryHistoryId
      }
      return await getFeedEntryHistory(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getFeedEntryHistory,
  createFeedEntryHistory,
  updateFeedEntryHistory
};
