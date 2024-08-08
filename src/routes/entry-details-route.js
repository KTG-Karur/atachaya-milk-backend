"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const entryDetailsServices = require("../services/entry-details-service");
const messages = require("../models/message");

async function createEntryDetails(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await entryDetailsServices.createEntryDetails(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getEntryDetails(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await entryDetailsServices.getEntryDetails(req.query);
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

async function updateEntryDetails(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await entryDetailsServices.updateEntryDetails(req.headers.orgid, req.params.entryDetailsId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/entry-details", getEntryDetails);
router.post("/entry-details", createEntryDetails);
router.put('/entry-details/:entryDetailsId', updateEntryDetails);

module.exports = router;
