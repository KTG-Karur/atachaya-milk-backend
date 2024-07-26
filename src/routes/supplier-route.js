"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const supplierServices = require("../services/supplier-service");
const messages = require("../models/message");

async function createSupplier(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await supplierServices.createSupplier(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getSupplier(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await supplierServices.getSupplier(req.query);
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

async function updateSupplier(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await supplierServices.updateSupplier(req.headers.orgid, req.params.supplierId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/supplier", getSupplier);
router.post("/supplier", createSupplier);
router.put('/supplier/:supplierId', updateSupplier);

module.exports = router;
