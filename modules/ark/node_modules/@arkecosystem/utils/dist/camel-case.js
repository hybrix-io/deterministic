"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const internal_1 = require("./internal");
const upper_first_1 = require("./upper-first");
exports.camelCase = (value) => internal_1.compoundWords(value, (result, word, index) => result + (index ? upper_first_1.upperFirst(word) : word));
//# sourceMappingURL=camel-case.js.map