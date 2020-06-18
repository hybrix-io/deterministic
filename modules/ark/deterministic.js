// (C) 2015 Internet of Coins / hybrix / Joachim de Koning / Rouke Pouw
// hybrixd module - ark/deterministic.js
// Deterministic encryption wrapper for Ark
//
// [!] Browserify this and save to deterministic.js.lzma to enable sending it from hybrixd to the browser!
//

function setNetwork(data){
  switch(data.mode){
    case 'main':
      ark.Managers.configManager.setFromPreset("mainnet");
      ark.Managers.configManager.setHeight(11273000);
      break;
    case 'dev':
      ark.Managers.configManager.setFromPreset("devnet");
      ark.Managers.configManager.setHeight(4006000);
      break;
  }
}

const ark = require('@arkecosystem/crypto');

const wrapper = {
  // create deterministic public and private keys based on a seed
  keys: data =>  {
    setNetwork(data);
    return ark.Identities.Keys.fromPassphrase(data.seed);
  },

  importPrivate: privateKey => ark.Identities.Keys.fromPrivateKey(privateKey),
  // TODO sumKeys

  // generate a unique wallet address from a given public key
  address: data => ark.Identities.Address.fromPublicKey(data.publicKey),

  // return public key
  publickey: data =>  data.publicKey,

  // return private key
  privatekey: data =>  data.privateKey,

  transaction: data => {
    setNetwork(data);
    // Transaction Builder fails in browserify, kept here for reference
    /* const transaction = ark.Transactions.BuilderFactory.transfer()
       .version(2)
       .nonce(data.unspent.nonce)
       .recipientId(data.target)
       .amount(data.amount)
       .fee(data.fee)
       .sign(data.seed);
       if(data.message)  transaction   =transaction.vendorField(data.message)
       const signedTransaction = transaction.build().toJson()

       Results in:

       {"version":2,"network":23,"type":0,"nonce":"0","senderPublicKey":"02cae20b969b2032e636e38b791ca54d6abb2861bd854b6bea1230f26ddbbb7bda","fee":"10000000","amount":"1000","expiration":0,"recipientId":"AYmL9b9KC98QgfcbmkmEjENnZoNfAJbGqX","signature":"80d3da51fde00bc162b3bc082eaf8715e750bf64ac63c5f87d11ec9de64562d0654d37ebd7347d46e191c7ace2a1dcfb749c4c2951c8793d2b32e8f06c9f9768","id":"20ed65037bf82f72801dc39893657b37a3b1b8505f7ac4341c5ff98c701ecf8c"}

    */

    const transaction = {
      version:2,
      network:23, //note this is 23 for both main and dev
      expiration:0,
      nonce: String(Number(data.unspent.nonce)+1), // increment the nonce
      type: 0,
      amount: data.amount,
      fee: data.fee,
      recipientId: data.target,
      timestamp: data.time,
      asset: {},
      senderPublicKey: data.keys.publicKey
    };
    if(data.message)  transaction = transaction.vendorField= data.message;

    transaction.signature = ark.Transactions.Signer.sign(transaction, data.keys);
    transaction.id = ark.Transactions.Utils.getId(transaction);

    return JSON.stringify( transaction);
  }
};

// export the functionality to a pre-prepared var
window.deterministic = wrapper;
