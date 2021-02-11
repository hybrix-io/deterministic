const lib = require('bitcore-lib-cash');
const cashaddrjs = require('cashaddrjs');
const bchaddr = require('bchaddrjs');
const Decimal = require('decimal.js-light');

function mkPrivateKey (seed) {
  const seedBuffer = Buffer.from(seed, 'utf8');
  const hash = nacl.to_hex(nacl.crypto_hash_sha256(seedBuffer));
  const bn = lib.crypto.BN.fromBuffer(hash);
  return new lib.PrivateKey(bn);
}

function mkAddress (privateKey,mode) {
  const address = privateKey.toAddress();
  const type = address.type === lib.Address.PayToPublicKeyHash ? 'P2PKH' : 'P2SH';
  const hash = new Uint8Array(address.hashBuffer);
  return cashaddrjs.encode(mode || 'bitcoincash', type, hash); //  ['bitcoincash', 'bchtest', 'bchreg'];
}

const wrapper = {
  // create deterministic public and private keys based on a seed
  keys: data => {
    const privateKey = mkPrivateKey(data.seed);
    return {
      privateKey
    };
  },

  importPrivate: data => {
    return {privateKey: data.privateKey};
  },

  // generate a unique wallet address from a given public key
  address: data => mkAddress(data.privateKey, data.mode),

  // return public key
  publickey: data => mkAddress(data.privateKey,data.mode),

  // return private key
  privatekey: data => data.privateKey,

  transaction: data => {
    const toAddress = bchaddr.isLegacyAddress(data.target) ? bchaddr.toCashAddress(data.target) : data.target;
    const fromAddress = bchaddr.isLegacyAddress(data.source) ? bchaddr.toCashAddress(data.source) : data.source;

    const hasValidMessage = data.msg !== undefined &&
          data.msg !== null &&
          data !== '';

    const amount = Number(data.amount);

    const fee = new Decimal(data.fee)
          .toNumber();

    const utxos = data.unspent.unspents.map(transformUtxo(data.source));
    const transaction = new lib.Transaction()
          .from(utxos)
          .change(fromAddress)
          .fee(Number(fee))
          .to(toAddress, amount);

    const transactionWithMsgOrDefault = hasValidMessage
          ? transaction.addData(data.msg)
          : transaction;

    const signedTransaction = transactionWithMsgOrDefault
          .sign(data.keys.privateKey)
          .serialize();

    return signedTransaction;
  }
};


function transformUtxo (address) {
  return unspent => {
    return {
      address,
      outputIndex: unspent.txn,
      satoshis: (new Decimal(unspent.amount)
        .toNumber()) / (10 ** 8),
      script: unspent.script,
      txId: unspent.txid
    };
  };
}

window.deterministic = wrapper;
