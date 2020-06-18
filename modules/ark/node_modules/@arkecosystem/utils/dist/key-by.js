"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyBy = (iterable, iteratee) => iterable.reduce((result, value) => {
    result[iteratee(value)] = value;
    return result;
}, {});
//# sourceMappingURL=key-by.js.map