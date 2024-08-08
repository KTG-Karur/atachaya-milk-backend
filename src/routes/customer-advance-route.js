"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const customerAdvanceServices = require("../services/customer-advance-service");
const messages = require("../models/message");

async function createCustomerAdvance(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await customerAdvanceServices.createCustomerAdvance(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getCustomerAdvance(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await customerAdvanceServices.getCustomerAdvance(req.query);
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

async function updateCustomerAdvance(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await customerAdvanceServices.updateCustomerAdvance(req.headers.orgid, req.params.customerAdvanceId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/customer-advance", getCustomerAdvance);
router.post("/customer-advance", createCustomerAdvance);
router.put('/customer-advance/:customerAdvanceId', updateCustomerAdvance);

module.exports = router;
