"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const shiftServices = require("../services/shift-service");
const messages = require("../models/message");

async function createShift(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await shiftServices.createShift(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getShift(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await shiftServices.getShift(req.query);
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

async function updateShift(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await shiftServices.updateShift(req.headers.orgid, req.params.shiftId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/shift", getShift);
router.post("/shift", createShift);
router.put('/shift/:shiftId', updateShift);

module.exports = router;
