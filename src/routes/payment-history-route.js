"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const paymentHistoryServices = require("../services/payment-history-service");
const messages = require("../models/message");

async function createPaymentHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await paymentHistoryServices.createPaymentHistory(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getPaymentHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await paymentHistoryServices.getPaymentHistory(req.query);
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

async function updatePaymentHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await paymentHistoryServices.updatePaymentHistory(req.headers.orgid, req.params.paymentHistoryId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/payment-history", getPaymentHistory);
router.post("/payment-history", createPaymentHistory);
router.put('/payment-history/:paymentHistoryId', updatePaymentHistory);

module.exports = router;
