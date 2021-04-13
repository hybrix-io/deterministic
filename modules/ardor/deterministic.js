// (C) 2015 Internet of Coins / Metasync / Joachim de Koning
// hybrixd module - ark/deterministic.js
// Deterministic encryption wrapper for Ark
//
// [!] Browserify this and save to deterministic.js.lzma to enable sending it from hybrixd to the browser!
//

const ardor = require('./ardorjs');

window.ardor = ardor;

function mkPublicKey(seed) {
  return ardor.secretPhraseToPublicKey(seed);
}

function mkAddress(seed) {
  return ardor.publicKeyToAccountId(mkPublicKey(seed));
}

const wrapper = {
  // create deterministic public and private keys based on a seed
  keys: data => ({
    secretPhrase: data.seed,            // simply pass the unique seed as secret phrase to the NXT library
    publicKey: mkPublicKey(data.seed),
    address: mkAddress(data.seed)
  }),

  // import private key in secretPhrase-format
  importPrivate: data => ({
    secretPhrase: data.privateKey,
    publicKey: mkPublicKey(data.privateKey),
    address: mkAddress(data.privateKey)
  }),

  // return private key
  privatekey: data => data.secretPhrase,

  // generate a unique wallet address from a given public key
  address: data => data.address,

  // return public key
  publickey: data => data.publicKey,

  // return deterministic transaction data
  transaction: (data,dataCallback,errorCallback) => {
    if (typeof data.unspent.unsignedTransactionBytes !== 'undefined') {
      return ardor.signTransactionBytes(data.unspent.unsignedTransactionBytes, data.keys.secretPhrase);
    } else errorCallback('Failed to sign transaction. Missing unsignedTransactionBytes in unspent.');
  }
};

// export the functionality to a pre-prepared var
window.deterministic = wrapper;
