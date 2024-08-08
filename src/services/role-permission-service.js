"use strict";

const { rolePermissionTable } = require("../tables/index.js");
const { rolePermission } = require("../tables/table-name.js");
const { generateQuery, getScriptsRunner, scriptsRunner, } = require("../models/query-generator.js");
const messages = require("../models/message");
const { getPages } = require("./pages-service.js");
const _ = require("lodash");

async function createRolePermission(postData) {
    try {
        const query = generateQuery("INSERT", rolePermission, rolePermissionTable, postData, `;`);
        const result = await scriptsRunner(query);
        if (result.serverStatus == 2) {
            const request = {
                rolePermissionId: result.insertId,
            };
            return true
        }
        throw new Error(messages.OPERATION_ERROR);
    } catch (error) {
        throw error;
    }
}

async function getRolePermission(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.roleId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` rp.${rolePermissionTable.roleId} = ${query.roleId}`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` rp.${rolePermissionTable.isActive} = ${query.isActive}`;
            }
        }
        let result = await getScriptsRunner("getRolePermission", iql);
        let getPageData = await getPages()

        let requestData = []
        const filterData = await result.map((itm,index) => {
            let pagesData = []
            const innerArr = JSON.parse(itm.accessPermissionIds);
            const innerData = innerArr.access
            innerData.map((ele) => {
                getPageData.map((page) => {
                    if (page.pageId === ele.pageId) {
                        requestData = {
                            "pageId": page.pageId,
                            "parentId": page.parentId,
                            "pageName": page.pageName,
                            "title": page.title || "",
                            "icons": page.icons,
                            "path": page.path,
                            "access": ele.accessPermission.join(', ')
                        };
                        pagesData.push(requestData);
                    }
                });
            });
            result[index].pages = JSON.parse(JSON.stringify(pagesData))
            result[index].accessPermissionIds = innerArr
        })
        const accessPermissionIds = result[0]?.accessPermissionIds || ""
        const pages = result[0]?.pages || ""
        const updatedPages = pages.map(page => {
            const accessPermission = _.get(_.find(accessPermissionIds.access, { pageId: page.pageId }), 'accessPermission');
            if (accessPermission) {
                page.access = accessPermission.join(',');
            }
        });
        const subMenuFilter = []
        let filterMenu = {}
        const filterSubMenu = getPageData.map((item, index)=>{
            if(item.pageId === 1){
                filterMenu ={
                    "title": item?.title || "",
                    "pageName": item?.pageName || "",
                    "icon": item?.icons,
                    "path": item?.path,
                }
                subMenuFilter.push(filterMenu)
            }else if(pages.some((otherItem) => otherItem.parentId === item.pageId)){
                const filterData = pages.filter((ele)=>{
                    return ele.parentId === item.pageId
                })
                filterMenu ={
                    "title": item.pageName,
                    "icon": item?.icons,
                    "submenu":filterData
                }
                subMenuFilter.push(filterMenu)
            }
        })
        result[0].pages = subMenuFilter
        return result;
    } catch (error) {
        throw error;
    }
}

async function updateRolePermission(orgId, rolePermissionId, putData) {
    try {
        const query = generateQuery("UPDATE", rolePermission, rolePermissionTable, putData, `WHERE ${rolePermissionTable.rolePermissionId} = ${rolePermissionId};`);
        const result = await scriptsRunner(query);
        if (result.serverStatus == 2) {
            return true
        }
        throw new Error(messages.OPERATION_ERROR)
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getRolePermission,
    createRolePermission,
    updateRolePermission
};
