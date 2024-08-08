"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const customerAdvanceHistoryServices = require("../services/customer-advance-history");
const messages = require("../models/message");

async function createCustomerAdvanceHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await customerAdvanceHistoryServices.createCustomerAdvanceHistory(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getCustomerAdvanceHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await customerAdvanceHistoryServices.getCustomerAdvanceHistory(req.query);
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

async function updateCustomerAdvanceHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await customerAdvanceHistoryServices.updateCustomerAdvanceHistory(req.headers.orgid, req.params.customerAdvanceHistoryId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/customer-advance-history", getCustomerAdvanceHistory);
router.post("/customer-advance-history", createCustomerAdvanceHistory);
router.put('/customer-advance-history/:customerAdvanceHistoryId', updateCustomerAdvanceHistory);

module.exports = router;
