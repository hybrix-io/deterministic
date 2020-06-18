"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keysIn = (value) => {
    const prototype = Object.getPrototypeOf(value);
    return [...new Set(Object.getOwnPropertyNames(value).concat(prototype ? exports.keysIn(prototype) : []))];
};
//# sourceMappingURL=keys-in.js.map