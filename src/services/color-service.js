"use strict";

const { colorTable } = require("../tables/index.js");
const { color } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createColor(postData) {
  try {
    const query = generateQuery("INSERT", color, colorTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        colorId: result.insertId,
      };
      return await getColor(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getColor(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.colorId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${colorTable.colorId} = ${query.colorId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${colorTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getColor", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateColor(orgId, colorId, putData) {
  try {
    const query = generateQuery("UPDATE", color, colorTable, putData, `WHERE ${colorTable.colorId} = ${colorId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "colorId": colorId
      }
      return await getColor(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getColor,
  createColor,
  updateColor
};
