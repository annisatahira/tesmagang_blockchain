const initialize = require('./initialize');
const web3_setting = require('./web3_setting');
const fs = require('fs');
const path = require('path');

// Start token
const SC_TOKEN = fs.readFileSync(path.join(__dirname, '/../smart-contract', 'tesContract.json'));
const SC_TOKEN_ABI = JSON.parse(SC_TOKEN).abi;
const SC_TOKEN_INSTANCE = web3_setting.getInstance().eth.contract(SC_TOKEN_ABI).at(initialize.contractaddress);

const defaultEventOption = {
   fromBlock: 0,
   toBlock: 'latest'
};

function getSCTokenInstance() {
   return SC_TOKEN_INSTANCE;
}

function getSCTokenAddress() {
   return initialize.contractaddress;
}

// End token

module.exports = {
   defaultEventOption,
   getSCTokenInstance,
   getSCTokenAddress
}
