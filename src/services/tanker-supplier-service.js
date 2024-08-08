"use strict";

const { tankerSupplierTable } = require("../tables/index.js");
const { tankerSupplier } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createTankerSupplier(postData) {
  try {
    const query = generateQuery("INSERT", tankerSupplier, tankerSupplierTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        tankerSupplierId: result.insertId,
      };
      return await getTankerSupplier(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getTankerSupplier(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.tankerSupplierId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${tankerSupplierTable.tankerSupplierId} = ${query.tankerSupplierId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${tankerSupplierTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getTankerSupplier", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateTankerSupplier(orgId, tankerSupplierId, putData) {
  try {
    const query = generateQuery("UPDATE", tankerSupplier, tankerSupplierTable, putData, `WHERE ${tankerSupplierTable.tankerSupplierId} = ${tankerSupplierId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "tankerSupplierId": tankerSupplierId
      }
      return await getTankerSupplier(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getTankerSupplier,
  createTankerSupplier,
  updateTankerSupplier
};
