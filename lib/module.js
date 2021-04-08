// (C) 2015 Internet of Coins / hybrix / Joachim de Koning / Rouke Pouw
// hybrixd module - deterministic/module.js
// Module to provide deterministic cryptography tools

const DJB2 = require('../../common/crypto/hashDJB2'); // fast DJB2 hashing
const fs = require('fs');

const assets = {};
const modes = {};
const hashes = {};

// initialization function
/**
 * @param proc
 */
function init (proc) {
  // initialize available modes TODO get rid of global assets
  for (const asset in global.hybrixd.asset) {
    const mode = (typeof global.hybrixd.asset[asset].mode !== 'undefined' ? global.hybrixd.asset[asset].mode : false);
    if (mode) {
      // index the modes
      assets[asset] = mode;
      if (typeof modes[mode] === 'undefined') modes[mode] = [];
      modes[mode].push(asset);

      // hash the deterministic packages
      const filename = '../modules/deterministic/' + mode.split('.')[0] + '/deterministic.js.lzma';
      if (!fs.existsSync(filename)) {
        proc.warn('Could not find  ' + filename);
      } else if (typeof hashes[mode.split('.')[0]] === 'undefined') {
        hashes[mode.split('.')[0]] = DJB2.hash(String(fs.readFileSync(filename)));
      }
    }
  }
}

const [getAssets, getHashes, getModes] = [assets, hashes, modes].map(obj => proc => proc.done(obj));

/**
 * @param proc
 */
function getHash (proc) {
  const command = proc.command;
  const symbol = command[1].toLowerCase();
  const base = symbol.split('.')[0];

  let modetype = base;
  for (const entry in modes) {
    if (modes[entry].indexOf(symbol) !== -1) modetype = entry;
  }
  const basemode = modetype.split('.')[0];
  const hash = hashes[basemode];
  if (typeof hashes[basemode] !== 'undefined') proc.done({deterministic: modetype, hash});
  else proc.fail('Error: Mode or symbol does not exist!');
}

// exports
exports.init = init;
exports.assets = getAssets;
exports.modes = getModes;
exports.hashes = getHashes;
exports.hash = getHash;
