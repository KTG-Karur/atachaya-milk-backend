"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const customerSalaryServices = require("../services/customer-salary-service");
const messages = require("../models/message");

async function createCustomerSalary(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await customerSalaryServices.createCustomerSalary(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getCustomerSalary(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await customerSalaryServices.getCustomerSalary(req.query);
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

async function updateCustomerSalary(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await customerSalaryServices.updateCustomerSalary(req.headers.orgid, req.params.customerSalaryId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/customer-salary", getCustomerSalary);
router.post("/customer-salary", createCustomerSalary);
router.put('/customer-salary/:customerSalaryId', updateCustomerSalary);

module.exports = router;
