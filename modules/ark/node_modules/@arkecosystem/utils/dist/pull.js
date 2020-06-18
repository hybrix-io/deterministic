"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filter_1 = require("./filter");
exports.pull = (iterable, ...args) => filter_1.filter(iterable, item => !args.includes(item));
//# sourceMappingURL=pull.js.map