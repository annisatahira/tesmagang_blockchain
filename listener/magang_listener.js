const constants = require('./utils/initialize');
const express = require('express');
const request = require('request');
var sha512 = require('sha512');
var mymd5 = require('md5');
const util = require('util')
var Moment = require('moment-timezone');
const Web3 = require('web3');
var contract = require('truffle-contract');
var tokens = require('csrf');
var balance_listener = require('./balance_listener');

console.log("init web3");
const ROPSTEN_WSS = "wss://ropsten.infura.io/ws";

var provider = new Web3.providers.WebsocketProvider(ROPSTEN_WSS); //

var web3 = new Web3(provider);
var SC_TOKEN_INSTANCE;

var token = "";

const fs = require('fs');
const path = require('path');


provider.on('connect', function() {
    console.log('Magang listener Connected');
    web3 = new Web3(provider);
    reloadcontract();
    balance_listener.listen(SC_TOKEN_INSTANCE);
});

provider.on('error', e => console.log('WS Error', e));
provider.on('end', e => {
    console.log('WS closed');
    console.log('Attempting to reconnect...');
    provider = new Web3.providers.WebsocketProvider(ROPSTEN_WSS);

    provider.on('connect', function() {
        console.log('WSS Reconnected');
        web3 = new Web3(provider);
        reloadcontract();
        balance_listener.listen(SC_TOKEN_INSTANCE);
    });

    // web3.setProvider(provider);
});


function reloadcontract() {
    console.log('init contract');
    const SC_TOKEN = fs.readFileSync(path.join(__dirname, './smart-contract', 'tesContract.json'));
    const SC_TOKEN_ABI = JSON.parse(SC_TOKEN).abi;
    SC_TOKEN_INSTANCE = new web3.eth.Contract(SC_TOKEN_ABI, constants.contractaddress);

}


const app = express()