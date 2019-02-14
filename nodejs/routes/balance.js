var express = require('express');
var router = express.Router();

const initialize = require('../utils/initialize');
const blockchain = require('../utils/blockchain');
const web3_connection = require('../utils/web3_setting');
const util = require('util');
const route = 'balance';
const routeIdentifier = util.format('/%s', route);
const bodyParser = require('body-parser');
const Tx = require('ethereumjs-tx');

var fs = require('fs');

//function to call smartcontract
router.post(routeIdentifier + "/get_balance", function (request, response) {

   const publicKey = request.body.publicKey;

   if (!publicKey) {
       console.error('get Balance failure', 'Bad Param');
       const hasil = {
           status: "get Balance failure, Bad Param"
       };
       response.json(hasil);
       return;
   }
   console.error('init');
   blockchain.getSCTokenInstance().balanceOf(publicKey, {
       from: initialize.projectPublicKey
   }, function (error, result) {
       if (error) {
           console.error('Get balance failure', error);
           const data = {

               status: 'Get balance failure' + error
           };

           response.json(data).end();
           return;
       }

       // const ether = ethereum.getInstance().fromWei(result, 'ether');
       const data = {
           message: 'balance of Token',
           address: publicKey,
           // IDR: ether.toString(10)
           balance: (result/Math.pow(10, 8)) + " Token"
       };
       console.log('Get balance success', data);
       response.json(data).end();
   });

});

//function to add token balance to user address
router.post(routeIdentifier + "/add_balance", function(request, response) {
  
  
   const public_key = request.body.public_key;
   const amount_alu = request.body.amount;

   let txCount = web3_connection.getInstance().eth.getTransactionCount(initialize.ownerPublicKey);
   let noncefix = txCount;

   if (public_key==null || amount_alu==null) {
       console.error('Add Balance failure', 'Bad Param');
       const result_data = {
           note: "Add Balance failure, bad param",
           status: 0,
           message:'Blockchain error'
       };
       response.json(result_data);
       return;
   }
  
   console.log("Address destination :"+public_key);
   console.log("Amount :"+amount_alu+"  Token");
  
   const privateKey = new Buffer(initialize.ownerPrivateKey, 'hex')
   const data = blockchain.getSCTokenInstance().transfer.getData(public_key, (amount_alu*Math.pow(10, 8)));
  
   //check nonce
   console.log("txCount " + txCount);
  
   var noncecounter = parseInt(fs.readFileSync('./nonce.txt').toString());
  
   if (noncecounter == 0||txCount > noncecounter) {
       fs.writeFileSync('./nonce.txt', txCount);
       noncefix = txCount;
   } else{
       fs.writeFileSync('./nonce.txt', noncecounter + 1);
       noncefix = noncecounter + 1;
   }
  
   console.log("noncefix " + noncefix);
  
   const rawTx = {
       to: blockchain.getSCTokenAddress(),
       data: data,
       nonce: web3_connection.getInstance().toHex(noncefix),
       gasPrice: web3_connection.getInstance().toHex(1000000000),
       gasLimit: web3_connection.getInstance().toHex(120000),
       value: web3_connection.getInstance().toHex(0)
   }

   const tx = new Tx(rawTx);
   tx.sign(privateKey);

   const serializedTx = tx.serialize();

   web3_connection.getInstance().eth.sendRawTransaction('0x' + serializedTx.toString('hex'),
       function(error, result) {
           if (error) {

               console.log('-----------FAILED-----------');
               console.log('Address :' + public_key)
               console.error('Add Balance failure, ', error);
               const result_data = {
                   address: public_key,
                   note: "Add Balance failure, " + error,
                   status: 0,
                   message:'Blockchain error'

               };
               response.json(result_data);
               return;
           }

           const result_data = {
               trxhash: result,
               address: public_key,
               note: "Add Balance success, send to blockchain",
               status: 1,
               message:'Mining process'

           };
           console.log('trx hash : ', result);
           console.log('status : ', result_data['note']);
           console.log('-----------Add balance ended-----------');
          
           response.json(result_data);
       });
});

//function to transfer token balance to user address
router.post(routeIdentifier + "/transfer_balance", function(request, response) {
  
   const tf = request.body.tf;
   const publickey = request.body.publickey;
   const amount_at = request.body.amount_at;

   let txCount = web3_connection.getInstance().eth.getTransactionCount(initialize.ownerPublicKey);
   let noncefix = txCount;

   if (publickey==null || amount_at==null) {
       console.error('Add Balance failure', 'Bad Param');
       const result_data = {
           note: "Add Balance failure, bad param",
           status: 0,
           message:'Blockchain error'
       };
       response.json(result_data);
       return;
   }
  
   console.log("Address from :"+tf);
   console.log("Address destination :"+publickey);
   console.log("Amount :"+amount_at+"  Token");
  
   const privateKey = new Buffer(initialize.ownerPrivateKey, 'hex')
   const data = blockchain.getSCTokenInstance().newTransferBalance.getData(tf, publickey, (amount_at*Math.pow(10, 8)));
  
   //check nonce
   console.log("txCount " + txCount);
  
   var noncecounter = parseInt(fs.readFileSync('./nonce.txt').toString());
  
   if (noncecounter == 0||txCount > noncecounter) {
       fs.writeFileSync('./nonce.txt', txCount);
       noncefix = txCount;
   } else{
       fs.writeFileSync('./nonce.txt', noncecounter + 1);
       noncefix = noncecounter + 1;
   }
  
   console.log("noncefix " + noncefix);
  
   const rawTx = {
       to: blockchain.getSCTokenAddress(),
       data: data,
       nonce: web3_connection.getInstance().toHex(noncefix),
       gasPrice: web3_connection.getInstance().toHex(1000000000),
       gasLimit: web3_connection.getInstance().toHex(120000),
       value: web3_connection.getInstance().toHex(0)
   }

   const tx = new Tx(rawTx);
   tx.sign(privateKey);

   const serializedTx = tx.serialize();

   web3_connection.getInstance().eth.sendRawTransaction('0x' + serializedTx.toString('hex'),
       function(error, result) {
           if (error) {

               console.log('-----------FAILED-----------');
               console.log('Address From :' + tf)
               console.log('Address Destination:' + publickey)
               console.error('Add Balance failure, ', error);
               const result_data = {
                   note: "Add Balance failure, " + error,
                   status: 0,
                   message:'Blockchain error'

               };
               response.json(result_data);
               return;
           }

           const result_data = {
               trxhash: result,
               note: "Add Balance success, send to blockchain",
               status: 1,
               message:'Mining process'

           };
           console.log('trx hash : ', result);
           console.log('status : ', result_data['note']);
           console.log('-----------Add balance ended-----------');
          
           response.json(result_data);
       });
});
module.exports = router;