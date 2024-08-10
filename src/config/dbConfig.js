'use strict';

const { databaseTypes, } = require('../helpers/dataserverhelpers');
require('dotenv').config();

module.exports.databaseConfig = [
  {
    type: databaseTypes.sql,
    database: "atachaya_milk",
    user: "atachaya_admin",
    name: 'atachaya_admin',
    host: "192.46.225.22",
    port: "3306",
    password: 'x3ZS@A|Z}'    
  }, 
];
