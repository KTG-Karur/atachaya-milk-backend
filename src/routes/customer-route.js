"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const customerServices = require("../services/customer-service");
const messages = require("../models/message");

async function createCustomer(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await customerServices.createCustomer(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getCustomer(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await customerServices.getCustomer(req.query);
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

async function updateCustomer(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await customerServices.updateCustomer(req.headers.orgid, req.params.customerId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/customer", getCustomer);
router.post("/customer", createCustomer);
router.put('/customer/:customerId', updateCustomer);

module.exports = router;
