"use strict";

const router = require("express").Router();
const { ResponseEntry } = require("../helpers/construct-response");
const feedEntryHistoryServices = require("../services/feed-entry-history");
const messages = require("../models/message");

async function createFeedEntryHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await feedEntryHistoryServices.createFeedEntryHistory(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

async function getFeedEntryHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await feedEntryHistoryServices.getFeedEntryHistory(req.query);
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

async function updateFeedEntryHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await feedEntryHistoryServices.updateFeedEntryHistory(req.headers.orgid, req.params.feedEntryHistoryId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = (error.message) ? error.message : error;
    responseEntries.code = 503;
  } finally {
    res.status(responseEntries.code).json(responseEntries);
  }
}

router.get("/feed-entry-history", getFeedEntryHistory);
router.post("/feed-entry-history", createFeedEntryHistory);
router.put('/feed-entry-history/:feedEntryHistoryId', updateFeedEntryHistory);

module.exports = router;
