"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const pagesServices = require("../services/pages-service");
const messages = require("../models/message");

async function getPages(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await pagesServices.getPages(req.query);
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


router.get("/pages", getPages);

module.exports = router;
