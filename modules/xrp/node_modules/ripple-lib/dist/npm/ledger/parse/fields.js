"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const common_1 = require("../../common");
const AccountFields = common_1.constants.AccountFields;
function parseField(info, value) {
    if (info.encoding === 'hex' && !info.length) {
        return Buffer.from(value, 'hex').toString('ascii');
    }
    if (info.shift) {
        return new bignumber_js_1.default(value).shiftedBy(-info.shift).toNumber();
    }
    return value;
}
function parseFields(data) {
    const settings = {};
    for (const fieldName in AccountFields) {
        const fieldValue = data[fieldName];
        if (fieldValue !== undefined) {
            const info = AccountFields[fieldName];
            settings[info.name] = parseField(info, fieldValue);
        }
    }
    if (data.RegularKey) {
        settings.regularKey = data.RegularKey;
    }
    if (data.signer_lists && data.signer_lists.length === 1) {
        settings.signers = {};
        if (data.signer_lists[0].SignerQuorum) {
            settings.signers.threshold = data.signer_lists[0].SignerQuorum;
        }
        if (data.signer_lists[0].SignerEntries) {
            settings.signers.weights = _.map(data.signer_lists[0].SignerEntries, (entry) => {
                return {
                    address: entry.SignerEntry.Account,
                    weight: entry.SignerEntry.SignerWeight
                };
            });
        }
    }
    return settings;
}
exports.default = parseFields;
//# sourceMappingURL=fields.js.map