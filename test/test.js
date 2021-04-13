/*
 * Test a deterministic wrapper
 */

'use strict';

const stdio = require('stdio');
const fs = require('fs');
const CommonUtils = require('../common/index');
const Decimal = require('../common/crypto/decimal-light');
const DEFAULT_AMOUNT = '1000';
const DEFAULT_USERNAME = 'POMEW4B5XACN3ZCX';
const DEFAULT_PASSWORD = 'TVZS7LODA5CSGP6U';
const ops = stdio.getopt({
  symbol: {key: 's', args: 1, description: 'Select a symbol to run test.'},
  amount: {key: 'a', args: 1, description: 'Transaction amount. (Defaults to ' + DEFAULT_AMOUNT + ')'},
  unspent: {key: 'u', args: 1, description: 'Manually specify unspents.'},
  target: {key: 't', args: 1, description: ' Target address (Defaults to source address)'},
  fee: {key: 'f ', args: 1, description: 'Manually specify fee (Defaults to asset default fee).'},
  seed: {args: 1, description: 'Manually specify seed. NOTE: Never store the credentials anywhere unencrypted, run the command through an IDE and not through a command line, and have a separate test account ready with only small amounts.'},
  username: {args: 1, description: 'Manually specify username. (Defaults to ' + DEFAULT_USERNAME + ')'},
  password: {args: 1, description: 'Manually specify password.'},
  compiled: {args: 0, description: 'Use compiled code.'},
  build: {args: 0, description: 'Build and then use compiled code. (Set compiled to true)'},
  push: {key: 'p', args: 0, description: 'Push the signed transaction to the target chain. Restrictions such as transaction cost and funding requirements may apply. Also, you might want to specify --seed for this to work.'}
});
if(ops.build) ops.compiled = true;

// if we were called without arguments, display a message
if (!ops.symbol) {
  console.log('\nThis script tests a deterministic wrapper. hybrixd needs to be running for it to work. \n\nUsage example:\n');
  console.log('./test --symbol=dummy\n');
  console.log('For help, type:\n');
  console.log('./test --help\n');

  process.exit(1);
}

let coinSpecificTestData = {};
const username = ops.username || DEFAULT_USERNAME;
const password = ops.password || DEFAULT_PASSWORD;

console.log('[=] SESSION ================================================');
console.log('[.] username            : ' + username + (username === DEFAULT_USERNAME ? ' [DEFAULT]' : ''));
console.log('[.] password            : ***');

console.log('[=] NODE SIDE MODULE =======================================');

const recipePath = '../../node/recipes/';
if (fs.existsSync(recipePath + 'asset.' + ops.symbol + '.json')) {
  console.log('[.] Recipe file        : $HYBRIXD/node/recipes/asset.' + ops.symbol + '.json found.');
} else if (fs.existsSync(recipePath + 'token.' + ops.symbol + '.json')) {
  console.log('[.] Recipe file        : $HYBRIXD/node/recipes/token.' + ops.symbol + '.json found.');
} else {
  console.log('[!] No Recipe file found. ($HYBRIXD/node/recipes/asset.' + ops.symbol + '.json or $HYBRIXD/node/recipes/token.' + ops.symbol + '.json)');
}

const amount = ops.amount || DEFAULT_AMOUNT; // Note amount in atomics
let unspent;

/**
 * @param x
 * @param factor
 */
function fromAtomic (x, factor) {
  const decX = new Decimal(x);
  return decX.div(new Decimal(10).pow(factor)).toFixed();
}

if (typeof ops.unspent === 'string') {
  unspent = ops.unspent;
} else if (typeof ops.unspent !== 'undefined') {
  unspent = JSON.stringify(ops.unspent);
}

const fee = ops.fee;
let target = ops.target;

const Hybrix = require('../interface/hybrix-lib.nodejs.js');
const hybrix = new Hybrix.Interface({http: require('http')});

const showAddress = (dataCallback, errorCallback, keys, details, publicKey) => (address) => {
  console.log('[.] Address            :', address);
  dataCallback({address, keys, details, publicKey});
};

const showKeysGetAddress = (dataCallback, errorCallback, details) => (keys, seed) => {
  const mode = details.mode;
  const subMode = mode.split('.')[1];
  keys.mode = subMode;
  keys.seed = seed;

  console.log('[.] Keys               :', keys);
  if (typeof window.deterministic.publickey !== 'function') console.error('[!] Missing publickey method.');
  const publicKey = window.deterministic.publickey(keys);
  console.log('[.] Seed               :', seed);

  console.log('[.] Public Key         :', publicKey);
  if (typeof window.deterministic.privatekey !== 'function') console.error('[!] Missing privatekey method.');
  const privateKey = window.deterministic.privatekey(keys);
  console.log('[.] Private Key        :', privateKey);
  if (typeof window.deterministic.address !== 'function') console.error('[!] Missing address method.');
  const address = window.deterministic.address(keys, showAddress(dataCallback, errorCallback, keys, details, publicKey), errorCallback);
  if (typeof address !== 'undefined') {
    showAddress(dataCallback, errorCallback, keys, details, publicKey)(address);
  }
};

/**
 * @param details
 * @param dataCallback
 * @param errorCallback
 */
function getKeysAndAddress (details, dataCallback, errorCallback) {
  console.log('[.] Details            :', details);
  console.log('[=] CLIENT SIDE MODULE  =======================================');

  const mode = details.mode;
  const baseMode = mode.split('.')[0];
  const subMode = mode.split('.')[1];

  const deterministicPath = 'deterministic/modules/' + baseMode + '/deterministic.js';
  if (fs.existsSync('../../' + deterministicPath)) {
    console.log('[.] Deterministic file : $HYBRIXD/' + deterministicPath + ' exists.');
  } else {
    console.log('[!] Deterministic file : $HYBRIXD/' + deterministicPath + ' does not exist!');
  }
  let deterministic;
  if (ops.compiled || fs.existsSync('../../deterministic/modules/' + baseMode + '/compile.sh')) {
    if (ops.compiled) console.log('[i] Force usage of compiled code.');
    else console.log('[i] Custom compile.sh found. Using compiled version.');

    console.log('[i] Extract lzma.');
    const blob = fs.readFileSync('../../deterministic/dist/' + baseMode + '/deterministic.js.lzma').toString('utf-8');
    const LZString = require('../common/crypto/lz-string');

    const code = LZString.decompressFromEncodedURIComponent(blob);
    deterministic = CommonUtils.activate(code);
  } else {
    console.log('[i] No custom compile.sh found . Using uncompiled version.');
    require('../modules/' + baseMode + '/deterministic.js');
    deterministic = window.deterministic;
  }
  if (typeof deterministic !== 'object' || deterministic === null) {
    console.error('[!] Failed to activate deterministic code.');
  }
  const userKeys = CommonUtils.generateKeys(password, username, 0);
  const seed = ops.seed || CommonUtils.seedGenerator(userKeys, details['keygen-base']);

  console.log('[.] Seed               :', seed);
  if (typeof deterministic.keys !== 'function') console.error('[!] Missing keys method.');

  const keys = deterministic.keys({seed, mode: subMode}, showKeysGetAddress(dataCallback, errorCallback, details), errorCallback);
  if (typeof keys !== 'undefined') {
    showKeysGetAddress(dataCallback, errorCallback, details)(keys, seed);
  }
}

function build(mode){
  console.log('[.] Compiling module')
  const module = mode.split('.')[0];
  const {execSync} = require('child_process');
  let output;
  try {
    output = execSync(`sh ../scripts/npm/compile_module.sh ${module} force`).toString();
  }catch(error){
    console.log('[i] Failed to compiled module ', error);
    return;
  }
  console.log(output);
  console.log('[i] Module compiled');
}

/**
 * @param result
 */
function outputResults (result) {
  coinSpecificTestData = result.test;

  if (typeof result.sample === 'object') {
    if (!target) {
      console.log('[.] Sample address     : ' + result.sample.address + '[Using as target]');
      target = result.sample.address;
    } else {
      console.log('[.] Sample address     : ' + result.sample.address);
    }
    console.log('[.] Sample transaction : ' + result.sample.transaction);
  } else {
    console.log('[!] No sample available.');
  }
  console.log('[.] Contract           : ' + result.contract);
  console.log('[.] Fee                : ' + result.fee);
  console.log('[.] Factor             : ' + result.factor);
  console.log('[.] Fee-symbol         : ' + result['fee-symbol']);
  console.log('[.] Keygen-base        : ' + result['keygen-base']);

  if (typeof result.mode === 'string') {
    console.log('[.] Mode               : ' + result.mode);
    if(ops.build) build(result.mode);
  } else {
    console.log('[!] Mode not defined');
  }
}

const toIntLocal = function (input, factor) {
  const f = Number(factor);
  const x = new Decimal(String(input));
  return x.times('1' + (f > 1 ? '0'.repeat(f) : '')).toString();
};

/**
 * @param data
 * @param dataCallback
 * @param errorCallback
 */
function createTransaction (data, dataCallback, errorCallback) {
  if (typeof data.balance === 'undefined') {
    console.log('[!] Balance            : undefined [Failed to retrieve balance]');
  } else if (new Decimal(data.balance).times(new Decimal(10).pow(data.result.details.factor)).lt(new Decimal(amount))) {
    console.log('[!] Balance            : ' + data.balance + ' ' + data.result.details.symbol.toUpperCase() + ' [Insufficient]');
  } else {
    console.log('[.] Balance            : ' + data.balance + ' ' + data.result.details.symbol.toUpperCase());
  }

  let actualUnspent;
  if (typeof unspent !== 'undefined') {
    actualUnspent = unspent;
    console.log('[.] Unspents           : ' + JSON.stringify(actualUnspent) + ' (Manual)');
  } else if (coinSpecificTestData && coinSpecificTestData.hasOwnProperty('unspent')) {
    actualUnspent = coinSpecificTestData.unspent;
    console.log('[.] Unspents           : ' + JSON.stringify(actualUnspent) + ' (Coin specific test data )');
  } else if (typeof data.unspent === 'undefined') {
    console.log('[!] Unspents           : undefined [Failed to retrieve unspents]');
  } else {
    actualUnspent = data.unspent;
    console.log('[.] Unspents           : ' + JSON.stringify(actualUnspent));
  }

  const mode = data.result.details.mode;
  const subMode = mode.split('.')[1];

  const tx = {
    symbol: data.result.details.symbol,
    amount: amount,
    fee: toIntLocal(typeof fee === 'undefined' ? data.result.details.fee : fee, data.result.details['fee-factor']),
    keys: data.result.keys,
    source: data.result.address,
    target: target,
    contract: data.result.details.contract,
    mode: subMode, // deterministic expects the submode, not the entire mode
    unspent: actualUnspent,
    factor: data.result.details.factor,
    time: coinSpecificTestData.time,
    seed: data.result.keys.seed
  };

  console.log('[.] data passed to deterministic           : ', tx);
  if (typeof window.deterministic.transaction !== 'function') console.error('[!] Missing transaction method.');
  const result = window.deterministic.transaction(tx, dataCallback, errorCallback);
  if (typeof result !== 'undefined') {
    dataCallback(result);
  }
}

/**
 * When the optional --push flag is specified, the transaction is pushed to the target chain.
 *
 * Restrictions such as transaction cost and funding requirements may apply.
 *
 * @param signedTrxData The signed transaction data.
 * @returns The Hybrix command for 'push', depending on the --push flag.
 */
function optionalPushToTargetChain (signedTrxData) {
  return ops.push
    ? {result: {data: {query: `/asset/${ops.symbol}/push/${signedTrxData}`}, step: 'rout'}}
    : {result: {data: {signedTrxData}, step: 'id'}};
}

/**
 * @param signedTrxDataAndHash
 */
function outputAndCheckHash (signedTrxDataAndHash) {
  if (username !== 'POMEW4B5XACN3ZCX') {
    console.log('[.] Transaction        :', signedTrxDataAndHash.signedTrxData);
    console.log('[i] Skipping hash comparison as the test user POMEW4B5XACN3ZCX is not used');
  } else {
    console.log('[.] Transaction        :', signedTrxDataAndHash.signedTrxData);
    console.log('[.] Transaction Hash   :', signedTrxDataAndHash.hash);

    if (coinSpecificTestData.hasOwnProperty('hash')) {
      if (signedTrxDataAndHash.hash === coinSpecificTestData.hash) {
        console.log('[v] Test Hash          :', coinSpecificTestData.hash, '[MATCH]');
      } else if (coinSpecificTestData.hash === 'dynamic') {
        console.log('[i] Test Hash          :', 'dynamic');
      } else {
        console.log('[!] Test Hash          :', coinSpecificTestData.hash, '[NO MATCH!]');
      }
    } else {
      console.log('[i] Test Hash          :', 'NOT AVAILABLE');
    }
  }
}

/**
 * @param nonAtomicAmount
 * @param feeAmount
 * @param details
 */
function getFeeForUnspents (nonAtomicAmount, feeAmount, details) {
  if (typeof feeAmount === 'string' || typeof feeAmount === 'number') {
    return details['fee-symbol'] === details.symbol
      ? new Decimal(nonAtomicAmount).add(new Decimal(feeAmount)).toFixed()
      : nonAtomicAmount;
  } else if (typeof feeAmount === 'object' && feeAmount !== null) {
    return feeAmount.hasOwnProperty(details.symbol)
      ? new Decimal(nonAtomicAmount).add(new Decimal(feeAmount[details.symbol])).toFixed()
      : nonAtomicAmount;
  } else {
    return NaN;
  }
}

hybrix.sequential(
  [
    'init',
    {host: 'http://localhost:1111/'}, 'addHost',
    {
      sample: {data: {query: '/asset/' + ops.symbol + '/sample'}, step: 'rout'},
      test: {data: {query: '/asset/' + ops.symbol + '/test'}, step: 'rout'},
      contract: {data: {query: '/asset/' + ops.symbol + '/contract'}, step: 'rout'},
      fee: {data: {query: '/asset/' + ops.symbol + '/fee'}, step: 'rout'},
      factor: {data: {query: '/asset/' + ops.symbol + '/factor'}, step: 'rout'},
      'fee-symbol': {data: {query: '/asset/' + ops.symbol + '/fee-symbol'}, step: 'rout'},
      'keygen-base': {data: {query: '/asset/' + ops.symbol + '/keygen-base'}, step: 'rout'},
      mode: {data: {query: '/asset/' + ops.symbol + '/mode'}, step: 'rout'}
    }, 'parallel',

    outputResults,

    {query: '/asset/' + ops.symbol + '/details'}, 'rout',

    details => {
      return {data: details, func: getKeysAndAddress};
    }, 'call',

    result => {
      const feeAmount = typeof fee === 'undefined' ? result.details.fee : fee;
      const nonAtomicAmount = fromAtomic(amount, result.details.factor);
      const unspentAmount = getFeeForUnspents(nonAtomicAmount, feeAmount, result.details);

      console.log('[.] Amount             : ' + nonAtomicAmount + ' ' + result.details.symbol.toUpperCase());
      console.log('[.] Unspent amount     : ' + unspentAmount + ' ' + result.details.symbol.toUpperCase());
      return {
        unspent: {
          data: {query: '/asset/' + ops.symbol + '/unspent/' + result.address + '/' + unspentAmount + '/' + result.address + '/' + result.publicKey},
          step: 'rout'
        },
        balance: {
          data: {query: '/asset/' + ops.symbol + '/balance/' + result.address},
          step: 'rout'
        },
        result: {data: result, step: 'id'}
      };
    }, 'parallel',
    result => {
      return {data: result, func: createTransaction};
    }, 'call',
    result => { return {hash: {data: {data: result}, step: 'hash'}, signedTrxData: {data: result, step: 'id'}}; }, 'parallel',

    outputAndCheckHash,

    // When the optional --push flag is specified, the transaction is pushed to the target chain.
    // Restrictions such as transaction cost and funding requirements may apply.
    optionalPushToTargetChain

  ],
  result => {
    console.log(`\n[v] Successfully ran test for symbol ${ops.symbol}\n`);
  },
  error => {
    if (error instanceof Error) {
      console.error('[!] ', error);
    } else {
      try {
        const data = JSON.parse(error);
        if (data.hasOwnProperty('help')) {
          console.trace('[!] ' + data.help);
        } else {
          console.trace('[!] ', error);
        }
      } catch (e) {
        console.trace('[!] ', error);
      }
    }
  }
);
