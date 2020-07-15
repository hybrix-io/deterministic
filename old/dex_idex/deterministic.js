// (C) 2017 Internet of Coins / Joachim de Koning
// hybrixd module - ethereum/deterministic.js
// Deterministic encryption wrapper for Ethereum

let wrapperlib = require('./wrapperlib');

let wrapper = (
  function () {
    let ETHAddress = '0x0000000000000000000000000000000000000000';
    let ETHfactor = 18;

    // Helper function (turns an amount from whole token/ETH to atomic units, both input and output amounts are strings).
    function toSatoshi (amount, factor) {
      amount = new Decimal(amount);
      let toSatoshiFactor_ = new Decimal(10);
      let toSatoshiFactor = toSatoshiFactor_.pow(factor);
      amount = amount.mul(toSatoshiFactor);
      return amount.toString();
    }

    // Helper function (to send an order and to cancel an order requires hashing the same arguments in exactly the same way, delegating that task to a helper-function ensures consistency).
    function createOrderHash (tokenBuy, amountBuy, tokenSell, amountSell, nonce, address) {
      let idexContractAddress = '0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208';
      let expires = 1; // expires parameter, is unused by the API but still required to be passed in the call (due to backwards compatibility issues at idex)
      return wrapperlib.web3utils.soliditySha3({
        t: 'address',
        v: idexContractAddress
      }, {
        t: 'address',
        v: tokenBuy
      }, {
        t: 'uint256',
        v: amountBuy
      }, {
        t: 'address',
        v: tokenSell
      }, {
        t: 'uint256',
        v: amountSell
      }, {
        t: 'uint256',
        v: expires
      }, {
        t: 'uint256',
        v: nonce
      }, {
        t: 'address',
        v: address
      });
    }

    let functions = {

      // create deterministic public and private keys based on a seed. This function was copied from the ethereum deterministic module.
      keys: function (data) {
        let privateKey = wrapperlib.ethUtil.sha256(data.seed);
        return {privateKey: privateKey};
      },

      // generate a unique wallet address from a given public key. This function was copied from the ethereum deterministic module.
      address: function (data) {
        let publicKey = wrapperlib.ethUtil.privateToPublic(data.privateKey);
        return '0x' + wrapperlib.ethUtil.publicToAddress(publicKey).toString('hex');
      },

      /* data = {amountETH    // The amount of ETH that will bought/sold in the order. This is a string that corresponds to the amount of whole ETH, i.e. '2.5' corresponds to selling/buying 2.5 ETH.
       *       , amountToken  // The amount of the token that will be bought/sold in the order. This is a string that corresponds to the amount of whole token, i.e. '2.5' corresponds to selling/buying 2.5 token.
       *       , isBuyOrder   // Boolean value (not a string). 'true' means the order is a buy order (buying token using ETH), 'false' means that the order is a sell order (selling token for ETH).
       *       , token        // The result of /asset/TOKEN/details  e.g. /asset/eth.kin/details. This needs to be the token of the order you are trying to cancel.
       *       , nonce        // The latest nonce for a new transaction as a regular integer. Available here: /engine/idex/getNextNonce/ADDRESS (fill in the address)
       *       , address      // The address where the ETH/tokenes need to go back to.
       *       , privateKey   // The private key that belongs to the address (only used for signing the output)
       *       }
       */
      makeSignedIdexOrder: function (data) {
        // let contractAddress = '0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208'; // https://api.idex.market/returnContractAddress
        let tokenAddress = data.token.contract;
        let tokenFactor = data.token.factor;
        let amountToken_ = data.amountToken;
        let amountETH_ = data.amountETH;

        let amountToken = toSatoshi(amountToken_, tokenFactor);
        let amountETH = toSatoshi(amountETH_, ETHfactor);

        let tokenBuy, amountBuy, tokenSell, amountSell;

        if (data.isBuyOrder) {
          tokenBuy = tokenAddress;
          amountBuy = amountToken;
          tokenSell = ETHAddress;
          amountSell = amountETH;
        } else {
          tokenBuy = ETHAddress;
          amountBuy = amountETH;
          tokenSell = tokenAddress;
          amountSell = amountToken;
        }

        let nonce = data.nonce;
        let address = data.address;
        let privateKey = data.privateKey.privateKey.toString('hex');

        const privateKeyBuffer = Buffer.from(privateKey, 'hex');

        const expires = null;

        const raw = createOrderHash(tokenBuy, amountBuy, tokenSell, amountSell, nonce, address);

        const salted = wrapperlib.ethUtil.hashPersonalMessage(wrapperlib.ethUtil.toBuffer(raw));
        const {
          v,
          r,
          s
        } = wrapperlib.lodash.mapValues(wrapperlib.ethUtil.ecsign(salted, privateKeyBuffer), (value, key) => key === 'v' ? value : wrapperlib.ethUtil.bufferToHex(value));
        // send v, r, s values in payload
        return {'tokenBuy': tokenBuy,
          'amountBuy': amountBuy,
          'tokenSell': tokenSell,
          'amountSell': amountSell,
          'address': address,
          'nonce': nonce,
          'expires': expires,
          'v': v,
          'r': r,
          's': s
        };
      },

      /* data = {amount       // The amount of ETH that was offered to be bought/sold in the order you are trying to cancel. This is a string that corresponds to the amount of whole ETH, i.e. '2.5' corresponds to selling/buying 2.5 ETH.
       *       , amountToken  // The amount of the token that was offered to be bought/sold in the order you are trying to cancel. This is a string that corresponds to the amount of whole token, i.e. '2.5' corresponds to selling/buying 2.5 token.
       *       , isBuyOrder   // Boolean value (not a string). 'true' means the order you are trying to cancel was a buy order, 'false' means that the order you are trying to cancel was a sell order.
       *       , token        // The result of /asset/TOKEN/details  e.g. /asset/eth.kin/details. This needs to be the token of the order you are trying to cancel.
       *       , nonceOfOrder // The nonce of the transaction you are trying to cancel, as a regular integer
       *       , nonce        // The latest nonce for a new transaction as a regular integer. Available here: /engine/idex/getNextNonce/ADDRESS (fill in the address)
       *       , address      // The address where the ETH/tokenes need to go back to.
       *       , privateKey   // The private key that belongs to the address (only used for signing the output)
       *       }
       */
      cancelSignedIdexOrder: function (data) {
        let nonce = data.nonce;
        let address = data.address;
        let privateKey = data.privateKey.privateKey.toString('hex');
        let tokenAddress = data.token.contract;
        let tokenFactor = data.token.factor;

        let amountToken_ = data.amountToken;
        let amountETH_ = data.amountETH;

        let amountToken = toSatoshi(amountToken_, tokenFactor);
        let amountETH = toSatoshi(amountETH_, ETHfactor);

        let tokenBuy, amountBuy, tokenSell, amountSell;

        if (data.isBuyOrder) {
          tokenBuy = tokenAddress;
          amountBuy = amountToken;
          tokenSell = ETHAddress;
          amountSell = amountETH;
        } else {
          tokenBuy = ETHAddress;
          amountBuy = amountETH;
          tokenSell = tokenAddress;
          amountSell = amountToken;
        }

        const privateKeyBuffer = Buffer.from(privateKey, 'hex');

        const orderHash = createOrderHash(tokenBuy, amountBuy, tokenSell, amountSell, data.nonceOfOrder, address);

        const raw = wrapperlib.web3utils.soliditySha3({
          t: 'bytes',
          v: orderHash
        }, {
          t: 'uint256',
          v: nonce
        });
        const salted = wrapperlib.ethUtil.hashPersonalMessage(wrapperlib.ethUtil.toBuffer(raw));

        const {
          v,
          r,
          s
        } = wrapperlib.lodash.mapValues(wrapperlib.ethUtil.ecsign(salted, privateKeyBuffer), (value, key) => key === 'v' ? value : wrapperlib.ethUtil.bufferToHex(value));

        // send v, r, s values in payload
        return {'orderHash': orderHash,
          'address': address,
          'nonce': nonce,
          'v': v,
          'r': r,
          's': s
        };
      },

      /* data = { token       // The result of /asset/TOKEN/details  e.g. /asset/eth.kin/details
       *        , amount      // String in whole token or ETH, e.g. 2.5 ETH is the string '2.5'
       *        , nonce       // The latest nonce for a new transaction as a regular integer. Available here: /engine/idex/getNextNonce/ADDRESS (fill in the address)
       *        , address     // The address where the ETH/tokenes need to go back to.
       *        , privateKey  // The private key that belongs to the address (only used for signing the output)
       *        }
       */
      SignedIdexWithdrawal: function (data) {
        let contractAddress = '0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208'; // https://api.idex.market/returnContractAddress
        let token = data.token.contract;
        let amount = toSatoshi(data.amount, data.token.factor);
        let nonce = data.nonce;
        let address = data.address;
        let privateKey = data.privateKey.privateKey.toString('hex');

        const privateKeyBuffer = Buffer.from(privateKey, 'hex');
        const raw = wrapperlib.web3utils.soliditySha3({
          t: 'address',
          v: contractAddress
        }, {
          t: 'address',
          v: token
        }, {
          t: 'uint256',
          v: amount
        }, {
          t: 'address',
          v: address
        }, {
          t: 'uint256',
          v: nonce
        });

        const salted = wrapperlib.ethUtil.hashPersonalMessage(wrapperlib.ethUtil.toBuffer(raw));
        const {
          v,
          r,
          s
        } = wrapperlib.lodash.mapValues(wrapperlib.ethUtil.ecsign(salted, privateKeyBuffer), (value, key) => key === 'v' ? value : wrapperlib.ethUtil.bufferToHex(value));
        // send v, r, s values in payload
        return {'address': address,
          'amount': amount,
          'token': token,
          'nonce': nonce,
          'v': v,
          'r': r,
          's': s
        };
      }
    };

    return functions;
  }
)();

// export functionality to a pre-prepared var
window.deterministic = wrapper;
