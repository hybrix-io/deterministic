// (C) 2018 Internet of Coins / Metasync / Joachim de Koning
// Deterministic encryption wrapper for Digibyte
//
// [!] Browserify this and save to deterministic.js.lzma to enable sending it from hybrixd to the browser!
//

// inclusion of necessary requires
let wrapperlib = require('./wrapperlib');
// Decimal = require('../../common/crypto/decimal-light'); Decimal.set({ precision: 64 });

// shim for randomBytes to avoid require('crypto') incompatibilities
// solves bug: "There was an error collecting entropy from the browser
const randomBytes = crypto.randomBytes;
if (typeof window === 'object') {
  const wCrypto = window.crypto || {};
  if (!wCrypto.getRandomValues) {
    wCrypto.getRandomValues = function getRandomValues (arr) {
      const bytes = randomBytes(arr.length);
      for (let i = 0; i < bytes.length; i++) {
        arr[i] = bytes[i];
      }
    };
  }
}

function mkPrivateKey (seed, mode) {
  const hash = wrapperlib.crypto.Hash.sha256( Buffer.from(seed) );
  const bn = wrapperlib.crypto.BN.fromBuffer(hash);
  const privKey = new wrapperlib.PrivateKey(bn, mode);
  return privKey.toWIF();
}

function mkPublicKey (WIF, mode) {
  const privKey = wrapperlib.PrivateKey(WIF, mode);
  return new wrapperlib.PublicKey(privKey).toString('hex');
}

function mkAddress (WIF, mode) {
  let privKey = wrapperlib.PrivateKey(WIF, mode);
  let addr = privKey.toAddress();
  if (!wrapperlib.Address.isValid(addr, mode)) {
    throw new Error("Can't generate address from private key. " +
                       'Generated address ' + addr +
                       'is not valid for ' + mode);
  }
  return addr.toString();
}

const wrapper = {
  // create deterministic public and private keys based on a seed
  keys: data => {
    const WIF = mkPrivateKey(data.seed, data.mode);
    return {
      WIF: WIF,
      publicKey: mkPublicKey(WIF, data.mode),
      address: mkAddress(WIF, data.mode)
    };
  },

  // import private key in WIF-format
  importPrivate: data => ({
    WIF: data.privateKey,
    publicKey: mkPublicKey(data.privateKey, data.mode),
    address: mkAddress(data.privateKey, data.mode)
  }),

  // return private key
  privatekey: data => data.WIF,

  // return public key
  publickey: data => data.publicKey,

  // generate a unique wallet address from a given public key
  address: data => data.address,

  // generate a transaction
  transaction: function (data) {
    const privKey = wrapperlib.PrivateKey(data.keys.WIF, data.mode);
    const recipientAddr = wrapperlib.Address(data.target, data.mode);
    const changeAddr = wrapperlib.Address(data.source, data.mode);
    const hasValidMessage = data.message !== undefined && data.message !== null && data.message !== '';

    let tx = new wrapperlib.Transaction()
      .from(data.unspent.unspents.map(function (utxo) {
        return { txId: utxo.txid,
          outputIndex: utxo.txn,
          address: utxo.address,
          script: utxo.script,
          satoshis: parseInt(utxo.amount)
        };
      }))
      .to(recipientAddr, parseInt(data.amount))
      .fee(parseInt(data.fee))
      .change(changeAddr);

    let txWithMaybeMessage = hasValidMessage
      ? tx.addData(data.message)
      : tx;
    let signedTransaction = txWithMaybeMessage
      .sign(privKey).serialize();

    return signedTransaction;
  }
};

// export the functionality to a pre-prepared var
window.deterministic = wrapper;
