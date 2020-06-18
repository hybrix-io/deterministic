"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_set_1 = require("./is-set");
exports.isEmptySet = (value) => is_set_1.isSet(value) && value.size <= 0;
//# sourceMappingURL=is-empty-set.js.map