"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const internal_1 = require("./internal");
exports.snakeCase = (value) => internal_1.compoundWords(value, (result, word, index) => result + (index ? "_" : "") + word);
//# sourceMappingURL=snake-case.js.map