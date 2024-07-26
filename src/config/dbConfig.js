'use strict';

const { databaseTypes, } = require('../helpers/dataserverhelpers');
require('dotenv').config();

module.exports.databaseConfig = [
  {
    type: databaseTypes.sql,
    database: "atchaya_milk",
    user: "root",
    name: 'milk_management',
    host: "localhost",
    port: "3306",
    password: ''
    // password: "Dd$!Fwby9"
    
  }, 
];
