"use strict";

const { customerTable } = require("../tables/index.js");
const { customer } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");
const { getEmployee } = require("./employee-service.js");
const { getRolePermission } = require("./role-permission-service.js");
const { getUser } = require("./user-service.js");


async function getLogin(postData) {
  try {
    console.log(postData)
    const userCheckObj = {
      userName: postData.userName,
      isActive: true
    }

    const getUserResult = await getUser(userCheckObj)
    if (getUserResult.length > 0) {
      const roleIdReq = {
        roleId: getUserResult[0].roleId
      }
      const rolePermission = await getRolePermission(roleIdReq)
      const selectedIdPassword = getUserResult[0].password
      const enteredPassword = postData.password
      if (selectedIdPassword == enteredPassword) {
        const userDetails = {
          userId: getUserResult[0].userId,
          userName: getUserResult[0].userName,
          employeeId: getUserResult[0].employeeId,
          employeeName: getUserResult[0].employeeName,
          roleName: getUserResult[0].roleName,
          pages: rolePermission[0].pages
        }
        return userDetails;
      } else {
        throw new Error(messages.INCORRECT_PASSWORD)
      }
    } else {
      throw new Error(messages.INVALID_USER)
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getLogin,
};
