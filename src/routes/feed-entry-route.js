"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const feedEntryServices = require("../services/feed-entry-service");
const messages = require("../models/message");

async function createFeedEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await feedEntryServices.createFeedEntry(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getFeedEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await feedEntryServices.getFeedEntry(req.query);
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

async function updateFeedEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await feedEntryServices.updateFeedEntry(req.headers.orgid, req.params.feedEntryId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/feed-entry", getFeedEntry);
router.post("/feed-entry", createFeedEntry);
router.put('/feed-entry/:feedEntryId', updateFeedEntry);

module.exports = router;
