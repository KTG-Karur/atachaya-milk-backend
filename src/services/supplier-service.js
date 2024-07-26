"use strict";

const { supplierTable } = require("../tables/index.js");
const { supplier } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");
const { generateSerialNumber } = require("../utils/appfunction.js");

async function createSupplier(postData) {
  try {
    const condition = ''
    const serialFormat = `AM-SUP-`
    const codeCount = await generateSerialNumber("getSupplierCode",condition , serialFormat)
    postData.count = codeCount.count
    postData.supplierCode = codeCount.code
    console.log(postData)
    const query = generateQuery("INSERT", supplier, supplierTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        supplierId: result.insertId,
      };
      return await getSupplier(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getSupplier(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.supplierId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${supplierTable.supplierId} = ${query.supplierId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${supplierTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getSupplier", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateSupplier(orgId, supplierId, putData) {
  try {
    const query = generateQuery("UPDATE", supplier, supplierTable, putData, `WHERE ${supplierTable.supplierId} = ${supplierId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "supplierId": supplierId
      }
      return await getSupplier(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getSupplier,
  createSupplier,
  updateSupplier
};
