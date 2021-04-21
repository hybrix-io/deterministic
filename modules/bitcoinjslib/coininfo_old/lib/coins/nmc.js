var common = {
  name: 'Namecoin',
  unit: 'NMC'
}

var main = Object.assign({}, {
  hashGenesisBlock: '000000000062b72c5e2ceb45fbc8587e807c155b0da735e6483dfba2f0a9c770',
  versions: {
    bip32: {
      public: 0xd7dd6370,
      private: 0xd7dc6e31
    },
		name: 'Namecoin',
    bip44: 7,
    public: 52,     // 0x34,
    scripthash: 5,  // 0x05,
    private: 180    // 0xb4
  }
}, common)

module.exports = {
  main: main
}
