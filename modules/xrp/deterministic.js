// (C) 2019 Internet of Coins / Jacob Petrovic

const RippleAPI = require('ripple-lib').RippleAPI;
const rippleKeyPairs = require('ripple-keypairs');
const apiFactory = require('x-address-codec');
const createHash = require('create-hash');
const api = new RippleAPI();

function atomicToRegular (fee, factorString) {
  const factor = Number(factorString);
  if (fee.length < factor) { fee = '0'.repeat(factor - fee.length) + fee; }
  return fee.substr(0, fee.length - factor) + '.' + fee.substr(fee.length - factor);
}

// instantiate Ripple in offline mode for securing keysfrom the ripplenetwork
const wrapper = {
  // create deterministic public and private keys based on a seed
  keys: data => {
    let api2 = apiFactory({
      defaultAlphabet: 'ripple',
      sha256: bytes => createHash('sha256').update(Buffer.from(bytes)).digest(),
      codecMethods: {
        AccountID: {version: 0x00},
        Seed: {version: 0x21}
      }
    });
    const seed = Buffer.from(data.seed, 'utf8');
    const hash = nacl.to_hex(nacl.crypto_hash_sha256(seed));
    const secret = Buffer.from(hash.substr(0, 32), 'hex');

    // It can encode a Buffer
    const encoded = api2.encodeSeed(secret);
    const keyPair =rippleKeyPairs.deriveKeypair(encoded)
    keyPair.secret =  encoded
    return keyPair;
  },

  importPublic: function (data) {
    return {publicKey: data.publicKey};
  },

  // TODO importPrivate

  // TODO sumKeys

  // generate a unique wallet address from a given public key
  address: data => {
    const address = rippleKeyPairs.deriveAddress(data.publicKey);
    return address;
  },

  // return public key
  publickey: data => data.publicKey,

  // return private key
  privatekey: data => data.secret,

  // generate a transaction
  transaction: (data, callback) => {
    const address = data.source;
    const currency = data.symbol === 'xrp' ? 'drops' : data.symbol.replace(/XRP./gi, '').toUpperCase();
    const hasValidMessage = data.message !== undefined && data.message !== null && data.message !== '';
    const memos = hasValidMessage ? [{data: data.message}] : [];
    const fee = atomicToRegular(data.fee, data.factor);

    let tag, target;
    if(data.target.startsWith('r') && data.target.includes('-')){ // use destination tag
      [target,tag] = data.target.split('-');
      tag = Number(tag);
    } else target = data.target;

    const payment = {
      source: {
        address,
        maxAmount: {
          value: data.amount,
          currency
        }
      },
      destination: {
        address: target,
        tag,
        amount: {
          value: data.amount,
          currency
        }
      },
      memos
    };

    const instructions = {
      fee: fee.toString(),
      sequence: parseInt(data.unspent.sequence),
      maxLedgerVersion: null
    };
    const keypair = {
      privateKey: data.keys.privateKey,
      publicKey: data.keys.publicKey
    };
    api.preparePayment(address, payment, instructions)
      .then(prepared => api.sign(prepared.txJSON, keypair))
      .then(signed2 => {
        const sendTx = {
          id: 3,
          command: 'submit',
          tx_blob: signed2.signedTransaction
        };
        return callback(JSON.stringify(sendTx));
      });
  }
};

window.deterministic = wrapper;
