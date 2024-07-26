"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const colorServices = require("../services/color-service");
const messages = require("../models/message");

async function createColor(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await colorServices.createColor(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getColor(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await colorServices.getColor(req.query);
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

async function updateColor(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await colorServices.updateColor(req.headers.orgid, req.params.colorId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/color", getColor);
router.post("/color", createColor);
router.put('/color/:colorId', updateColor);

module.exports = router;
