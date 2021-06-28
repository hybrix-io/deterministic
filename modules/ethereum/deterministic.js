// (C) 2017 Internet of Coins / Joachim de Koning
// Deterministic encryption wrapper for Ethereum
const Decimal = require('../../common/crypto/decimal');
Decimal.set({ precision: 64 });

// inclusion of necessary requires
const wrapperlib = {
  ethUtil: require('ethereumjs-util'),
  EthTx: require('ethereumjs-tx'),
  ethABI: require('ethereumjs-abi')
};

/*
 * 21000 gas is charged for any transaction as a "base fee". This covers the cost of an elliptic curve operation to recover the sender address from the signature as well as the disk and bandwidth space of storing the transaction.
 * Lower gas price means a slower transaction, but higher chance the tx doesn't burn thru its gas limit when the Eth network mempool is busy.
 */

// shim for randomBytes to avoid require('crypto') incompatibilities
// solves bug: "There was an error collecting entropy from the browser"
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

/* encode ABI smart contract calls
 * call it by explicitly specifying the variables you want to pass along
 *
 * examples:
 *            encode({ 'func':'balanceOf(address):(uint256)', 'vars':['target'], 'target':data.target });
 *            encode({ 'func':'transfer(address,uint256):(uint256)', 'vars':['target','amount'], 'target':data.target,'amount':toHex(data.amount) });
 */
/**
 * @param data
 */
function encode (data) {
  return '0x' + (new Function('wrapperlib', 'data', 'return wrapperlib.ethABI.simpleEncode(data.func,data.' + data.vars.join(',data.') + ');'))(wrapperlib, data).toString('hex');
}

// Expects string input and parses it to hexadecimal format
/**
 * @param input
 */
function toHex (input) {
  const result = new Decimal(input).toHex().toString('hex');
  return result || '0x0';
}

const deterministic = {

  // create deterministic public and private keys based on a seed
  keys: function (data) {
    const privateKey = wrapperlib.ethUtil.sha256(data.seed);
    return {privateKey: privateKey};
  },

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
  transaction: function (data, dataCallback, errorCallback) {
    const hasValidMessage = typeof data.message !== 'undefined' && data.message !== null && data.message !== '';

    const atomicFee = new Decimal(data.fee);
    if (!data.hasOwnProperty('unspent')) {
      errorCallback('Missing unspent (pre-transactional) data!');
      return;
    }

    /*
     * The calculation done in the recipe:
     * fee = gasPrice * gasUsage
     * => gasPrice = fee / gasUsage
     */

    const gasUsage = new Decimal(data.unspent.gasUsage);

    // here we allow overriding auto-calculated atomic gasprice, so edge-cases like token.tomo.euro.json
    // can be made to work (provides its own TRC21 mechanism of paying fees)
    const atomicGasPrice = data.unspent.hasOwnProperty('atomicGasPrice')
                             ?new Decimal(data.unspent.atomicGasPrice)
                             :atomicFee.div(gasUsage);
    // DEBUG console.log('atomicGasPrice By dividing atomicFee through gasUsage', atomicGasPrice.toString())
    // DEBUG console.log('Gasprice passed throug unspents', data.unspent.gasPrice)

    const txParams = {
      nonce: toHex(data.unspent.nonce),
      gasPrice: toHex(atomicGasPrice.ceil().toFixed(0)),
      gasLimit: toHex(gasUsage.ceil().toFixed(0))
    };

    if (data.mode === 'main') { // Base ETH mode
      txParams.to = data.target; // send it to ...
      txParams.value = toHex(data.amount); // the amount to send
      if (hasValidMessage) { // optionally add a message to the transaction
        // NOTE: without a message block explorers show '0x' in the message field, however, these are not bytes
        //       added to the transaction by this library! Do not be fooled by this.
        txParams.data = data.message;
      }
    } else { // ERC20-compatible token mode
      let ABIobject = false;
      switch (data.mode) {
        case 'trc21': // TRC21 (flow through)
        default: // token / ERC20 / TRC20
          ABIobject = { 'func': 'transfer(address,uint256):(bool)', 'vars': ['target', 'amount'], 'target': data.target, 'amount': toHex(data.amount) };
          break;
      }
      const encoded = encode(ABIobject); // returns the encoded contract data to be sent
      txParams.to = data.contract; // send payload to contract address
      txParams.value = '0x0'; // set to zero, since we're only sending a contract/tokens
      // concatenate a message to the transaction - at the end a byte is added containing the length of the message
      if (hasValidMessage) {
        if (data.message.length <= 256) {
          txParams.data = encoded + String.fromCharCode(255, 255, (data.message.length - 1)) + data.message; // separate message data using CharCode nbsp x2, plus message length byte
        } else {
          errorCallback('Attachment message too long!');
          return;
        }
      } else {
        txParams.data = encoded; // payload as encoded using the smart contract ABI
      }
    }

    // Transaction is created
    const tx = new wrapperlib.EthTx(txParams);

    // Transaction is signed
    tx.sign(data.keys.privateKey);
    const serializedTx = tx.serialize();
    const rawTx = '0x' + serializedTx.toString('hex');
    dataCallback(rawTx);
  },

  encode: function (data) { return encode(data); } // used to compute token balances by ethereum/module.js

};

// export functionality to a pre-prepared var
window.deterministic = deterministic;
