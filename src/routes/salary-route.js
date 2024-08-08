"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const salaryServices = require("../services/salary-service");
const messages = require("../models/message");

async function createSalary(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await salaryServices.createSalary(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getSalary(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await salaryServices.getSalary(req.query);
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

async function getSalaryEntryDetails(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await salaryServices.getSalaryEntryDetails(req.query);
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

async function updateSalary(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await salaryServices.updateSalary(req.headers.orgid, req.params.salaryId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/salary", getSalary);
router.get("/salary-entry-details", getSalaryEntryDetails);
router.post("/salary", createSalary);
router.put('/salary/:salaryId', updateSalary);

module.exports = router;
