"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const expensiveServices = require("../services/expensive-service");
const messages = require("../models/message");

async function createExpensive(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await expensiveServices.createExpensive(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getExpensive(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await expensiveServices.getExpensive(req.query);
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

async function updateExpensive(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await expensiveServices.updateExpensive(req.headers.orgid, req.params.expensiveId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/expensive", getExpensive);
router.post("/expensive", createExpensive);
router.put('/expensive/:expensiveId', updateExpensive);

module.exports = router;
