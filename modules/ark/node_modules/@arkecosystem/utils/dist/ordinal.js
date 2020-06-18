"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const suffixes = ["th", "st", "nd", "rd"];
exports.ordinal = (value) => value + (suffixes[value % 100] || suffixes[0]);
//# sourceMappingURL=ordinal.js.map