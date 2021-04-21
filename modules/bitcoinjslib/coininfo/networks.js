// (C) 2018 Internet of Coins / Joachim de Koning
// bitcoinjs networks generator
//
// replace networks.js in bitcoinjslib to automatically add most known
// Bitcoin derivative coins
//

var coininfo = require('../coininfo');

var networknames = [
 'bitcoin',
 //'bitcoin_cash',
 'bitcoin_gold',
 'blackcoin',
 //'c0ban',
 'dash',
 'decred',
 //'denarius',
 //'digibyte',
 'dogecoin',
 'florincoin',
 'groestlcoin',
 'litecoin',
 'monacoin',
 'namecoin',
 'nubits',
 //'peercoin',  no BIP32 support?
 //'reddcoin',  no BIP32 support?
 'qtum',
 //'ravencoin',
 //'vertcoin',
 'viacoin',
 //'x42',
 //'zcash',
];

var curr
var frmt
var networks = {};

for(var i=0;i<networknames.length;i++) {
  //DEBUG: console.log(networknames[i]);
  curr = coininfo[networknames[i].replace('_',' ')].main;
  frmt = curr.toBitcoinJS();
  networks[networknames[i]] = {
      messagePrefix: '\x19' + frmt.name + ' Signed Message:\n',
      bip32: {
          public: frmt.bip32.public,
          private: frmt.bip32.private
      },
      pubKeyHash: frmt.pubKeyHash,
      scriptHash: frmt.scriptHash,
      wif: frmt.wif
  }
}

module.exports = networks;
