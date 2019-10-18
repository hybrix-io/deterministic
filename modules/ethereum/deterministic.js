// (C) 2017 Internet of Coins / Joachim de Koning
// Deterministic encryption wrapper for Ethereum
const Decimal = require('../../common/crypto/decimal-light');
Decimal.set({ precision: 64 });

// inclusion of necessary requires
const wrapperlib = {
  ethUtil: require('ethereumjs-util'),
  EthTx: require('ethereumjs-tx'),
  ethABI: require('ethereumjs-abi'),
  hex2dec: require('../../common/crypto/hex2dec')
};

/*
 21000 gas is charged for any transaction as a "base fee". This covers the cost of an elliptic curve operation to recover the sender address from the signature as well as the disk and bandwidth space of storing the transactio

Lower gas price means a slower transaction, but higher chance the tx doesn't burn thru its gas limit when the Eth network mempool is busy.

*/
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

// encode ABI smart contract calls
// call it by explicitly specifying the variables you want to pass along
//
// EXAMPLES:
//            encode({ 'func':'balanceOf(address):(uint256)', 'vars':['target'], 'target':data.target });
//            encode({ 'func':'transfer(address,uint256):(uint256)', 'vars':['target','amount'], 'target':data.target,'amount':parseLargeIntToHex(data.amount).toString('hex') });
function encode (data) {
  return '0x' + (new Function('wrapperlib', 'data', 'return wrapperlib.ethABI.simpleEncode(data.func,data.' + data.vars.join(',data.') + ');'))(wrapperlib, data).toString('hex');
}

// Expects string input and parses it to hexadecimal format
function toHex (input) {
  const integer = new Decimal(String(input)).toInteger();
  const result = wrapperlib.hex2dec.toHex(integer);
  return result !== null ? result : '0x0';
}

const deterministic = {

  // create deterministic public and private keys based on a seed
  keys: function (data) {
    const privateKey = wrapperlib.ethUtil.sha256(data.seed);
    return {privateKey: privateKey};
  },
  // TODO importPublic
  // TODO sumKeys

  importPrivate: function (data) {
    return {privateKey: Buffer.from(data.privateKey, 'hex')};
  },

  // generate a unique wallet address from a given public key
  address: function (data) {
    const publicKey = wrapperlib.ethUtil.privateToPublic(data.privateKey);
    return '0x' + wrapperlib.ethUtil.publicToAddress(publicKey).toString('hex');
  },

  // return public key
  publickey: function (data) {
    const publicKey = wrapperlib.ethUtil.privateToPublic(data.privateKey);
    return publicKey.toString('hex');
  },

  // return private key
  privatekey: function (data) {
    return data.privateKey.toString('hex');
  },

  // create and sign a transaction
  transaction: function (data) {
    const hasValidMessage = typeof data.message !== 'undefined' && data.message !== null && data.message !== '';

    let txParams;
    const fee = new Decimal(data.fee);
    const gasBaseFee = new Decimal(data.unspent.gasBaseFee);
    const gasLimit = new Decimal(data.unspent.gasLimit);
    const gasPrice = new Decimal(data.unspent.gasPrice);
    const gasDataFee = new Decimal(data.unspent.gasDataFee);

    if (data.mode !== 'token') { // Base ETH mode
      txParams = {
        nonce: toHex(data.unspent.nonce), // nonce
        gasPrice: toHex(String((fee.minus(gasPrice.times(gasBaseFee.plus(gasDataFee)))).dividedBy(gasBaseFee.plus(gasDataFee)))),
        gasLimit: toHex(String(gasLimit)), // maximum amount of gas units that may be used
        to: data.target, // send it to ...
        value: toHex(data.amount) // the amount to send
      };
      // optionally add a message to the transaction
      if (hasValidMessage) {
        txParams.data = data.message;
      }
    } else { // ERC20-compatible token mode
      const encoded = encode({ 'func': 'transfer(address,uint256):(bool)', 'vars': ['target', 'amount'], 'target': data.target, 'amount': toHex(data.amount) }); // returns the encoded binary (as a Buffer) data to be sent
      // TODO: optionally add a message to the transaction
      if (hasValidMessage) { console.log('TODO: cannot send attachment data with ERC20 tokens yet!'); }
      txParams = {
        nonce: toHex(data.unspent.nonce), // nonce
        gasPrice: toHex(String((fee.minus(gasPrice.times(gasBaseFee.plus(gasDataFee)))).dividedBy(gasBaseFee.plus(gasDataFee)))),
        gasLimit: toHex(String(gasLimit)), // maximum amount of gas units that may be used
        to: data.contract, // send payload to contract address
        value: '0x0', // set to zero, since we're only sending tokens
        data: encoded // payload as encoded using the smart contract
      };
    }

    // Transaction is created
    const tx = new wrapperlib.EthTx(txParams);

    // Transaction is signed
    tx.sign(data.keys.privateKey);
    const serializedTx = tx.serialize();
    const rawTx = '0x' + serializedTx.toString('hex');
    return rawTx;
  },
  encode: function (data) { return encode(data); } // used to compute token balances by ethereum/module.js
};

// export functionality to a pre-prepared var
window.deterministic = deterministic;
