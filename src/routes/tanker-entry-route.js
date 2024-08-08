"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const tankerEntryServices = require("../services/tanker-entry-service");
const messages = require("../models/message");

async function createTankerEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await tankerEntryServices.createTankerEntry(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getTankerEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await tankerEntryServices.getTankerEntry(req.query);
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

async function updateTankerEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await tankerEntryServices.updateTankerEntry(req.headers.orgid, req.params.tankerEntryId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/tanker-entry", getTankerEntry);
router.post("/tanker-entry", createTankerEntry);
router.put('/tanker-entry/:tankerEntryId', updateTankerEntry);

module.exports = router;
