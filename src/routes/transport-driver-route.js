"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const transportDriverServices = require("../services/transport-driver-service");
const messages = require("../models/message");

async function createTransportDriver(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await transportDriverServices.createTransportDriver(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getTransportDriver(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await transportDriverServices.getTransportDriver(req.query);
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

async function updateTransportDriver(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await transportDriverServices.updateTransportDriver(req.headers.orgid, req.params.transportDriverId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/transport-driver", getTransportDriver);
router.post("/transport-driver", createTransportDriver);
router.put('/transport-driver/:transportDriverId', updateTransportDriver);

module.exports = router;
