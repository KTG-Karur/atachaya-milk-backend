"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const roleServices = require("../services/role-service");
const messages = require("../models/message");

async function createRole(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await roleServices.createRole(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getRole(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await roleServices.getRole(req.query);
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

async function updateRole(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await roleServices.updateRole(req.headers.orgid, req.params.roleId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/role", getRole);
router.post("/role", createRole);
router.put('/role/:roleId', updateRole);

module.exports = router;
