export declare const version: number;
export declare const totalAmount: string;
export declare const totalFee: string;
export declare const reward: string;
export declare const payloadHash: string;
export declare const timestamp: number;
export declare const numberOfTransactions: number;
export declare const payloadLength: number;
export declare const previousBlock: any;
export declare const generatorPublicKey: string;
export declare const transactions: ({
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
export declare const height: number;
export declare const id: string;
export declare const blockSignature: string;
