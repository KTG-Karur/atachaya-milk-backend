const NodeRSA = require('node-rsa');
const CryptoJS = require("crypto-js");
const secretKey = process.env.SECRET_KEY
const moment = require('moment');
const { getScriptsRunner } = require('../models/query-generator');

async function encrptPassword(passcode) {
    try {
        var ciphertext = CryptoJS.AES.encrypt(passcode, secretKey).toString()
        return ciphertext
    } catch (error) {
        throw error;
    }
}

async function decrptPassword(passcode) {
    try {
        var bytes = CryptoJS.AES.decrypt(passcode, secretKey);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText
    } catch (error) {
        throw error;
    }
}

function encryptObject(obj) {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj), secretKey).toString();
    return ciphertext;
}

// Decryption function
function decryptObject(encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
}

async function prefixZeroConst(number) {
    if (number < 1000) {
        return number.toString().padStart(4, '0');
    }
    return number.toString();
}

async function dateConversion (date, format = "DD-MM-YYYY") {
    const result = date ? moment(date).format(format) : "";
    return result
  }

  async function generateSerialNumber(runScript, condition, serialFormat) {
    try {
        let serialLeastCountData = await getScriptsRunner(runScript , condition);
        let serialObj;
        if (serialLeastCountData.length > 0 && serialLeastCountData[0].count != null ) {
            const value = parseInt(serialLeastCountData[0].count) + parseInt(`0001`)
            const serialCount = await prefixZeroConst(value)
            const serialGenerator = serialFormat + serialCount
            serialObj = {
                count: serialCount,
                code: serialGenerator
            }
        } else {
            const serialGenerator = serialFormat + `0001`
            serialObj = {
                count: "0001",
                code: serialGenerator
            }
        }
        return serialObj;
    } catch (error) {
        throw error;
    }
}



module.exports = {
    encrptPassword,
    generateSerialNumber,
    dateConversion,
    decrptPassword,
    encryptObject,
    decryptObject,
    prefixZeroConst
};