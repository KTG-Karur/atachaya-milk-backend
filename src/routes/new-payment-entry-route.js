"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const newPaymentEntryServices = require("../services/new-payment-entry-service");
const messages = require("../models/message");

async function createNewPaymentEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await newPaymentEntryServices.createNewPaymentEntry(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getNewPaymentEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await newPaymentEntryServices.getNewPaymentEntry(req.query);
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

async function updateNewPaymentEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await newPaymentEntryServices.updateNewPaymentEntry(req.headers.orgid, req.params.paymentEntryId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/new-payment-entry", getNewPaymentEntry);
router.post("/new-payment-entry", createNewPaymentEntry);
router.put('/new-payment-entry/:paymentEntryId', updateNewPaymentEntry);

module.exports = router;
