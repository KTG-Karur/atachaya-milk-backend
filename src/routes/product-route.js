"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const productServices = require("../services/product-service");
const messages = require("../models/message");

async function createProduct(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await productServices.createProduct(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getProduct(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await productServices.getProduct(req.query);
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

async function updateProduct(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await productServices.updateProduct(req.headers.orgid, req.params.productId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/product", getProduct);
router.post("/product", createProduct);
router.put('/product/:productId', updateProduct);

module.exports = router;
