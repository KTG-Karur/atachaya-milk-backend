"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const loginServices = require("../services/login-service");
const messages = require("../models/message");

async function getLogin(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    // responseEntries.data = await loginServices.getLogin(req.query);
    responseEntries.data = await loginServices.getLogin(req.body);
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


router.get("/login", getLogin);

module.exports = router;
