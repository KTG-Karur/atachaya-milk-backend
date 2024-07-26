'use strict';

const express = require('express');
const middlewareFactory = require('./middlewares');
const factorConfig = require('./config/12-factor-config');

const app = express();

app.use(middlewareFactory(factorConfig));

module.exports = app;