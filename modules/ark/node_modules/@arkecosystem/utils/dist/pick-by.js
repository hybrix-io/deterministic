"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filter_1 = require("./filter");
exports.pickBy = (iterable, iteratee) => filter_1.filter(iterable, value => iteratee(value));
//# sourceMappingURL=pick-by.js.map