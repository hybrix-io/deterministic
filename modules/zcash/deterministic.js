// (C) 2019 Internet of Coins
// hybrixd module - electrum/deterministic_source.js
// Deterministic encryption wrapper for ZCash

const bitcore = require('bitcore-lib-zcash');
const livenet = bitcore.Networks.livenet;

// Replace missing lodash _.sumBy
window.sumBy = function (array, f) {
  let result = 0;
  for (let item of array) {
    result += f(item);
  }
  return result;
};

const wrapper = {

  // create deterministic public and private keys based on a seed
  keys: function (data) {
    const buffer = Buffer.from(data.seed, 'utf8');
    const seedBuffer = bitcore.crypto.Hash.sha256(buffer);
    const bn = bitcore.crypto.BN.fromBuffer(seedBuffer);
    const privKey = new bitcore.PrivateKey(bn);
    const pubKey = privKey.toPublicKey();
    const wif = privKey.toWIF();
    return { privKey: privKey, pubKey: pubKey, WIF: wif };
  },

  // generate a unique wallet address from a given public key
  address: function (data) {
    const privKey = bitcore.PrivateKey.fromWIF(data.WIF);
    const publicKey = privKey.toPublicKey();
    const addressObject = publicKey.toAddress(livenet);
    const address = new bitcore.Address(addressObject).toString();
    return address;
  },

  // return public key
  publickey: data => data.pubKey.toString(),

  // return private key
  privatekey: data => data.privKey.toString(),

  transaction: function (data) {
    const fee = parseFloat(data.fee); // Removed * 100000000;
    const hasValidMessage = data.message !== undefined && data.message !== null && data.message !== '';
    const memos = hasValidMessage ? [{data: data.message}] : null;
    const inputs = data.unspent.unspents.map(transformUnspent(data.source));

    const tx = new bitcore.Transaction()
      .from(inputs)
      .to(data.target, parseInt(data.amount))
      .change(data.source)
      .fee(fee);

    if (memos) {
      tx.addData(memos);
    }

    tx.sign(data.keys.privKey);

    return tx.serialize();
  }
};

/**
 * @param address
 */
function transformUnspent (address) {
  return utxo => {
    return {
      txId: utxo.txid,
      outputIndex: parseInt(utxo.txn),
      address,
      script: utxo.script,
      satoshis: parseInt(utxo.amount)
    };
  };
}

// export the functionality to a pre-prepared var
window.deterministic = wrapper;
