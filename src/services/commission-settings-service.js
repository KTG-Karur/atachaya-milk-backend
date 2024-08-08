"use strict";

const { commissionSettingsTable } = require("../tables/index.js");
const { commissionSettings } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createCommissionSettings(postData) {
  try {
    const query = generateQuery("INSERT", commissionSettings, commissionSettingsTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        commissionSettingsId: result.insertId,
      };
      return await getCommissionSettings(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getCommissionSettings(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.commissionSettingsId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` cs.${commissionSettingsTable.commissionSettingsId} = ${query.commissionSettingsId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` cs.${commissionSettingsTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getCommissionSettings", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateCommissionSettings(orgId, commissionSettingsId, putData) {
  try {
    const query = generateQuery("UPDATE", commissionSettings, commissionSettingsTable, putData, `WHERE ${commissionSettingsTable.commissionSettingsId} = ${commissionSettingsId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "commissionSettingsId": commissionSettingsId
      }
      return await getCommissionSettings(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getCommissionSettings,
  createCommissionSettings,
  updateCommissionSettings
};
