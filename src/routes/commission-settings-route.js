"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const commissionSettingsServices = require("../services/commission-settings-service");
const messages = require("../models/message");

async function createCommissionSettings(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await commissionSettingsServices.createCommissionSettings(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getCommissionSettings(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await commissionSettingsServices.getCommissionSettings(req.query);
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

async function updateCommissionSettings(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await commissionSettingsServices.updateCommissionSettings(req.headers.orgid, req.params.commissionSettingsId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/commission-settings", getCommissionSettings);
router.post("/commission-settings", createCommissionSettings);
router.put('/commission-settings/:commissionSettingsId', updateCommissionSettings);

module.exports = router;
