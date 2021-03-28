const bitcoin = require("bitcoinjs-lib")
const TxDecoder = require('..');
const rawtx = "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0804ffff001d026403ffffffff0100f2052a0100000043410400a3a070299a8727cffff2e69f317f5175cb4750696283a6105736de11ce15b6b7ed51e9aabb45a61a4c8fa5215f35c5596c100d0199cbd6087d028d7924e135ac00000000"
const txd = new TxDecoder(rawtx, bitcoin.networks['bitcoin'])
console.log(JSON.stringify(txd.toObject(), null, 2))
