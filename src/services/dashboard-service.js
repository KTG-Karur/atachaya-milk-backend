"use strict";

const { customerTable } = require("../tables/index.js");
const { customer } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function getDashboard(query) {
  try {
    let iql = "";
    let resultCount = await getScriptsRunner("getDashboard", iql);
    let resultDetails = await getScriptsRunner("getDashboardDetails", iql);
    const result ={
        dashboradCount : resultCount,
        dashboardDetails: resultDetails
    }
    return result;
  } catch (error) {
    throw error;
  }
}
module.exports = {
  getDashboard,
};
