"use strict";

const { entryDetailsTable } = require("../tables/index.js");
const { entryDetails } = require("../tables/table-name.js");
const _ = require("lodash");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createEntryDetails(postData) {
    try {
        const query = generateQuery("INSERT", entryDetails, entryDetailsTable, postData, `;`);
        const result = await scriptsRunner(query);
        if (result.serverStatus == 2) {
            const request = {
                entryDetailsId: result.insertId,
            };
            return await getEntryDetails(request);
        }
        throw new Error(messages.OPERATION_ERROR);
    } catch (error) {
        throw error;
    }
}

async function getEntryDetails(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.entryDetailsId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` ed.${entryDetailsTable.entryDetailsId} = ${query.entryDetailsId}`;
            }
            if (query.customerId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` ed.${entryDetailsTable.customerId} = ${query.customerId}`;
            }
            if (query.month) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += `MONTH(ed.${entryDetailsTable.date}) = ${query.month}`;
            }
            if (query.year) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += `YEAR(ed.${entryDetailsTable.date}) = ${query.year}`;
            }
            if (query.centerId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` ed.${entryDetailsTable.centerId} = ${query.centerId}`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` ed.${entryDetailsTable.isActive} = ${query.isActive}`;
            }
        }
        let result = await getScriptsRunner("getEntryDetails", iql);
        const datafilter = _.map(result, (item) => {
            if (item.shiftId === 2) {
                const updatedItem = {};
                _.forOwn(item, (value, key) => {
                    if (key == 'fat' || key == 'qty' || key == 'snf' || key == 'rate' || key == 'amount' || key == 'entryDetailsId' || key == 'shiftId') {
                        updatedItem[`E${key}`] = value;
                    } else {
                        updatedItem[key] = value;
                    }
                });
                return updatedItem;
            } else {
                return item;
            }
        })
        const combinedData = {};
        let res = []
        let arrData = []
        datafilter.forEach((item) => {
            const date = item.entryDate;
            let filterData = []
            if (!arrData.includes(date)) {
                filterData = _.filter(datafilter, (o) => {
                    return o.entryDate == date
                });
                const mergeData = _.merge({}, ...filterData)
                res.push(mergeData)
            }
            arrData.push(date)
        });

        return res;
    } catch (error) {
        throw error;
    }
}

async function updateEntryDetails(orgId, entryDetailsId, putData) {
    try {
        if (putData.length > 0) {
            console.log(JSON.stringify(putData))
            for (let i = 0; i < putData.length; i++) {
                let query = generateQuery("UPDATE", entryDetails, entryDetailsTable, putData[i], `WHERE ${entryDetailsTable.entryDetailsId} = ${putData[i].entryDetailsId};`);
                console.log(query)
                let result = await scriptsRunner(query);
            }
            return true;
        }
        /* const query = generateQuery("UPDATE", entryDetails, entryDetailsTable, putData, `WHERE ${entryDetailsTable.entryDetailsId} = ${entryDetailsId};`);
        const result = await scriptsRunner(query); */
        /* if (result.serverStatus == 2) {
            const request = {
                "entryDetailsId": entryDetailsId
            }
            return await getEntryDetails(request)
        } */
        throw new Error(messages.OPERATION_ERROR)
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getEntryDetails,
    createEntryDetails,
    updateEntryDetails
};
