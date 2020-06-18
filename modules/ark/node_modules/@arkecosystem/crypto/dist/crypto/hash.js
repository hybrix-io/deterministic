"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypto_1 = require("bcrypto");
class Hash {
    static signECDSA(hash, keys) {
        return bcrypto_1.secp256k1.signatureExport(bcrypto_1.secp256k1.sign(hash, Buffer.from(keys.privateKey, "hex"))).toString("hex");
    }
    static verifyECDSA(hash, signature, publicKey) {
        return bcrypto_1.secp256k1.verify(hash, bcrypto_1.secp256k1.signatureImport(signature instanceof Buffer ? signature : Buffer.from(signature, "hex")), publicKey instanceof Buffer ? publicKey : Buffer.from(publicKey, "hex"));
    }
    static signSchnorr(hash, keys) {
        return bcrypto_1.secp256k1.schnorrSign(hash, Buffer.from(keys.privateKey, "hex")).toString("hex");
    }
    static verifySchnorr(hash, signature, publicKey) {
        return bcrypto_1.secp256k1.schnorrVerify(hash, signature instanceof Buffer ? signature : Buffer.from(signature, "hex"), publicKey instanceof Buffer ? publicKey : Buffer.from(publicKey, "hex"));
    }
}
exports.Hash = Hash;
//# sourceMappingURL=hash.js.map