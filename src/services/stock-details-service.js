"use strict";

const { stockDetailsTable, stockHubTable } = require("../tables/index.js");
const { stockDetails, stockHub } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");
const { createStockTransferHistory } = require("./stock-transfer-history-service.js");

async function createStockDetails(postData) {
    try {
        const checkCenterStock = await getScriptsRunner("getCheckCenterStock", "");
        let result = {}
        let id = ""
        if(checkCenterStock.length > 0){
            const query = generateQuery("UPDATE", stockDetails, stockDetailsTable, putData, `WHERE ${stockDetailsTable.stockDetailsId} = ${checkCenterStock[0].stockDetailsId};`);
            result = await scriptsRunner(query);
            id = checkCenterStock[0].stockDetailsId
        }else{
            const query = generateQuery("INSERT", stockDetails, stockDetailsTable, postData, `;`);
            result = await scriptsRunner(query);
            id = result.insertId
        }
        if (id != "") {
            postData.stockHistory.stockDetailsId = id
            const historyRes = await createStockTransferHistory(postData.stockHistory)
            const stockHubData ={
                totalQty : postData.balanceHubStock
            }
            const kk = generateQuery("UPDATE", stockHub, stockHubTable, stockHubData, `WHERE ${stockHubTable.stockHubId} = ${postData.stockHubId};`);
            const request = {
                stockDetailsId: id,
            };
            return await getStockDetails(request);
        }
        throw new Error(messages.OPERATION_ERROR);
    } catch (error) {
        throw error;
    }
}

async function getStockDetails(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.stockDetailsId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` sd.${stockDetailsTable.stockDetailsId} = ${query.stockDetailsId}`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` sd.${stockDetailsTable.isActive} = ${query.isActive}`;
            }
        }
        let result = await getScriptsRunner("getStockDetails", iql);
        return result;
    } catch (error) {
        throw error;
    }
}

async function updateStockDetails(orgId, stockDetailsId, putData) {
    try {
        const query = generateQuery("UPDATE", stockDetails, stockDetailsTable, putData, `WHERE ${stockDetailsTable.stockDetailsId} = ${stockDetailsId};`);
        const result = await scriptsRunner(query);
        if (result.serverStatus == 2) {
            const request = {
                "stockDetailsId": stockDetailsId
            }
            return await getStockDetails(request)
        }
        throw new Error(messages.OPERATION_ERROR)
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getStockDetails,
    createStockDetails,
    updateStockDetails
};
