const initialize = require('./initialize');
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider(initialize.network));

function getInstance() {
   return web3;
}

function getInfo() {
   const promises = [
       web3.net.listening,
       web3.net.peerCount,
       web3.eth.hashrate,
       web3.eth.gasPrice,
       web3.eth.blockNumber
   ];

   return Promise.all(promises);
}

module.exports = {
   getInstance,
   getInfo
}
