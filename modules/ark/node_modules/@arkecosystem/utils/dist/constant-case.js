"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const internal_1 = require("./internal");
exports.constantCase = (value) => internal_1.compoundWords(value, (result, word, index) => result + (index ? "_" : "") + word.toUpperCase());
//# sourceMappingURL=constant-case.js.map