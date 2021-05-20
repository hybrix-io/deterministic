// (C) 2021 Internet of Coins / Joachim de Koning / Rouke Pouw
// bitcoinjs networks generator
//
// insert networks in bitcoinjslib to automatically add most known
// Bitcoin derivative coins
//

const coininfo = require('./coininfo/lib/coininfo');

// Note:
// 'peercoin',  no BIP32 support?
// 'reddcoin',  no BIP32 support?

const networks = {};

for (const networkname in coininfo) {
  let coinInfoData;
  const networkname_ = networkname.replace('_', ' ');
  if (coininfo.hasOwnProperty(networkname_)) coinInfoData = coininfo[networkname_].main;
  else continue;

  const bitcoinJsData = coinInfoData.toBitcoinJS();
  networks[networkname] = {
    messagePrefix: '\x19' + bitcoinJsData.name + ' Signed Message:\n',
    bip32: {
      public: bitcoinJsData.bip32.public,
      private: bitcoinJsData.bip32.private
    },
    pubKeyHash: bitcoinJsData.pubKeyHash,
    scriptHash: bitcoinJsData.scriptHash,
    wif: bitcoinJsData.wif
  };
}

module.exports = networks;
