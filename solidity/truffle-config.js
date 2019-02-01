const HDWalletProvider = require("truffle-hdwallet-provider");

const infuraAPIKey = "d7af975f3ce74a8793c87413637f7923";
const mnemonic = "assist note monkey choose double reform plug rhythm village round critic cargo";

module.exports = {
 networks: {
   ropsten: {
     provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3" + infuraAPIKey),
     network_id: 3,
     gas: 8000000
   },
   rinkeby: {
     provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/" + infuraAPIKey),
     network_id: 2,
     gas: 4700002
   },
   ropsten2: {
     provider: new HDWalletProvider(mnemonic, "http://149.28.134.219:8545"),
     network_id: 3,
     gas: 4712388
   },
   development: {
     host: "localhost",
     port: 8545,
     network_id: "*",
     // from: '0x2f766bce1c7c378dfe9d33951adf09bcc51a13f1',
     gas: 4712388
   }
 }
};
