//
// wrapperlib to include libraries for incorporation into the virtual DOM
//

// inclusion of necessary requires
let bitcoincashlib = {
  bitcore: require('bitcore-lib-cash'),
  cashaddrjs: require('cashaddrjs'),
  slpjs: require('slpjs'),
  bchaddr: require('bchaddrjs'),
  bchaddrSLP: require('bchaddrjs-slp')
};

module.exports = bitcoincashlib;
