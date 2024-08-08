"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const stockHubServices = require("../services/stock-hub-service");
const messages = require("../models/message");

async function createStockHub(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await stockHubServices.createStockHub(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getStockHub(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await stockHubServices.getStockHub(req.query);
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

async function updateStockHub(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await stockHubServices.updateStockHub(req.headers.orgid, req.params.stockHubId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/stock-hub", getStockHub);
router.post("/stock-hub", createStockHub);
router.put('/stock-hub/:stockHubId', updateStockHub);

module.exports = router;
