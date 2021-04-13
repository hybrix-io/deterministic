// (C) 2015 Internet of Coins / Metasync / Joachim de Koning
// hybrixd module - electrum/deterministic_source.js
// Deterministic encryption wrapper for Bitcoin
//
// [!] Browserify this and save to deterministic.js.lzma to enable sending it from hybrixd to the browser!
//
const bitcoinjslib = require('./node_modules/bitcoinjs-lib/');
bitcoinjslib.networks = {...bitcoinjslib.networks, ...require('./coininfo/networks.js')}; // inject alt coin network definitions

/**
 * @param data
 */
function setNetwork (mode) {
  return mode === 'counterparty' || mode === 'omni'
   ? 'bitcoin'
   : mode;
}

function mkKeyPair (seed, network) {
  const hash = bitcoinjslib.crypto.sha256(seed);
  const keyPair = network === 'bitcoin'
    ? bitcoinjslib.ECPair.fromPrivateKey(hash) // backwards compatibility for BTC
    : bitcoinjslib.ECPair.fromPrivateKey(hash, {
        compressed: false,
        network: bitcoinjslib.networks[network]
      });
  return keyPair;
}

function mkKeyPairFromWIF (WIF, network) {
  return bitcoinjslib.ECPair.fromWIF(WIF, bitcoinjslib.networks[network]);
}

function mkPublicKey (keyPair) {
  // reference: https://learnmeabitcoin.com/technical/public-key
  return keyPair.publicKey.toString('hex');
}

function mkAddress (keyPair, network) {
    const { address } = bitcoinjslib.payments.p2pkh({ pubkey: keyPair.publicKey, network: bitcoinjslib.networks[network] });
    return address;
}

const wrapper = {

  // create deterministic public and private keys based on a seed
  keys: data => {
    const network = setNetwork(data.mode);
    const keyPair = mkKeyPair(data.seed, network);
    const WIF = keyPair.toWIF();
    const publicKey = mkPublicKey(keyPair);
    const address = mkAddress(keyPair, network);

    return {
      WIF,
      publicKey,
      address
    };
  },

  importPrivate: function (data) {
    const network = setNetwork(data.mode);
    const keyPair = mkKeyPairFromWIF(data.privateKey, network);
    const publicKey = mkPublicKey(keyPair);
    const address = mkAddress(keyPair, network);
    return {
      WIF:data.privateKey,
      publicKey,
      address
    };
  },

  // generate a unique wallet address from a given public key
  address: data => data.address,

  // return public key
  publickey: data => data.publicKey,

  // return private key
  privatekey: data => data.WIF,

  // return deterministic transaction data
  transaction: data => {
    const network = setNetwork(data.mode);
    const keyPair = bitcoinjslib.ECPair.fromWIF(data.keys.WIF, bitcoinjslib.networks[network]);
    const tx = new bitcoinjslib.TransactionBuilder(bitcoinjslib.networks[network]);

    // for Counterparty or Omni, add OP_RETURN message
    if (data.mode === 'counterparty' || data.mode === 'omni') {
      const MIN_REQUIRED = 546;
      const MAX_OP_RETURN = 80;

      // prepare raw transaction inputs
      let inamount = 0;
      for (let i in data.unspent.unspents) {
        const input = data.unspent.unspents[i];
        const hash = Buffer.from(input.txid.match(/.{2}/g).reverse().join(''), 'hex');
        tx.addInput(hash, input.txn);
        inamount += input.amount;
      }
      if (inamount < MIN_REQUIRED) throw new Error(`Insufficient funds: ${inamount}, minimal required: ${MIN_REQUIRED}.`);

      // in case of Counterparty or Omni, add destination output
      if (data.target && typeof data.target === 'string') {
        const dest = {
          address: data.target,
          value: MIN_REQUIRED
        };
        tx.addOutput(bitcoinjslib.address.toOutputScript(dest.address, bitcoinjslib.networks[network]), dest.value);
      }

      // create and add message
      let encoded;
      if (data.mode === 'counterparty') {
        const CounterJS = require('./CounterJS');

        // create Send
        const scripthex = CounterJS.Message.createSend(
          CounterJS.util.assetNameToId(data.contract),
          parseInt(data.amount)
        );
        // encrypt/encode
        encoded = scripthex.toEncrypted(data.unspent.unspents[0].txid, true);
      } else if (data.mode === 'omni') {
        const omniSend = require('./omni-simple-send');

        // create encoded Send
        encoded = omniSend(parseInt(data.contract), parseInt(data.amount));
      }

      // add OP_RETURN
      for (let bytesWrote = 0; bytesWrote < encoded.length; bytesWrote += MAX_OP_RETURN) {
        const opReturn = encoded.slice(bytesWrote, bytesWrote + MAX_OP_RETURN);
        const dataScript = bitcoinjslib.payments.embed({ data: [opReturn] });
        tx.addOutput(dataScript.output, 0); // OP_RETURN always with 0 value unless you want to burn coins
      }

      // send back change
      const outchange = Math.max(0, parseInt(data.unspent.change) - MIN_REQUIRED); // fee is already being deducted when calculating unspents

      tx.addOutput(bitcoinjslib.address.toOutputScript(data.source, bitcoinjslib.networks[network]), outchange);
    } else {
      // add inputs
      for (const unspent of data.unspent.unspents) {
        tx.addInput(unspent.txid, parseInt(unspent.txn));
      }

      let target;
      if (data.mode === 'bitcoin' && data.target.startsWith('bc1')) {
        const targetAddress = bitcoinjslib.address.fromBech32(data.target);
        target = bitcoinjslib.address.toBase58Check(targetAddress.data, bitcoinjslib.networks[network].pubKeyHash);
      } else {
        target = data.target;
      }
      // add spend amount output
      tx.addOutput(target, parseInt(data.amount));

      // send back change
      const outchange = parseInt(data.unspent.change); // fee is already being deducted when calculating unspents
      if (outchange > 0) tx.addOutput(data.source, outchange);
    }

    // sign inputs
    for (const i in data.unspent.unspents) {
      tx.sign(parseInt(i), keyPair);
    }
    return tx.build().toHex();
  }
};

// export the functionality to a pre-prepared var
window.deterministic = wrapper;
