export type Format = string;

export type Network = string;

export type Type = string;

export interface decoded {
    hash: Uint8Array;
    format: Format;
    network: Network;
    type: Type;
}

export function InvalidAddressError(): void;

export function decodeAddress(address: string): decoded;

export function detectAddressFormat(address: string): Format;

export function detectAddressNetwork(address: string): Network;

export function detectAddressType(address: string): Type;

export function encodeAsBitpay(decoded: decoded): string;

export function encodeAsCashaddr(decoded: decoded): string;

export function encodeAsLegacy(decoded: decoded): string;

export function encodeAsMainnetaddr(decoded: decoded): string;

export function encodeAsTestnetaddr(decoded: decoded): string;

export function encodeAsRegtestaddr(decoded: decoded): string;

export function encodeAsSlpRegtestaddr(decoded: decoded): string;

export function encodeAsSlpaddr(decoded: decoded): string;

export function isBitpayAddress(address: string): boolean;

export function isCashAddress(address: string): boolean;

export function isLegacyAddress(address: string): boolean;

export function isMainnetAddress(address: string): boolean;

export function isP2PKHAddress(address: string): boolean;

export function isP2SHAddress(address: string): boolean;

export function isSlpAddress(address: string): boolean;

export function isTestnetAddress(address: string): boolean;

export function isValidAddress(input: string): boolean;

export function toBitpayAddress(address: string): string;

export function toCashAddress(address: string): string;

export function toLegacyAddress(address: string): string;

export function toMainnetAddress(address: string): string;

export function toTestnetAddress(address: string): string;

export function toRegtestAddress(address: string): string;

export function toSlpAddress(address: string): string;

export function toSlpRegtestAddress(address: string): string;

