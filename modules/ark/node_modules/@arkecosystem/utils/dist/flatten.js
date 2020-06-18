"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flat = (iterable, stash) => {
    for (const element of iterable) {
        Array.isArray(element) ? flat(element, stash) : stash.push(element);
    }
    return stash;
};
exports.flatten = (iterable) => flat(iterable, []);
//# sourceMappingURL=flatten.js.map