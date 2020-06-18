"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const internal_1 = require("./internal");
exports.upperCase = (value) => internal_1.compoundWords(value, (result, word, index) => result + (index ? " " : "") + word.toUpperCase());
//# sourceMappingURL=upper-case.js.map