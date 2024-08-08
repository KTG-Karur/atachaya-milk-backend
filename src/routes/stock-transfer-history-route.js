"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const stockTransferHistoryServices = require("../services/stock-transfer-history-service");
const messages = require("../models/message");

async function createStockTransferHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await stockTransferHistoryServices.createStockTransferHistory(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getStockTransferHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await stockTransferHistoryServices.getStockTransferHistory(req.query);
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

async function updateStockTransferHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await stockTransferHistoryServices.updateStockTransferHistory(req.headers.orgid, req.params.stockTransferHistoryId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/stock-transfer-history", getStockTransferHistory);
router.post("/stock-transfer-history", createStockTransferHistory);
router.put('/stock-transfer-history/:stockTransferHistoryId', updateStockTransferHistory);

module.exports = router;
