# node-bitcoin-txdecoder

## support script

* pay to pubkey
* pay to pubkeyhash(P2PKH)
* pay to scripthash(P2SH)
* pay to witness scripthash(P2WSH)

### WIP

* segwit

## install

```
npm i bitcoin-txdecoder
```

## usage

simple usage: hex to json

```
const TxDecoder = require('bitcoin-txdecoder');
const rawtx = "0100000002bf4dc9f952d440947ae0ca48080ab634f98543586394c1cab6e4ff8845881bb3000000006b48304502210080289bb59861043f80261dc6722f4f17482f3864bc29aa71f19680f9e2fa0210022054553f135420db950c5a8d8182cb37d6f853ec23c25d6285c6248b2588e5d7a001210396bf7c2b1ffacf871fcdcb2ed52864b677d094d1aa98cf422a0d096d178add3effffffff4839ea8f8dc6fdc25d8f5fb5b171b762aa2a3aa0d3157fc8cc853443cae9e6d7000000006b483045022100a84530e8480169ab54c0dcbcceb2044faf52d8f3417a75feaaecad20eafcd3e602201aeb08bf44c3e01af15ca67b786efa63a13f7c8e8ad21f40909b3d36f23d6e33012102be9b1c757ce7d2a65edb25828a9242aad4b3cce74c1aa53fcc0e24db22140e43ffffffff0260ae0a00000000001976a9149f48a63a5103e77fc8eb39852bd651fd8a08bd1388ac40420f00000000001976a91488e8119ac2556cb9e7148726e8109872f7b409f188ac36331200";
const network = {'pubKeyHash': 0x00, 'scriptHash': 0x05}
const txd = new TxDecoder(rawtx, network)
console.log(JSON.stringify(txd.toObject(), null, 2))
```

console

```
{
  "format": {
    "txid": "7f2e336c42b829936336165453eed8d4d98c2f602bc08c7d1abeace8f46cbd05",
    "version": 1,
    "locktime": 1192758
  },
  "inputs": [
    {
      "txid": "b31b884588ffe4b6cac19463584385f934b60a0848cae07a9440d452f9c94dbf",
      "n": 0,
      "script": "304502210080289bb59861043f80261dc6722f4f17482f3864bc29aa71f19680f9e2fa0210022054553f135420db950c5a8d8182cb37d6f853ec23c25d6285c6248b2588e5d7a001 0396bf7c2b1ffacf871fcdcb2ed52864b677d094d1aa98cf422a0d096d178add3e",
      "sequence": 4294967295
    },
    {
      "txid": "d7e6e9ca433485ccc87f15d3a03a2aaa62b771b1b55f8f5dc2fdc68d8fea3948",
      "n": 0,
      "script": "3045022100a84530e8480169ab54c0dcbcceb2044faf52d8f3417a75feaaecad20eafcd3e602201aeb08bf44c3e01af15ca67b786efa63a13f7c8e8ad21f40909b3d36f23d6e3301 02be9b1c757ce7d2a65edb25828a9242aad4b3cce74c1aa53fcc0e24db22140e43",
      "sequence": 4294967295
    }
  ],
  "outputs": [
    {
      "satoshi": 700000,
      "value": "0.00700000",
      "n": 0,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 9f48a63a5103e77fc8eb39852bd651fd8a08bd13 OP_EQUALVERIFY OP_CHECKSIG",
        "hex": "76a9149f48a63a5103e77fc8eb39852bd651fd8a08bd1388ac",
        "type": "pubkeyhash",
        "addresses": [
          "1FXDUGMmP54zKNwGCaCn6U6a4EZ17VNRn3"
        ]
      }
    },
    {
      "satoshi": 1000000,
      "value": "0.01000000",
      "n": 1,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 88e8119ac2556cb9e7148726e8109872f7b409f1 OP_EQUALVERIFY OP_CHECKSIG",
        "hex": "76a91488e8119ac2556cb9e7148726e8109872f7b409f188ac",
        "type": "pubkeyhash",
        "addresses": [
          "1DUtuWZHJPPfrgWHkMbUhY9wwpxhDtoFXY"
        ]
      }
    }
  ]
}
```

