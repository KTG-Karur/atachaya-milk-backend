"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const userServices = require("../services/user-service");
const messages = require("../models/message");

async function createUser(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await userServices.createUser(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getUser(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await userServices.getUser(req.query);
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

async function updateUser(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await userServices.updateUser(req.headers.orgid, req.params.userId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/user", getUser);
router.post("/user", createUser);
router.put('/user/:userId', updateUser);

module.exports = router;
