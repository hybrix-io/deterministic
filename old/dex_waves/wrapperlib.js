//
// wrapperlib to include libraries for incorporation into the virtual DOM
//

Decimal = require('../../common/crypto/decimal-light'); Decimal.set({ precision: 64 });

// shim for randomBytes to avoid require('crypto') incompatibilities
// solves bug: "There was an error collecting entropy from the browser
const randomBytes = crypto.randomBytes;
if (typeof window === 'object') {
  const wCrypto = window.crypto = window.crypto || {};
  if (!wCrypto.getRandomValues) {
    wCrypto.getRandomValues = function getRandomValues (arr) {
      const bytes = randomBytes(arr.length);
      for (var i = 0; i < bytes.length; i++) {
        arr[i] = bytes[i];
      }
    };
  }
}

// inclusion of necessary requires
var ethereumjs = {
  base58: require('base-58'),
  crypto_lib: require('./crypto.js'),
  lodash: require('lodash'),
  web3utils: require('web3-utils')
};

module.exports = ethereumjs;
