"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const stockDetailsServices = require("../services/stock-details-service");
const messages = require("../models/message");

async function createStockDetails(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await stockDetailsServices.createStockDetails(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getStockDetails(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await stockDetailsServices.getStockDetails(req.query);
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

async function updateStockDetails(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await stockDetailsServices.updateStockDetails(req.headers.orgid, req.params.stockDetailsId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/stock-details", getStockDetails);
router.post("/stock-details", createStockDetails);
router.put('/stock-details/:stockDetailsId', updateStockDetails);

module.exports = router;
