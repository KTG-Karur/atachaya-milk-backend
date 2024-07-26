"use strict";

const { customerTable } = require("../tables/index.js");
const { customer } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");
const { getEmployee } = require("./employee-service.js");


async function getLogin(postData) {
  try {
   /*  const userCheckObj = {
      userName: postData.userName,
      password : postData.password,
      isActive: true
    }

    const getUserResult = await getEmployee(userCheckObj)
    if (getUserResult.length > 0) {
      const userDetails = {
        userId: getUserResult[0].employeeId,
        employeeName: getUserResult[0].employeeName,
        centerId: getUserResult[0].centerId
      }
      return userDetails;
    } else {
      throw new Error(messages.INVALID_USER)
    } */
      const userDetails = {
        userId: "1",
        employeeName: "Madan",
        centerId: 1
      }
      return userDetails;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getLogin,
};
