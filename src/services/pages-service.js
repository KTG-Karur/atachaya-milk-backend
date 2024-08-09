"use strict";

const { getScriptsRunner, } = require("../models/query-generator.js");
const { pagesTable } = require("../tables/index.js");

async function getPages(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.parentId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` p.${pagesTable.parentId} > ${0}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` p.${pagesTable.isActive} = ${query.isActive}`;
      }
    }
    console.log(iql)
    let result = await getScriptsRunner("getPages", iql);
    console.log(result)
    result.map((ele)=>{
        ele.access = JSON.parse(ele.access)
    })
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
    getPages,
};
