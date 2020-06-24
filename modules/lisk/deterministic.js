// (C) 2015 Internet of Coins / Metasync / Joachim de Koning
// hybrixd module - lisk/deterministic.js
// Deterministic encryption wrapper for Lisk
//
// [!] Browserify this and save to deterministic.js.lzma to enable sending it from hybrixd to the browser!
//

let wrapperlib = require('./lisk-js/index.js');

let wrapper = (
  function () {
    let functions = {
      // create deterministic public and private keys based on a seed
      keys: function (data) {
        // return object { publicKey:'', privateKey:'' }
        return wrapperlib.crypto.getKeys(data.seed);
      },

      // generate a unique wallet address from a given public key
      address: function (data) {
        let address = wrapperlib.crypto.getAddress(data.publicKey);
        let output = null;
        switch (data.mode) {
          case 'rise':
            output = address.substr(0, address.length - 1) + 'R';
            break;
          case 'shift':
            output = address.substr(0, address.length - 1) + 'S';
            break;
          default:
            output = address;
            break;
        }
        return output;
      },

      // TODO importPublic
      // TODO importPrivate
      // TODO sumKeys

      // return public key
      publickey: function (data) {
        return data.publicKey;
      },

      // return private key
      privatekey: function (data) {
        return data.privateKey;
      },

      transaction: function (data) {
        // return deterministic transaction data
        // example: lisk.transaction.createTransaction("1859190791819301L", amount, "passphrase", "secondPassphrase");
        // for more information see: https://github.com/corsaro1/lisk_broadcast
        const timeOffset = data.hasOwnProperty('time') ? (data.time - Date.now()) : undefined;
        let tx = wrapperlib.transaction.createTransaction(data.target, parseInt(data.amount), data.seed, undefined, timeOffset);
        const hasValidMessage = data.message !== undefined && data.message !== null;

        if (hasValidMessage) tx.data = data.message;

        if (data.mode === 'lisk') { // added to match new lisk API, rise and shift still using old
          tx.amount = String(tx.amount);
          tx.fee = String(tx.fee);
        }

        if (data.mode === 'rise') tx.senderId = data.source;

        if (data.mode === 'shift') tx = { recipientId: data.target, amount: Number(data.amount), secret: data.seed }

        return JSON.stringify(tx);
      }
    };
    return functions;
  }
)();

// export the functionality to a pre-prepared var
window.deterministic = wrapper;
