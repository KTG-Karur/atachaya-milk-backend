"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const advanceServices = require("../services/advance-service");
const messages = require("../models/message");

async function createAdvance(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await advanceServices.createAdvance(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getAdvance(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await advanceServices.getAdvance(req.query);
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

async function updateAdvance(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await advanceServices.updateAdvance(req.headers.orgid, req.params.advanceId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/advance", getAdvance);
router.post("/advance", createAdvance);
router.put('/advance/:advanceId', updateAdvance);

module.exports = router;
