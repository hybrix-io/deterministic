const bnbCrypto = require('./node_modules/@binance-chain/javascript-sdk/lib/crypto/index.js');
const bnbTx = require('./node_modules/@binance-chain/javascript-sdk/lib/tx/index.js');
const bip39 = require('bip39');
const Big = require('./node_modules/big.js/big.js');

window.bnbCrypto = bnbCrypto;

function mkPrivateKey (seed) {
  const longSecret = Buffer.from(seed, 'utf8'); // creating long format secret from seed
  const hash = nacl.to_hex(nacl.crypto_hash_sha256(longSecret));
  const secret = Buffer.from(hash.substr(0, 64), 'hex'); // buffer needs to be max 65
  const mnemonicFromBuffer = bip39.entropyToMnemonic(secret);
  const privateKey = bnbCrypto.getPrivateKeyFromMnemonic(mnemonicFromBuffer); // generation privKey from Mnemonic phrase
  return privateKey;
}

function mkPublicKey (privateKey) {
  return bnbCrypto.getPublicKeyFromPrivateKey(privateKey); // generating pubKey from privKey
}

function mkAddress (privateKey) {
  return bnbCrypto.getAddressFromPublicKey( mkPublicKey(privateKey) , 'bnb');
}

const wrapper = {
  // create deterministic public and private keys based on a seed
  keys: data => {
    const privateKey = mkPrivateKey(data.seed);
    return {
      privateKey,
      publicKey: mkPublicKey(privateKey),
      address: mkAddress(privateKey)
    };
  },

  // import private key
  importPrivate: data => ({
    privateKey: data.privateKey,
    publicKey: mkPublicKey(data.privateKey),
    address: mkAddress(privateKey)
  }),

  // return private key
  privatekey: data => data.privateKey,

  // return public key
  publickey: data => data.publicKey,

  // generate a unique wallet address from a given public key
  address: data => data.address,

  // generate a transaction
  transaction: (data, callback) => {
    const decodedFromAddress = bnbCrypto.decodeAddress(data.source);
    const decodedTargetAddress = bnbCrypto.decodeAddress(data.target);
    const chainID = 'Binance-Chain-Tigris';
    const memo = data.message || '';
    const amount = data.amount;

    const coins = [{
      denom: 'BNB',
      amount: amount
    }];

    const msg = {
      inputs: [{
        address: decodedFromAddress,
        coins
      }],
      outputs: [{
        address: decodedTargetAddress,
        coins
      }],
      msgType: 'MsgSend'
    };
    const signMsg = {
      inputs: [{
        address: data.source,
        coins
      }],
      outputs: [{
        address: data.target,
        coins
      }]
    };

    const options = mkOptions(data.unspent.accountNumber, chainID, memo, msg, data.unspent.sequence, 0, msg.msgType);
    const tx = new bnbTx.default(options);

    return tx
      .sign(data.keys.privKey, signMsg)
      .serialize();
  }
};

function mkOptions (accNo, chainID, memo, msg, seq, source, type) {
  return {
    account_number: parseInt(accNo),
    chain_id: chainID,
    memo,
    msg,
    sequence: parseInt(seq),
    source: source,
    type: type
  };
}

window.deterministic = wrapper;
