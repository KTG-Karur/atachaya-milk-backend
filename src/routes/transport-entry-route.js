"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const transportEntryServices = require("../services/transport-entry-service");
const messages = require("../models/message");

async function createTransportEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await transportEntryServices.createTransportEntry(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getTransportEntry(req, res) {
    console.log("in-->")
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await transportEntryServices.getTransportEntry(req.query);
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

async function updateTransportEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await transportEntryServices.updateTransportEntry(req.headers.orgid, req.params.transportEntryId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/transport-entry", getTransportEntry);
router.post("/transport-entry", createTransportEntry);
router.put('/transport-entry/:transportEntryId', updateTransportEntry);

module.exports = router;
