"use strict";

const { productTable } = require("../tables/index.js");
const { product } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createProduct(postData) {
  try {
    const query = generateQuery("INSERT", product, productTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        productId: result.insertId,
      };
      return await getProduct(request);
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getProduct(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.productId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${productTable.productId} = ${query.productId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ${productTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getProduct", iql);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateProduct(orgId, productId, putData) {
  try {
    const query = generateQuery("UPDATE", product, productTable, putData, `WHERE ${productTable.productId} = ${productId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "productId": productId
      }
      return await getProduct(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getProduct,
  createProduct,
  updateProduct
};
