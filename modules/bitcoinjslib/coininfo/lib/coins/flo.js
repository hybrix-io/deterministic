// https://github.com/florincoin/florincoin/blob/master/src/chainparams.cpp
//
// Agent725 notes:
// This serves as an example of a BitcoinJSlib barebones compatible network definition file
//

var common = {
  name: 'Florincoin',
  unit: 'FLO'
}

var main = Object.assign({}, {
  versions: {
		bip32: {
			public: 0x0134406b,
			private: 0x01343c31
		},
		name: 'Florincoin',
		public: 35,        // pubKeyHash    35
		scripthash: 94,    // scriptHash  94
    private: 163       // WIF         163
  }
}, common)

module.exports = {
  main: main
}
