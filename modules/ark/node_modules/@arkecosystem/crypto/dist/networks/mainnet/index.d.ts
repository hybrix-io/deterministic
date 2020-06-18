export declare const mainnet: {
    exceptions: {
        "blocks": string[];
        "transactions": string[];
        "outlookTable": {
            "5139199631254983076": string;
            "4683900276587456793": string;
            "4719273207090574361": string;
            "10008425497949974873": string;
            "3011426208694781338": string;
            "122506651077645039": string;
            "5720847785115142568": string;
            "7018402152859193732": string;
            "12530635932931954947": string;
            "7061061305098280027": string;
            "3983271186026110297": string;
            "3546732630357730082": string;
            "14024378732446299587": string;
            "5160516564770509401": string;
            "241883250703033792": string;
            "18238049267092652511": string;
            "3824223895435898486": string;
            "4888561739037785996": string;
            "1256478353465481084": string;
            "12598210368652133913": string;
            "17559226088420912749": string;
            "13894975866600060289": string;
            "11710672157782824154": string;
            "5509880884401609373": string;
            "11486353335769396593": string;
            "10147280738049458646": string;
            "5684621525438367021": string;
            "719490120693255848": string;
            "7154018532147250826": string;
            "38016207884795383": string;
            "8324387831264270399": string;
            "10123661368384267251": string;
            "2222163236406460530": string;
            "5059382813585250340": string;
            "7091362542116598855": string;
            "8225244493039935740": string;
        };
        "transactionIdFixTable": {
            "ca764c01dd78f93393b02f7f6c4f0c12ed8e7ca26d3098e91d6e461a238a6b33": string;
        };
        "wrongTransactionOrder": {
            "11773170219525190460": string[];
            "5847703302374058501": string[];
        };
        "negativeBalances": {
            "03d0102c85624e5bdfef4a82faea7badded8bc0dc5e087bd71d75bb534641404a1": {
                "8": string;
            };
        };
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
