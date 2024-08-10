"use strict";

const { userTable } = require("../tables/index.js");
const { user } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");
const { encrptPassword, encryptObject, decrptPassword } = require("../utils/appfunction.js");

async function createUser(postData) {
  try {
    const password = postData.password
    const passcode = await encrptPassword(password)
    postData.password = passcode
    const query = generateQuery("INSERT", user, userTable, postData, `;`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        userId: result.insertId,
      };
      const encryptResult = await getUser(request)
      const encrptObj = await encryptObject(JSON.stringify(encryptResult))
      return encrptObj
    }
    throw new Error(messages.OPERATION_ERROR);
  } catch (error) {
    throw error;
  }
}

async function getUser(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.userId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` u.${userTable.userId} = ${query.userId}`;
      }
      if (query.userName) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` u.${userTable.userName} = '${query.userName}'`;
      }
      if (query.password) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` u.${userTable.password} = '${query.password}'`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` u.${userTable.isActive} = ${query.isActive}`;
      }
    }
    let result = await getScriptsRunner("getUser", iql);
    result[0].password = await decrptPassword(result[0].password)
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateUser(orgId, userId, putData) {
  try {
    const password = putData.password
    const passcode = await encrptPassword(password)
    putData.password = passcode
    const query = generateQuery("UPDATE", user, userTable, putData, `WHERE ${userTable.userId} = ${userId};`);
    const result = await scriptsRunner(query);
    if (result.serverStatus == 2) {
      const request = {
        "userId": userId
      }
      return await getUser(request)
    }
    throw new Error(messages.OPERATION_ERROR)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getUser,
  createUser,
  updateUser
};
