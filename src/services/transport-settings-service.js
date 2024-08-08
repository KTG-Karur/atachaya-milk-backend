"use strict";

const { transportSettingsTable } = require("../tables/index.js");
const { transportSettings } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");

async function createTransportSettings(postData) {
    try {
        const checkCreate = await getScriptsRunner("getTransportSettings", "")
        if (checkCreate.length > 0) {
           return await updateTransportSettings(null,checkCreate[0].transportSettingsId,postData)
        } else {
            const query = generateQuery("INSERT", transportSettings, transportSettingsTable, postData, `;`);
            const result = await scriptsRunner(query);
            if (result.serverStatus == 2) {
                const request = {
                    transportSettingsId: result.insertId,
                };
                return await getTransportSettings(request);
            }
            throw new Error(messages.OPERATION_ERROR);
        }

    } catch (error) {
        throw error;
    }
}

async function getTransportSettings(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.transportSettingsId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` ${transportSettingsTable.transportSettingsId} = ${query.transportSettingsId}`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` ${transportSettingsTable.isActive} = ${query.isActive}`;
            }
        }
        let result = await getScriptsRunner("getTransportSettings", iql);
        return result;
    } catch (error) {
        throw error;
    }
}

async function updateTransportSettings(orgId, transportSettingsId, putData) {
    try {
        const query = generateQuery("UPDATE", transportSettings, transportSettingsTable, putData, `WHERE ${transportSettingsTable.transportSettingsId} = ${transportSettingsId};`);
        const result = await scriptsRunner(query);
        if (result.serverStatus == 2) {
            const request = {
                "transportSettingsId": transportSettingsId
            }
            return await getTransportSettings(request)
        }
        throw new Error(messages.OPERATION_ERROR)
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getTransportSettings,
    createTransportSettings,
    updateTransportSettings
};
