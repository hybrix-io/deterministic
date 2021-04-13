// (C) 2018 Internet of Coins / Metasync / Joachim de Koning
// Deterministic encryption wrapper for Digibyte
//
// [!] Browserify this and save to deterministic.js.lzma to enable sending it from hybrixd to the browser!
//

// inclusion of necessary requires
const  digibytelib = require('./digibyte-lib');

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
  const hash = digibytelib.crypto.Hash.sha256( Buffer.from(seed) );
  const bn = digibytelib.crypto.BN.fromBuffer(hash);
  const privateKey = new digibytelib.PrivateKey(bn, mode);
  return privateKey.toWIF();
}

function mkPublicKey (WIF, mode) {
  const privateKey = digibytelib.PrivateKey(WIF, mode);
  return new digibytelib.PublicKey(privateKey).toString('hex');
}

function mkAddress (WIF, mode) {
  const privateKey = digibytelib.PrivateKey(WIF, mode);
  const address = privateKey.toAddress();
  if (!digibytelib.Address.isValid(address, mode)) {
    throw new Error("Can't generate address from private key. " +
                       'Generated address ' + address +
                       'is not valid for ' + mode);
  }
  return address.toString();
}

const transformUtxo = utxo => ({ txId: utxo.txid,
    outputIndex: utxo.txn,
    address: utxo.address,
    script: utxo.script,
    satoshis: parseInt(utxo.amount)
  });

const wrapper = {
  // create deterministic public and private keys based on a seed
  keys: data =>
  {
    const WIF = mkPrivateKey(data.seed, data.mode);
    return {
      WIF,
      publicKey: mkPublicKey(WIF, data.mode),
      address: mkAddress(WIF, data.mode)}
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
    const privKey = digibytelib.PrivateKey(data.keys.WIF, data.mode);
    const recipientAddr = digibytelib.Address(data.target, data.mode);
    const changeAddr = digibytelib.Address(data.source, data.mode);
    const hasValidMessage = data.message !== undefined && data.message !== null && data.message !== '';

    const tx = new digibytelib.Transaction()
      .from(data.unspent.unspents.map(transformUtxo))
      .to(recipientAddr, parseInt(data.amount))
      .fee(parseInt(data.fee))
      .change(changeAddr);

    const txWithMaybeMessage = hasValidMessage
      ? tx.addData(data.message)
      : tx;
    const signedTransaction = txWithMaybeMessage
      .sign(privKey).serialize();

    return signedTransaction;
  }
};

// export the functionality to a pre-prepared var
window.deterministic = wrapper;
