"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const purchaseServices = require("../services/purchase-service");
const messages = require("../models/message");

async function createPurchase(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await purchaseServices.createPurchase(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getPurchase(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await purchaseServices.getPurchase(req.query);
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

async function getPurchaseDetails(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await purchaseServices.getPurchaseDetails(req.query);
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

async function updatePurchase(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await purchaseServices.updatePurchase(req.headers.orgid, req.params.purchaseId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/purchase", getPurchase);
router.get("/purchase-details", getPurchaseDetails);
router.post("/purchase", createPurchase);
router.put('/purchase/:purchaseId', updatePurchase);

module.exports = router;
