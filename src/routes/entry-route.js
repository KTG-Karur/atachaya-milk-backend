"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const entryServices = require("../services/entry-service");
const messages = require("../models/message");

async function createEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await entryServices.createEntry(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await entryServices.getEntry(req.query);
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

async function updateEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await entryServices.updateEntry(req.headers.orgid, req.params.entryId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/entry", getEntry);
router.post("/entry", createEntry);
router.put('/entry/:entryId', updateEntry);

module.exports = router;
