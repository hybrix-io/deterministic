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
function setNetwork (data) {
  let network = 'bitcoin';
  if (data.mode === 'bitcoincash') return '[UNDER MAINTENANCE]';
  else if (data.mode === 'counterparty' || data.mode === 'omni') network = 'bitcoin';
  else network = data.mode;
  return network;
}

let wrapper = {

  importPrivate: function (data) {
    return {WIF: data.privateKey};
  },

  // create deterministic public and private keys based on a seed
  keys: function (data) {
    const network = setNetwork(data);
    const hash = bitcoinjslib.crypto.sha256(data.seed);
    const privk = hash; // BigInteger.fromBuffer(hash);
    let keyPair;
    if (network === 'bitcoin') {
      keyPair = bitcoinjslib.ECPair.fromPrivateKey(privk); // backwards compatibility for BTC
    } else {
      keyPair = bitcoinjslib.ECPair.fromPrivateKey(privk, {
        compressed: false,
        network: bitcoinjslib.networks[network]
      });
    }
    const WIF = keyPair.toWIF();
    return {WIF};
  },

  // generate a unique wallet address from a given public key
  address: function (data) {
    const network = setNetwork(data);
    const keyPair = bitcoinjslib.ECPair.fromWIF(data.WIF, bitcoinjslib.networks[network]);
    const { address } = bitcoinjslib.payments.p2pkh({ pubkey: keyPair.publicKey, network: bitcoinjslib.networks[network] });
    return address;
  },

  // return public key
  publickey: function (data) {
    const network = setNetwork(data);
    const keyPair = bitcoinjslib.ECPair.fromWIF(data.WIF, bitcoinjslib.networks[network]);
    const publicKey = keyPair.publicKey.toString('hex');
    return publicKey;
  },

  // return private key
  privatekey: function (data) {
    return data.WIF;
  },

  transaction: function (data) {
    // return deterministic transaction data
    const network = setNetwork(data);
    const keyPair = bitcoinjslib.ECPair.fromWIF(data.keys.WIF, bitcoinjslib.networks[network]);
    const tx = new bitcoinjslib.TransactionBuilder(bitcoinjslib.networks[network]);

    // for Counterparty or Omni, add OP_RETURN message
    if (data.mode === 'counterparty' || data.mode === 'omni') {
      const MIN_REQUIRED = 546;
      const MAX_OP_RETURN = 80;

      // prepare raw transaction inputs
      let inamount = 0;
      for (let i in data.unspent.unspents) {
        let input = data.unspent.unspents[i];
        let hash = Buffer.from(input.txid.match(/.{2}/g).reverse().join(''), 'hex');
        tx.addInput(hash, input.txn);
        inamount += input.amount;
      }
      if (inamount < MIN_REQUIRED) throw new Error('Insufficient funds');

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
        let scripthex = CounterJS.Message.createSend(
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
      let outchange = parseInt(data.unspent.change) - MIN_REQUIRED; // fee is already being deducted when calculating unspents
      if (outchange < 0) { outchange = 0; }
      tx.addOutput(bitcoinjslib.address.toOutputScript(data.source, bitcoinjslib.networks[network]), outchange);
    } else {
      // add inputs
      for (let i in data.unspent.unspents) {
        tx.addInput(data.unspent.unspents[i].txid, parseInt(data.unspent.unspents[i].txn));
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
      if (outchange > 0) {
        tx.addOutput(data.source, outchange);
      }
    }

    // sign inputs
    for (let i in data.unspent.unspents) {
      tx.sign(parseInt(i), keyPair);
    }
    return tx.build().toHex();
  }
};

// export the functionality to a pre-prepared var
window.deterministic = wrapper;
