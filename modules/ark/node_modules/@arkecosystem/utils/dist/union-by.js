"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flatten_1 = require("./flatten");
const uniq_by_1 = require("./uniq-by");
exports.unionBy = (...args) => {
    const iteratee = args.pop();
    return uniq_by_1.uniqBy(flatten_1.flatten(args), iteratee);
};
//# sourceMappingURL=union-by.js.map