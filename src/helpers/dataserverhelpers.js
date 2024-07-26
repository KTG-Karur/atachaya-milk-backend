'use strict';

const databaseTypes = {
    sql:'sql',
}; 

const executionTypes = { 
    rest:{ post:'post', get:'get' ,getHeader:'getHeader',option:'option' },
    sql:{ 
        singleWithReplace:'singleWithReplace', 
        customQuery:'customQuery', }, 
};


module.exports = { databaseTypes, executionTypes };