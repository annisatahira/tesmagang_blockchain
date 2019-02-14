const constants = require('./utils/initialize');
const express = require('express');
const request = require('request');
var sha512 = require('sha512');
var mymd5 = require('md5');
const util = require('util')
var Moment = require('moment-timezone');
const Web3 = require('web3');
var contract = require('truffle-contract');
const defaultEventOption = {
    fromBlock: 0,
    toBlock: 'latest'
};

// var url_api = "http://alumnia.id/api/listener";

module.exports = {
    listen: function(SC_TOKEN_INSTANCE) {
        var tanggal = Moment(new Date());

        //Start add balance
        const addBalanceListener = SC_TOKEN_INSTANCE.events.NewTransferBalance(defaultEventOption, function(error, events) {
            //console.log(events);
            console.log('---------Magang transfer balance listener start----------');
            console.log('Excecution date : ' + tanggal.tz('Asia/Jakarta').format('D MMMM YYYY, hh:mm:ss'))
            if (error) {

                return console.error('Magang transfer balance listener failure', error)
            } else {

                const amount = events.returnValues._value / Math.pow(10, 8);
                const txhash = events.transactionHash;
                var status = events.returnValues._status;
                var message = events.returnValues._message;
                const address_from = events.returnValues._from;
                const address_to = events.returnValues._to;

                console.log('Contract address:', events.address);
                console.log('Trx hash:', txhash);
                console.log('Amount:', amount + " Token");
                console.log('User address from :', address_from);
                console.log('User address from :', address_to);
                console.log('Add balance status:', status);
                console.log('Add balance message:', message);

                if (events.returnValues._status == 'success') {
                    status = 'Completed';
                } else {
                    status = 'Mining Failed';
                }


                var random = "MxaKLoJYGh2ES8uzdyZcI65XbtVr0mpPqO3TWe9A1RvQifC7skBgDH4wnlNFjU";

                token = sha512(mymd5(sha512(random + mymd5(tanggal.tz('Asia/Jakarta').format().split('T')[0]) + random).toString('hex')) + sha512(tanggal.tz('Asia/Jakarta').format().split('T')[0]).toString('hex'));

                token = token.toString('hex');

                console.log("token : " + token);
                console.log("param : " + txhash);

                request.post(
                    url_api, {
                        json: {
                            type: "add_balance",
                            pattern: token, //akses ke api, based on waktu
                            status: status,
                            message: message,
                            param: txhash
                        }
                    },
                    function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            // console.log("url : " + urlserver);
                            console.log("API Update Status Add balance To SERVER: " + body.message)
                        } else {
                            console.log("error : "+response.body)
                            
                            console.log("Error api update status Add balance to SERVER ( "+txhash+"):" + response.body.message)
                        }
                    }
                );
                console.log('----------------Magang transfer balance listener end------------------');

            }
        });
        //END Add balance
    }
};