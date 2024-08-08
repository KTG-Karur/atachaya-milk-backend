"use strict";

const { roleTable } = require("../tables/index.js");
const { role } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");
const { createRolePermission, updateRolePermission } = require("./role-permission-service.js");
const _ = require("lodash");

async function createRole(postData) {
    try {
        const query = generateQuery("INSERT", role, roleTable, postData, `;`);
        const result = await scriptsRunner(query);
        if (result.serverStatus == 2) {
            postData.roleId = result.insertId
            const filteredData = _.filter(postData.accessIds, item => item.pageId != null);
            postData.accessIds = `{"access": ${JSON.stringify(filteredData)}}`
            const rolePermission = await createRolePermission(postData)
            const request = {
                roleId: result.insertId,
            };
            return await getRole(request);
        }
        throw new Error(messages.OPERATION_ERROR);
    } catch (error) {
        throw error;
    }
}

async function getRole(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.roleId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` ${roleTable.roleId} = ${query.roleId}`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` ${roleTable.isActive} = ${query.isActive}`;
            }
        }
        let result = await getScriptsRunner("getRole", iql);
        return result;
    } catch (error) {
        throw error;
    }
}

async function updateRole(orgId, roleId, putData) {
    try {
        const query = generateQuery("UPDATE", role, roleTable, putData, `WHERE ${roleTable.roleId} = ${roleId};`);
        const result = await scriptsRunner(query);
        if (result.serverStatus == 2 && putData.isActive != false) {
            const filteredData = _.filter(putData.accessIds, item => item.pageId != null);
            putData.accessIds = `{"access": ${JSON.stringify(filteredData)}}`
            const rolePermissionUpdate = await updateRolePermission(null, putData.rolePermissionId, putData)
            const request = {
                "roleId": roleId
            }
            return await getRole(request)
        } else {
            return true;
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getRole,
    createRole,
    updateRole
};
