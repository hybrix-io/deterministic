"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceObject = (iterable, iteratee, initialValue) => {
    const keys = Object.keys(iterable);
    let result = initialValue;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        result = iteratee(result, iterable[key], key, iterable);
    }
    return result;
};
//# sourceMappingURL=reduce-object.js.map