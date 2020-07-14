// (C) 2017 Internet of Coins / Metasync / Joachim de Koning
// hybrixd module - waves/deterministic.js
// Deterministic encryption wrapper for Waves

let wrapperlib = require('./wrapperlib');

function uglyClone (obj) { return JSON.parse(JSON.stringify(obj)); }

// Why this? When I rm it, stuff still works... Why update window object.
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

let wrapper = (
  function () {
    // Takes a bytes-array and returns the corresponding hexadecimal number.
    function bytesToHex (byteArray) {
      return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
      }).join('');
    }
    // Takes a hexadecimal number and returns the corresponding bytes-array.
    function hexToBytes (hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2) { bytes.push(parseInt(hex.substr(c, 2), 16)); }
      return Uint8Array.from(bytes);
    }

    // Takes a number and a factor and adds that many orders of magnitude to the numbers. Returns the number as a string.
    function toSatoshi (amount, factor) {
      amount = new Decimal(amount);
      let toSatoshiFactor_ = new Decimal(10);
      let toSatoshiFactor = toSatoshiFactor_.pow(factor);
      amount = amount.mul(toSatoshiFactor);
      return parseInt(amount.toString());
    }

    // Takes the amounts in asset1 and asset2 and the factor of asset2 and returns the price as expected by WAVES. The price returned is the amount of atomic asset2 received for each whole asset1 sent.
    // e.g. if asset1 is waves and asset2 is waves.usd, how many 0.01 waves.usd do you want to get per 1 waves?
    function wavesPrice (asset1Amount, asset2Amount, asset2Factor) {
      let asset1Decimal = new Decimal(asset1Amount);
      let asset2Decimal = new Decimal(toSatoshi(asset2Amount, asset2Factor));

      return asset2Decimal.idiv(asset1Decimal).toNumber();
    }

    // Sorts 2 assets based on the base58 asset id, returns an ordered pair.
    function sortAssets (spendAssetId, receiveAssetId) {
      let orderedAssetPair = {};

      if (spendAssetId.length < receiveAssetId.length) {
        orderedAssetPair.asset1 = spendAssetId;
        orderedAssetPair.asset2 = receiveAssetId;
      } else if (spendAssetId.length > receiveAssetId.length) {
        orderedAssetPair.asset1 = receiveAssetId;
        orderedAssetPair.asset2 = spendAssetId;
      } else {
        let spendAssetIDAsBuffer = Buffer.from(wrapperlib.base58.decode(spendAssetId));
        let receiveAssetIDAsBuffer = Buffer.from(wrapperlib.base58.decode(receiveAssetId));

        if (spendAssetIDAsBuffer.compare(receiveAssetIDAsBuffer) > 0) {
          orderedAssetPair.asset1 = spendAssetId;
          orderedAssetPair.asset2 = receiveAssetId;
        } else {
          orderedAssetPair.asset1 = receiveAssetId;
          orderedAssetPair.asset2 = spendAssetId;
        }
      }
      return orderedAssetPair;
    }
    // Takes in an order and converts it to a hexidecimal number as required by waves for signing the order.
    function orderToHex (order) {
      let otype;
      function assetToHex (assetID) {
        let assetAsHex;
        if (assetID === '') {
          assetAsHex = '00';
        } else {
          assetAsHex = '01' + bytesToHex(wrapperlib.base58.decode(assetID));
        }
        return assetAsHex;
      }
      if (order.orderType === 'buy') {
        otype = '00';
      } else {
        otype = '01';
      }

      return bytesToHex(wrapperlib.base58.decode(order.senderPublicKey)) +
        bytesToHex(wrapperlib.base58.decode(order.matcherPublicKey)) +
        assetToHex(order.assetPair.amountAsset) +
        assetToHex(order.assetPair.priceAsset) +
        otype +
        order.price.toString(16).padStart(16, '0') +
        order.amount.toString(16).padStart(16, '0') +
        order.timestamp.toString(16).padStart(16, '0') +
        order.expiration.toString(16).padStart(16, '0') +
        order.matcherFee.toString(16).padStart(16, '0');
    }

    // Takes a privatekey as base58 string, an unsigned waves order and a random seed as hexadecimal string and returns the signature for that order.
    function signOrder (privkey, order, hexRandomSeed) {
      let orderAsHex = orderToHex(order);
      let privkeyAsByteArray = wrapperlib.base58.decode(privkey);
      let axlsign = {};
      wrapperlib.crypto_lib.axlsign(axlsign);

      let signedUint8Array = axlsign.sign(privkeyAsByteArray,
        hexToBytes(orderAsHex),
        hexToBytes(hexRandomSeed));
      return wrapperlib.base58.encode(signedUint8Array);
    }

    let functions = {

      /* Takes a data object with properties of a desired waves order, and creates the corresponding signed waves order.
       * data = { spendAmount, // The amount of whole token/waves you want to spend in the order.
       *          spendAsset,  // The details of the token/waves you want to spend (e.g. the result returned by '/asset/waves/details' or '/asset/waves.usd/details').
       *          receiveAmount, // The amount of whole token/waves you want to receive in the order.
       *          receiveAsset, // The details of the token/waves you want to receive (e.g. the result returned by '/asset/waves/details' or '/asset/waves.usd/details').
       *          matcherFee, // The fee to be given to the matcher for fulfilling the order.
       *          maxLifetime, // The maximum amount of seconds for the order to 'live' before expiring.
       *          matcherPublicKey, // The public key of the matcher (can be found through: '/engine/dex_waves/getMatcherPublicKey').
       *          publickey, // The public key of the issuer of the order.
       *          privKey // The private key of the issuer of the order (only used to sign the order).
       *        }
       */
      makeSignedWavesOrder: function (data) {
        let orderedAssetPair = sortAssets(data.spendAsset.contract, data.receiveAsset.contract);
        let orderType, amount, price;
        if (data.hasOwnProperty('swap')) {
          let swapVar = orderedAssetPair.asset1;
          orderedAssetPair.asset1 = orderedAssetPair.asset2;
          orderedAssetPair.asset2 = swapVar;
        }

        if (data.receiveAsset.contract === orderedAssetPair.asset1) {
          orderType = 'buy';
          amount = toSatoshi(data.receiveAmount, data.receiveAsset.factor);
          price = wavesPrice(data.receiveAmount, data.spendAmount, data.spendAsset.factor);
        } else {
          orderType = 'sell';
          amount = toSatoshi(data.spendAmount, data.spendAsset.factor);
          price = wavesPrice(data.spendAmount, data.receiveAmount, data.receiveAsset.factor);
        }

        let currentTime = Date.now();
        let order = {'signature': '',
          'amount': amount,
          'matcherPublicKey': data.matcherPublicKey,
          'timestamp': currentTime,
          'orderType': orderType,
          'price': price,
          'expiration': currentTime + (data.maxLifetime * 1000),
          'matcherFee': data.matcherFee,
          'senderPublicKey': data.publickey,
          'assetPair':
                 {
                   'amountAsset': orderedAssetPair.asset1,
                   'priceAsset': orderedAssetPair.asset2
                 }
        };

        order.signature = signOrder(data.privKey, order, randomBytes(64).toString('hex'));
        return order;
      }
    };
    return functions;
  }
)();

// export the functionality to a pre-prepared var
window.deterministic = wrapper;
