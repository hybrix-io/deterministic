declare const _exports: ({
    "height": number;
    "reward": number;
    "activeDelegates": number;
    "blocktime": number;
    "block": {
        "version": number;
        "maxTransactions": number;
        "maxPayload": number;
        "acceptExpiredTransactionTimestamps": boolean;
        "idFullSha256"?: undefined;
    };
    "epoch": string;
    "fees": {
        "staticFees": {
            "transfer": number;
            "secondSignature": number;
            "delegateRegistration": number;
            "vote": number;
            "multiSignature": number;
            "ipfs": number;
            "multiPayment": number;
            "delegateResignation": number;
            "htlcLock": number;
            "htlcClaim": number;
            "htlcRefund": number;
        };
    };
    "vendorFieldLength": number;
    "multiPaymentLimit": number;
    "aip11"?: undefined;
} | {
    "height": number;
    "reward": number;
    "activeDelegates"?: undefined;
    "blocktime"?: undefined;
    "block"?: undefined;
    "epoch"?: undefined;
    "fees"?: undefined;
    "vendorFieldLength"?: undefined;
    "multiPaymentLimit"?: undefined;
    "aip11"?: undefined;
} | {
    "height": number;
    "block": {
        "maxTransactions": number;
        "maxPayload": number;
        "version"?: undefined;
        "acceptExpiredTransactionTimestamps"?: undefined;
        "idFullSha256"?: undefined;
    };
    "reward"?: undefined;
    "activeDelegates"?: undefined;
    "blocktime"?: undefined;
    "epoch"?: undefined;
    "fees"?: undefined;
    "vendorFieldLength"?: undefined;
    "multiPaymentLimit"?: undefined;
    "aip11"?: undefined;
} | {
    "height": number;
    "vendorFieldLength": number;
    "reward"?: undefined;
    "activeDelegates"?: undefined;
    "blocktime"?: undefined;
    "block"?: undefined;
    "epoch"?: undefined;
    "fees"?: undefined;
    "multiPaymentLimit"?: undefined;
    "aip11"?: undefined;
} | {
    "height": number;
    "block": {
        "idFullSha256": boolean;
        "version"?: undefined;
        "maxTransactions"?: undefined;
        "maxPayload"?: undefined;
        "acceptExpiredTransactionTimestamps"?: undefined;
    };
    "reward"?: undefined;
    "activeDelegates"?: undefined;
    "blocktime"?: undefined;
    "epoch"?: undefined;
    "fees"?: undefined;
    "vendorFieldLength"?: undefined;
    "multiPaymentLimit"?: undefined;
    "aip11"?: undefined;
} | {
    "height": number;
    "block": {
        "acceptExpiredTransactionTimestamps": boolean;
        "version"?: undefined;
        "maxTransactions"?: undefined;
        "maxPayload"?: undefined;
        "idFullSha256"?: undefined;
    };
    "reward"?: undefined;
    "activeDelegates"?: undefined;
    "blocktime"?: undefined;
    "epoch"?: undefined;
    "fees"?: undefined;
    "vendorFieldLength"?: undefined;
    "multiPaymentLimit"?: undefined;
    "aip11"?: undefined;
} | {
    "height": number;
    "aip11": boolean;
    "reward"?: undefined;
    "activeDelegates"?: undefined;
    "blocktime"?: undefined;
    "block"?: undefined;
    "epoch"?: undefined;
    "fees"?: undefined;
    "vendorFieldLength"?: undefined;
    "multiPaymentLimit"?: undefined;
})[];
export = _exports;
