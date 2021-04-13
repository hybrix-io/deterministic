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
  for (const symbol in global.hybrixd.asset) {
    if (global.hybrixd.asset[symbol].hasOwnProperty('mode')) {
      const mode = global.hybrixd.asset[symbol].mode;
      // index the modes
      assets[symbol] = mode;
      if (typeof modes[mode] === 'undefined') modes[mode] = [];
      modes[mode].push(symbol);
      const baseMode = mode.split('.')[0];
      updateBlobAndHash(proc,baseMode);

    }
  }
  proc.done('Initialized');
}

exports.reload = proc => {
  const baseMode = proc.command[1];
  if(baseMode && baseMode !=='undefined'){
    proc.logs('Reload ' + baseMode+'.');
    if (hashes.hasOwnProperty(baseMode)) delete hashes[baseMode];
    updateBlobAndHash(proc,baseMode);
  }else{
    proc.logs('Reload all blob hashes');
    const baseModes = [...Object.keys(hashes)];
    for(const baseMode of baseModes){
      delete hashes[baseMode];
      updateBlobAndHash(proc,baseMode);
    }
  }
  proc.done('Reloaded');
}

function updateBlobAndHash(proc, baseMode){
  if (hashes.hasOwnProperty(baseMode)) return; // already hashed
  const filename = '../modules/deterministic/' + baseMode + '/deterministic.js.lzma';
  if (!fs.existsSync(filename)) proc.warn('Could not find  ' + filename);
  else { // hash the deterministic blob
    hashes[baseMode] = DJB2.hash(String(fs.readFileSync(filename)));
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
  const baseMode = modetype.split('.')[0];
  if (hashes.hasOwnProperty(baseMode)) proc.done({deterministic: modetype, hash: hashes[baseMode]});
  else proc.fail(`Mode or symbol '${symbol}' does not exist!`);
}

// exports
exports.init = init;
exports.assets = getAssets;
exports.modes = getModes;
exports.hashes = getHashes;
exports.hash = getHash;
