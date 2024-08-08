"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const tankerSupplierServices = require("../services/tanker-supplier-service");
const messages = require("../models/message");

async function createTankerSupplier(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await tankerSupplierServices.createTankerSupplier(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getTankerSupplier(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await tankerSupplierServices.getTankerSupplier(req.query);
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

async function updateTankerSupplier(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await tankerSupplierServices.updateTankerSupplier(req.headers.orgid, req.params.tankerSupplierId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/tanker-supplier", getTankerSupplier);
router.post("/tanker-supplier", createTankerSupplier);
router.put('/tanker-supplier/:tankerSupplierId', updateTankerSupplier);

module.exports = router;
