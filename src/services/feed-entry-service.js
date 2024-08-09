"use strict";

const { feedEntryTable } = require("../tables/index.js");
const { feedEntry } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");
const { createFeedEntryHistory, updateFeedEntryHistory } = require("./feed-entry-history.js");

async function createFeedEntry(postData) {
  try {
    const iql = ` WHERE ${feedEntryTable.customerId} = ${postData.customerId}`
    const checkFeedEntry = await getScriptsRunner("getCheckFeedEntry", iql);
    if(checkFeedEntry.length > 0){
      postData.amount = parseInt(postData.amount) + parseInt(checkFeedEntry[0].amount)
      const updateRes = await updateFeedEntry(null,checkFeedEntry[0].feedEntryId, postData)
    }else{
      const query = generateQuery("INSERT", feedEntry, feedEntryTable, postData, `;`);
      const result = await scriptsRunner(query);
    }
    return await createFeedEntryHistory(postData.feedEntryHistory)
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

async function updateFeedEntry(orgId, feedEntryHistoryId, putData) {
  try {
    const iql = ` WHERE ${feedEntryTable.customerId} = ${putData.customerId}`
    const checkFeedEntry = await getScriptsRunner("getCheckFeedEntry", iql);
    if(checkFeedEntry.length > 0){
      putData.amount = parseInt(putData.amount) + parseInt(checkFeedEntry[0].amount)
      const query = generateQuery("UPDATE", feedEntry, feedEntryTable, putData, `WHERE ${feedEntryTable.feedEntryId} = ${checkFeedEntry[0].feedEntryId};`);
    }else{
      const query = generateQuery("INSERT", feedEntry, feedEntryTable, putData, `;`);
      const result = await scriptsRunner(query);
    }
    return await updateFeedEntryHistory(null,feedEntryHistoryId ,putData.feedEntryHistory)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getFeedEntry,
  createFeedEntry,
  updateFeedEntry
};
