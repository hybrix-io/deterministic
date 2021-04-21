// (C) 2018 Internet of Coins / Joachim de Koning
// bitcoinjs networks generator
//
// replace networks.js in bitcoinjslib to automatically add most known
// Bitcoin derivative coins
//

const coininfo = require('coininfo');
const coininfo_old = require('./coininfo_old/lib/coininfo');

/**
 * @param array
 */
function unique (array) {
  const set = new Set(array);
  return [...set];
}

const networknames = unique([...Object.keys(coininfo), ...Object.keys(coininfo_old)]);

// 'peercoin',  no BIP32 support?
// 'reddcoin',  no BIP32 support?

let curr;
let frmt;
const networks = {};

for (const networkname of networknames) {
  const networkname_ = networkname.replace('_', ' ');
  if (coininfo.hasOwnProperty(networkname_)) curr = coininfo[networkname_].main;
  else if (coininfo_old.hasOwnProperty(networkname_)) curr = coininfo_old[networkname_].main;
  else continue;

  frmt = curr.toBitcoinJS();
  networks[networkname] = {
    messagePrefix: '\x19' + frmt.name + ' Signed Message:\n',
    bip32: {
      public: frmt.bip32.public,
      private: frmt.bip32.private
    },
    pubKeyHash: frmt.pubKeyHash,
    scriptHash: frmt.scriptHash,
    wif: frmt.wif
  };
}

module.exports = networks;
