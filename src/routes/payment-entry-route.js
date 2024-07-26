"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const paymentEntryServices = require("../services/payment-entry-service");
const messages = require("../models/message");

async function createPaymentEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await paymentEntryServices.createPaymentEntry(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getPaymentEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await paymentEntryServices.getPaymentEntry(req.query);
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

async function updatePaymentEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await paymentEntryServices.updatePaymentEntry(req.headers.orgid, req.params.paymentEntryId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/payment-entry", getPaymentEntry);
router.post("/payment-entry", createPaymentEntry);
router.put('/payment-entry/:paymentEntryId', updatePaymentEntry);

module.exports = router;
