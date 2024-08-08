"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const commissionTypeServices = require("../services/commission-type-service");
const messages = require("../models/message");

async function createCommissionType(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await commissionTypeServices.createCommissionType(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getCommissionType(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await commissionTypeServices.getCommissionType(req.query);
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

async function updateCommissionType(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await commissionTypeServices.updateCommissionType(req.headers.orgid, req.params.commissionTypeId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/commission-type", getCommissionType);
router.post("/commission-type", createCommissionType);
router.put('/commission-type/:commissionTypeId', updateCommissionType);

module.exports = router;
