"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const transportSettingsServices = require("../services/transport-settings-service");
const messages = require("../models/message");

async function createTransportSettings(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await transportSettingsServices.createTransportSettings(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getTransportSettings(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await transportSettingsServices.getTransportSettings(req.query);
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

async function updateTransportSettings(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await transportSettingsServices.updateTransportSettings(req.headers.orgid, req.params.transportSettingsId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/transport-settings", getTransportSettings);
router.post("/transport-settings", createTransportSettings);
router.put('/transport-settings/:transportSettingsId', updateTransportSettings);

module.exports = router;
