const lib = require('bitcore-lib-cash');
const cashaddrjs = require('cashaddrjs');
const bchaddr = require('bchaddrjs');
const Decimal = require('decimal.js-light');

const slpjs = require('slpjs');
const slp = new slpjs.slp();

const bchaddrSLP = require('bchaddrjs-slp');

/**
 * @param address
 * @param data
 */
const transformBchUtxo = data => unspent => ({
  address: data.source,
  outputIndex: unspent.txn,
  satoshis: Number(unspent.amount),
  script: unspent.script,
  txId: unspent.txid
});

const transformSlpUtxo = (data, wif) => unspent => ({
  txid: unspent.txid,
  vout: unspent.vout, // TODO check
  satoshis: Number(unspent.amount),
  wif
});

/**
 * @param seed
 */
function mkPrivateKey (seed) {
  const seedBuffer = Buffer.from(seed, 'utf8');
  const hash = nacl.to_hex(nacl.crypto_hash_sha256(seedBuffer));
  const bn = lib.crypto.BN.fromBuffer(hash);
  return new lib.PrivateKey(bn);
}

/**
 * @param data
 */
function slpTransaction (data) {
  const type = 0x01;
  const source = data.source; // TODO which format transform?
  const target = data.target; // TODO which format transform?
  const wif = data.keys.privateKey.toWIF();
  const amount = Number(data.amount); // TODO satoshis?
  const tokenIdHex = data.contract;

  /*
  utxo example:
  {
    txid: genesisTxid,
    vout: 1,
    satoshis: genesisTxData.satoshis,
    wif
  }
   */
  const utxos = data.unspent.unspents.map(transformSlpUtxo(data, wif));

  // node_modules/slpjs/lib/slp.js:34
  const slpSendOpReturn = slp.buildSendOpReturn({
    tokenIdHex,
    outputQtyArray: [amount]
  }, type);

  const config = {
    slpSendOpReturn,
    input_token_utxos: utxos,
    tokenReceiverAddressArray: [target],
    bchChangeReceiverAddress: source
  };

  // node_modules/slpjs/lib/slp.js:117
  const rawTransactionHex = slp.buildRawSendTx(config, type);
  return rawTransactionHex;
}

/**
 * @param data
 */
function bchTransaction (data) {
  const toAddress = bchaddr.isLegacyAddress(data.target) ? bchaddr.toCashAddress(data.target) : data.target;
  const fromAddress = bchaddr.isLegacyAddress(data.source) ? bchaddr.toCashAddress(data.source) : data.source;

  const hasValidMessage = typeof data.msg !== 'undefined' && data.msg !== null && data !== '';

  const amount = Number(data.amount);

  const fee = new Decimal(data.fee).toNumber();

  const utxos = data.unspent.unspents.map(transformBchUtxo(data));

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

/**
 * @param privateKey
 * @param mode
 */
function mkAddress (privateKey, mode) {
  const address = privateKey.toAddress();
  const type = address.type === lib.Address.PayToPublicKeyHash ? 'P2PKH' : 'P2SH';
  const hash = new Uint8Array(address.hashBuffer);
  if (mode === 'slp') return bchaddrSLP.toSlpAddress(cashaddrjs.encode('bitcoincash', type, hash));
  else return cashaddrjs.encode(mode || 'bitcoincash', type, hash); //  mode = ['bitcoincash', 'bchtest', 'bchreg'];
}

const wrapper = {
  // create deterministic public and private keys based on a seed
  keys: data => ({privateKey: mkPrivateKey(data.seed)}),

  importPrivate: data => ({privateKey: data.privateKey}),

  // generate a unique wallet address from a given public key
  address: data => mkAddress(data.privateKey, data.mode),

  // return public key
  publickey: data => mkAddress(data.privateKey, data.mode),

  // return private key
  privatekey: data => data.privateKey,

  transaction: data => (data.mode === 'slp') ? slpTransaction(data) : bchTransaction(data)
};

window.deterministic = wrapper;
