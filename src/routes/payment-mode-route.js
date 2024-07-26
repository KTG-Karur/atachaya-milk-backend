"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const paymentModeServices = require("../services/payment-mode-service");
const messages = require("../models/message");

async function createPaymentMode(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await paymentModeServices.createPaymentMode(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getPaymentMode(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await paymentModeServices.getPaymentMode(req.query);
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

async function updatePaymentMode(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await paymentModeServices.updatePaymentMode(req.headers.orgid, req.params.paymentModeId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/payment-mode", getPaymentMode);
router.post("/payment-mode", createPaymentMode);
router.put('/payment-mode/:paymentModeId', updatePaymentMode);

module.exports = router;
