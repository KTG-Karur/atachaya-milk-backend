"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const centerServices = require("../services/center-service");
const messages = require("../models/message");

async function createCenter(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await centerServices.createCenter(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getCenter(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await centerServices.getCenter(req.query);
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

async function updateCenter(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await centerServices.updateCenter(req.headers.orgid, req.params.centerId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/center", getCenter);
router.post("/center", createCenter);
router.put('/center/:centerId', updateCenter);

module.exports = router;
