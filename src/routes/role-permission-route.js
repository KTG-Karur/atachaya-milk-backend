"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const rolePermissionServices = require("../services/role-permission-service");
const messages = require("../models/message");

async function createRolePermission(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await rolePermissionServices.createRolePermission(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getRolePermission(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await rolePermissionServices.getRolePermission(req.query);
    if (!responseEntries.data)
      responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function updateRolePermission(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await rolePermissionServices.updateRolePermission(req.headers.orgid, req.params.rolePermissionId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/role-permission", getRolePermission);
router.post("/role-permission", createRolePermission);
router.put('/role-permission/:rolePermissionId', updateRolePermission);

module.exports = router;
