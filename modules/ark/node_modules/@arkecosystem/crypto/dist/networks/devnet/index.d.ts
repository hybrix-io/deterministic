export declare const devnet: {
    exceptions: {
        "blocks": string[];
        "transactions": string[];
    };
    genesisBlock: {
        "version": number;
        "totalAmount": string;
        "totalFee": string;
        "reward": string;
        "payloadHash": string;
        "timestamp": number;
        "numberOfTransactions": number;
        "payloadLength": number;
        "previousBlock": any;
        "generatorPublicKey": string;
        "transactions": ({
            "type": number;
            "amount": string;
            "fee": string;
            "recipientId": string;
            "timestamp": number;
            "asset": {
                "delegate"?: undefined;
            };
            "senderPublicKey": string;
            "signature": string;
            "id": string;
        } | {
            "type": number;
            "amount": string;
            "fee": string;
            "recipientId": any;
            "senderPublicKey": string;
            "timestamp": number;
            "asset": {
                "delegate": {
                    "username": string;
                    "publicKey": string;
                };
            };
            "signature": string;
            "id": string;
        })[];
        "height": number;
        "id": string;
        "blockSignature": string;
    };
    milestones: ({
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
        "ignoreInvalidSecondSignatureField": boolean;
        "ignoreExpiredTransactions": boolean;
        "vendorFieldLength": number;
        "multiPaymentLimit": number;
        "p2p"?: undefined;
        "aip11"?: undefined;
        "htlcEnabled"?: undefined;
    } | {
        "height": number;
        "reward": number;
        "activeDelegates"?: undefined;
        "blocktime"?: undefined;
        "block"?: undefined;
        "epoch"?: undefined;
        "fees"?: undefined;
        "ignoreInvalidSecondSignatureField"?: undefined;
        "ignoreExpiredTransactions"?: undefined;
        "vendorFieldLength"?: undefined;
        "multiPaymentLimit"?: undefined;
        "p2p"?: undefined;
        "aip11"?: undefined;
        "htlcEnabled"?: undefined;
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
        "ignoreInvalidSecondSignatureField"?: undefined;
        "ignoreExpiredTransactions"?: undefined;
        "vendorFieldLength"?: undefined;
        "multiPaymentLimit"?: undefined;
        "p2p"?: undefined;
        "aip11"?: undefined;
        "htlcEnabled"?: undefined;
    } | {
        "height": number;
        "ignoreInvalidSecondSignatureField": boolean;
        "reward"?: undefined;
        "activeDelegates"?: undefined;
        "blocktime"?: undefined;
        "block"?: undefined;
        "epoch"?: undefined;
        "fees"?: undefined;
        "ignoreExpiredTransactions"?: undefined;
        "vendorFieldLength"?: undefined;
        "multiPaymentLimit"?: undefined;
        "p2p"?: undefined;
        "aip11"?: undefined;
        "htlcEnabled"?: undefined;
    } | {
        "height": number;
        "vendorFieldLength": number;
        "reward"?: undefined;
        "activeDelegates"?: undefined;
        "blocktime"?: undefined;
        "block"?: undefined;
        "epoch"?: undefined;
        "fees"?: undefined;
        "ignoreInvalidSecondSignatureField"?: undefined;
        "ignoreExpiredTransactions"?: undefined;
        "multiPaymentLimit"?: undefined;
        "p2p"?: undefined;
        "aip11"?: undefined;
        "htlcEnabled"?: undefined;
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
        "ignoreInvalidSecondSignatureField"?: undefined;
        "ignoreExpiredTransactions"?: undefined;
        "vendorFieldLength"?: undefined;
        "multiPaymentLimit"?: undefined;
        "p2p"?: undefined;
        "aip11"?: undefined;
        "htlcEnabled"?: undefined;
    } | {
        "height": number;
        "ignoreExpiredTransactions": boolean;
        "reward"?: undefined;
        "activeDelegates"?: undefined;
        "blocktime"?: undefined;
        "block"?: undefined;
        "epoch"?: undefined;
        "fees"?: undefined;
        "ignoreInvalidSecondSignatureField"?: undefined;
        "vendorFieldLength"?: undefined;
        "multiPaymentLimit"?: undefined;
        "p2p"?: undefined;
        "aip11"?: undefined;
        "htlcEnabled"?: undefined;
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
        "ignoreInvalidSecondSignatureField"?: undefined;
        "ignoreExpiredTransactions"?: undefined;
        "vendorFieldLength"?: undefined;
        "multiPaymentLimit"?: undefined;
        "p2p"?: undefined;
        "aip11"?: undefined;
        "htlcEnabled"?: undefined;
    } | {
        "height": number;
        "p2p": {
            "minimumVersions": string[];
        };
        "reward"?: undefined;
        "activeDelegates"?: undefined;
        "blocktime"?: undefined;
        "block"?: undefined;
        "epoch"?: undefined;
        "fees"?: undefined;
        "ignoreInvalidSecondSignatureField"?: undefined;
        "ignoreExpiredTransactions"?: undefined;
        "vendorFieldLength"?: undefined;
        "multiPaymentLimit"?: undefined;
        "aip11"?: undefined;
        "htlcEnabled"?: undefined;
    } | {
        "height": number;
        "aip11": boolean;
        "htlcEnabled": boolean;
        "p2p": {
            "minimumVersions": string[];
        };
        "reward"?: undefined;
        "activeDelegates"?: undefined;
        "blocktime"?: undefined;
        "block"?: undefined;
        "epoch"?: undefined;
        "fees"?: undefined;
        "ignoreInvalidSecondSignatureField"?: undefined;
        "ignoreExpiredTransactions"?: undefined;
        "vendorFieldLength"?: undefined;
        "multiPaymentLimit"?: undefined;
    })[];
    network: {
        "name": string;
        "messagePrefix": string;
        "bip32": {
            "public": number;
            "private": number;
        };
        "pubKeyHash": number;
        "nethash": string;
        "wif": number;
        "slip44": number;
        "aip20": number;
        "client": {
            "token": string;
            "symbol": string;
            "explorer": string;
        };
    };
};
