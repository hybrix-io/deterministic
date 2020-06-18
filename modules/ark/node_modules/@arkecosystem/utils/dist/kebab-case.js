"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const internal_1 = require("./internal");
exports.kebabCase = (value) => internal_1.compoundWords(value, (result, word, index) => result + (index ? "-" : "") + word);
//# sourceMappingURL=kebab-case.js.map