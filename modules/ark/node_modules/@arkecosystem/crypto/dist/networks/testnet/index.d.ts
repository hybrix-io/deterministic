export declare const testnet: {
    exceptions: {};
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
                "votes"?: undefined;
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
                "votes"?: undefined;
            };
            "signature": string;
            "id": string;
        } | {
            "type": number;
            "amount": string;
            "fee": string;
            "recipientId": string;
            "senderPublicKey": string;
            "timestamp": number;
            "asset": {
                "votes": string[];
                "delegate"?: undefined;
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
        "htlcEnabled"?: undefined;
    } | {
        "height": number;
        "aip11": boolean;
        "htlcEnabled": boolean;
        "reward"?: undefined;
        "activeDelegates"?: undefined;
        "blocktime"?: undefined;
        "block"?: undefined;
        "epoch"?: undefined;
        "fees"?: undefined;
        "vendorFieldLength"?: undefined;
        "multiPaymentLimit"?: undefined;
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
        "multiPaymentLimit"?: undefined;
        "aip11"?: undefined;
        "htlcEnabled"?: undefined;
    } | {
        "height": number;
        "block": {
            "idFullSha256": boolean;
            "version"?: undefined;
            "maxTransactions"?: undefined;
            "maxPayload"?: undefined;
        };
        "reward"?: undefined;
        "activeDelegates"?: undefined;
        "blocktime"?: undefined;
        "epoch"?: undefined;
        "fees"?: undefined;
        "vendorFieldLength"?: undefined;
        "multiPaymentLimit"?: undefined;
        "aip11"?: undefined;
        "htlcEnabled"?: undefined;
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
