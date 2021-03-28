/***
 * @license
 * https://github.com/bitcoincashjs/bchaddr
 * Copyright (c) 2018 Emilio Almansi
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or http://www.opensource.org/licenses/mit-license.php.
 */

var bs58check = require('bs58check')
var cashaddr = require('cashaddrjs-slp')

/**
 * General purpose Bitcoin Cash address detection and translation.<br />
 * Supports all major Bitcoin Cash address formats.<br />
 * Currently:
 * <ul>
 *    <li> Legacy format </li>
 *    <li> Bitpay format </li>
 *    <li> Cashaddr format </li>
 * </ul>
 * @module bchaddr
 */

/**
 * @static
 * Supported Bitcoin Cash address formats.
 */
var Format = {}
Format.Legacy = 'legacy'
Format.Bitpay = 'bitpay'
Format.Cashaddr = 'cashaddr'
Format.Slpaddr = 'slpaddr'

/**
 * @static
 * Supported networks.
 */
var Network = {}
Network.Mainnet = 'mainnet'
Network.Testnet = 'testnet'

/**
 * @static
 * Supported address types.
 */
var Type = {}
Type.P2PKH = 'p2pkh'
Type.P2SH = 'p2sh'

/**
 * Returns a boolean indicating whether the given input is a valid Bitcoin Cash address.
 * @static
 * @param {*} input - Any input to check for validity.
 * @returns {boolean}
 */
function isValidAddress (input) {
  try {
    decodeAddress(input)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Detects what is the given address' format.
 * @static
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @return {string}
 * @throws {InvalidAddressError}
 */
function detectAddressFormat (address) {
  return decodeAddress(address).format
}

/**
 * Detects what is the given address' network.
 * @static
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @return {string}
 * @throws {InvalidAddressError}
 */
function detectAddressNetwork (address) {
  return decodeAddress(address).network
}

/**
 * Detects what is the given address' type.
 * @static
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @return {string}
 * @throws {InvalidAddressError}
 */
function detectAddressType (address) {
  return decodeAddress(address).type
}

/**
 * Translates the given address into legacy format.
 * @static
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @return {string}
 * @throws {InvalidAddressError}
 */
function toLegacyAddress (address) {
  var decoded = decodeAddress(address)
  if (decoded.format === Format.Legacy) {
    return address
  }
  return encodeAsLegacy(decoded)
}

/**
 * Translates the given address into bitpay format.
 * @static
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @return {string}
 * @throws {InvalidAddressError}
 */
function toBitpayAddress (address) {
  var decoded = decodeAddress(address)
  if (decoded.format === Format.Bitpay) {
    return address
  }
  return encodeAsBitpay(decoded)
}

/**
 * Translates the given address into cashaddr format.
 * @static
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @return {string}
 * @throws {InvalidAddressError}
 */
function toCashAddress (address) {
  var decoded = decodeAddress(address)
  return encodeAsCashaddr(decoded)
}

/**
 * Translates the given address into cashaddr format.
 * @static
 * @param {string} address - A valid address in any format.
 * @return {string}
 * @throws {InvalidAddressError}
 */
function toSlpAddress (address) {
  var decoded = decodeAddress(address)
  return encodeAsSlpaddr(decoded)
}

/**
 * Translates the given address into mainnet format.
 * @static
 * @param {string} address - A valid address in any format.
 * @return {string}
 * @throws {InvalidAddressError}
 */
function toMainnetAddress (address) {
  var decoded = decodeAddress(address)
  return encodeAsMainnetaddr(decoded)
}

/**
 * Translates the given address into testnet format.
 * @static
 * @param {string} address - A valid address in any format.
 * @return {string}
 * @throws {InvalidAddressError}
 */
function toTestnetAddress (address) {
  var decoded = decodeAddress(address)
  return encodeAsTestnetaddr(decoded)
}

/**
 * Translates the given address into regtest format.
 * @static
 * @param {string} address - A valid address in any format.
 * @return {string}
 * @throws {InvalidAddressError}
 */
function toRegtestAddress (address) {
  var decoded = decodeAddress(address)
  return encodeAsRegtestaddr(decoded)
}

/**
 * Translates the given address into regtest format.
 * @static
 * @param {string} address - A valid address in any format.
 * @return {string}
 * @throws {InvalidAddressError}
 */
function toSlpRegtestAddress (address) {
  var decoded = decodeAddress(address)
  return encodeAsSlpRegtestaddr(decoded)
}

/**
 * Version byte table for base58 formats.
 * @private
 */
var VERSION_BYTE = {}
VERSION_BYTE[Format.Legacy] = {}
VERSION_BYTE[Format.Legacy][Network.Mainnet] = {}
VERSION_BYTE[Format.Legacy][Network.Mainnet][Type.P2PKH] = 0
VERSION_BYTE[Format.Legacy][Network.Mainnet][Type.P2SH] = 5
VERSION_BYTE[Format.Legacy][Network.Testnet] = {}
VERSION_BYTE[Format.Legacy][Network.Testnet][Type.P2PKH] = 111
VERSION_BYTE[Format.Legacy][Network.Testnet][Type.P2SH] = 196
VERSION_BYTE[Format.Bitpay] = {}
VERSION_BYTE[Format.Bitpay][Network.Mainnet] = {}
VERSION_BYTE[Format.Bitpay][Network.Mainnet][Type.P2PKH] = 28
VERSION_BYTE[Format.Bitpay][Network.Mainnet][Type.P2SH] = 40
VERSION_BYTE[Format.Bitpay][Network.Testnet] = {}
VERSION_BYTE[Format.Bitpay][Network.Testnet][Type.P2PKH] = 111
VERSION_BYTE[Format.Bitpay][Network.Testnet][Type.P2SH] = 196

/**
 * Decodes the given address into its constituting hash, format, network and type.
 * @private
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @return {object}
 * @throws {InvalidAddressError}
 */
function decodeAddress (address) {
  try {
    return decodeBase58Address(address)
  } catch (error) {
  }
  try {
    return decodeCashAddress(address)
  } catch (error) {
  }
  try {
    return decodeSlpAddress(address)
  } catch (error) {
  }
  throw new InvalidAddressError()
}

/**
 * Length of a valid base58check encoding payload: 1 byte for
 * the version byte plus 20 bytes for a RIPEMD-160 hash.
 * @private
 */
var BASE_58_CHECK_PAYLOAD_LENGTH = 21

/**
 * Attempts to decode the given address assuming it is a base58 address.
 * @private
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @return {object}
 * @throws {InvalidAddressError}
 */
function decodeBase58Address (address) {
  try {
    var payload = bs58check.decode(address)
    if (payload.length !== BASE_58_CHECK_PAYLOAD_LENGTH) {
      throw new InvalidAddressError()
    }
    var versionByte = payload[0]
    var hash = Array.prototype.slice.call(payload, 1)
    switch (versionByte) {
      case VERSION_BYTE[Format.Legacy][Network.Mainnet][Type.P2PKH]:
        return {
          hash: hash,
          format: Format.Legacy,
          network: Network.Mainnet,
          type: Type.P2PKH
        }
      case VERSION_BYTE[Format.Legacy][Network.Mainnet][Type.P2SH]:
        return {
          hash: hash,
          format: Format.Legacy,
          network: Network.Mainnet,
          type: Type.P2SH
        }
      case VERSION_BYTE[Format.Legacy][Network.Testnet][Type.P2PKH]:
        return {
          hash: hash,
          format: Format.Legacy,
          network: Network.Testnet,
          type: Type.P2PKH
        }
      case VERSION_BYTE[Format.Legacy][Network.Testnet][Type.P2SH]:
        return {
          hash: hash,
          format: Format.Legacy,
          network: Network.Testnet,
          type: Type.P2SH
        }
      case VERSION_BYTE[Format.Bitpay][Network.Mainnet][Type.P2PKH]:
        return {
          hash: hash,
          format: Format.Bitpay,
          network: Network.Mainnet,
          type: Type.P2PKH
        }
      case VERSION_BYTE[Format.Bitpay][Network.Mainnet][Type.P2SH]:
        return {
          hash: hash,
          format: Format.Bitpay,
          network: Network.Mainnet,
          type: Type.P2SH
        }
    }
  } catch (error) {
  }
  throw new InvalidAddressError()
}

/**
 * Attempts to decode the given address assuming it is a cashaddr address.
 * @private
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @return {object}
 * @throws {InvalidAddressError}
 */
function decodeCashAddress (address) {
  if (address.indexOf(':') !== -1) {
    try {
      return decodeCashAddressWithPrefix(address)
    } catch (error) {
    }
  } else {
    var prefixes = ['bitcoincash', 'bchtest', 'regtest', 'bchreg']
    for (var i = 0; i < prefixes.length; ++i) {
      try {
        var prefix = prefixes[i]
        return decodeCashAddressWithPrefix(prefix + ':' + address)
      } catch (error) {
      }
    }
  }
  throw new InvalidAddressError()
}

/**
 * Attempts to decode the given address assuming it is a cashaddr address with explicit prefix.
 * @private
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @return {object}
 * @throws {InvalidAddressError}
 */
function decodeCashAddressWithPrefix (address) {
  try {
    var decoded = cashaddr.decode(address)
    var hash = Array.prototype.slice.call(decoded.hash, 0)
    var type = decoded.type === 'P2PKH' ? Type.P2PKH : Type.P2SH
    switch (decoded.prefix) {
      case 'bitcoincash':
        return {
          hash: hash,
          format: Format.Cashaddr,
          network: Network.Mainnet,
          type: type
        }
      case 'bchtest':
      case 'regtest':
      case 'bchreg':
        return {
          hash: hash,
          format: Format.Cashaddr,
          network: Network.Testnet,
          type: type
        }
    }
  } catch (error) {
  }
  throw new InvalidAddressError()
}

/**
 * Attempts to decode the given address assuming it is a slpaddr address.
 * @private
 * @param {string} address - A valid SLP address in any format.
 * @return {object}
 * @throws {InvalidAddressError}
 */
function decodeSlpAddress (address) {
  if (address.indexOf(':') !== -1) {
    try {
      return decodeSlpAddressWithPrefix(address)
    } catch (error) {
    }
  } else {
    var prefixes = ['simpleledger', 'slptest', 'slpreg']
    for (var i = 0; i < prefixes.length; ++i) {
      try {
        var prefix = prefixes[i]
        return decodeSlpAddressWithPrefix(prefix + ':' + address)
      } catch (error) {
      }
    }
  }
  throw new InvalidAddressError()
}

/**
 * Attempts to decode the given address assuming it is a slpaddr address with explicit prefix.
 * @private
 * @param {string} address - A valid SLP address in any format.
 * @return {object}
 * @throws {InvalidAddressError}
 */
function decodeSlpAddressWithPrefix (address) {
  try {
    var decoded = cashaddr.decode(address)
    var hash = Array.prototype.slice.call(decoded.hash, 0)
    var type = decoded.type === 'P2PKH' ? Type.P2PKH : Type.P2SH
    switch (decoded.prefix) {
      case 'simpleledger':
        return {
          hash: hash,
          format: Format.Slpaddr,
          network: Network.Mainnet,
          type: type
        }
      case 'slptest':
      case 'slpreg':
        return {
          hash: hash,
          format: Format.Slpaddr,
          network: Network.Testnet,
          type: type
        }
    }
  } catch (error) {
  }
  throw new InvalidAddressError()
}

/**
 * Encodes the given decoded address into legacy format.
 * @private
 * @param {object} decoded
 * @returns {string}
 */
function encodeAsLegacy (decoded) {
  var versionByte = VERSION_BYTE[Format.Legacy][decoded.network][decoded.type]
  var buffer = Buffer.alloc(1 + decoded.hash.length)
  buffer[0] = versionByte
  buffer.set(decoded.hash, 1)
  return bs58check.encode(buffer)
}

/**
 * Encodes the given decoded address into bitpay format.
 * @private
 * @param {object} decoded
 * @returns {string}
 */
function encodeAsBitpay (decoded) {
  var versionByte = VERSION_BYTE[Format.Bitpay][decoded.network][decoded.type]
  var buffer = Buffer.alloc(1 + decoded.hash.length)
  buffer[0] = versionByte
  buffer.set(decoded.hash, 1)
  return bs58check.encode(buffer)
}

/**
 * Encodes the given decoded address into cashaddr format.
 * @private
 * @param {object} decoded
 * @returns {string}
 */
function encodeAsCashaddr (decoded) {
  var prefix = decoded.network === Network.Mainnet ? 'bitcoincash' : 'bchtest'
  var type = decoded.type === Type.P2PKH ? 'P2PKH' : 'P2SH'
  var hash = Uint8Array.from(decoded.hash)
  return cashaddr.encode(prefix, type, hash)
}

/**
 * Encodes the given decoded address into slpaddr format.
 * @private
 * @param {object} decoded
 * @returns {string}
 */
function encodeAsSlpaddr (decoded) {
  var prefix = decoded.network === Network.Mainnet ? 'simpleledger' : 'slptest'
  var type = decoded.type === Type.P2PKH ? 'P2PKH' : 'P2SH'
  var hash = Uint8Array.from(decoded.hash)
  return cashaddr.encode(prefix, type, hash)
}

/**
 * Encodes the given decoded address into mainnet format.
 * @private
 * @param {object} decoded
 * @returns {string}
 */
function encodeAsMainnetaddr (decoded) {
  var prefix = 'bitcoincash'
  var type = decoded.type === Type.P2PKH ? 'P2PKH' : 'P2SH'
  var hash = Uint8Array.from(decoded.hash)
  if (decoded.format === Format.Slpaddr) {
    prefix = 'simpleledger'
  }
  return cashaddr.encode(prefix, type, hash)
}

/**
 * Encodes the given decoded address into testnet format.
 * @private
 * @param {object} decoded
 * @returns {string}
 */
function encodeAsTestnetaddr (decoded) {
  var prefix = 'bchtest'
  var type = decoded.type === Type.P2PKH ? 'P2PKH' : 'P2SH'
  var hash = Uint8Array.from(decoded.hash)
  if (decoded.format === Format.Slpaddr) {
    prefix = 'slptest'
  }
  return cashaddr.encode(prefix, type, hash)
}

/**
 * Encodes the given decoded address into regtest format.
 * @private
 * @param {object} decoded
 * @returns {string}
 */
function encodeAsRegtestaddr (decoded) {
  var prefix = 'bchreg'
  var type = decoded.type === Type.P2PKH ? 'P2PKH' : 'P2SH'
  var hash = Uint8Array.from(decoded.hash)
  if (decoded.format === Format.Slpaddr) {
    prefix = 'slpreg'
  }
  return cashaddr.encode(prefix, type, hash)
}

/**
 * Encodes the given decoded address into regtest format.
 * @private
 * @param {object} decoded
 * @returns {string}
 */
function encodeAsSlpRegtestaddr (decoded) {
  var prefix = 'slpreg'
  var type = decoded.type === Type.P2PKH ? 'P2PKH' : 'P2SH'
  var hash = Uint8Array.from(decoded.hash)
  return cashaddr.encode(prefix, type, hash)
}

/**
 * Returns a boolean indicating whether the address is in legacy format.
 * @static
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @returns {boolean}
 * @throws {InvalidAddressError}
 */
function isLegacyAddress (address) {
  return detectAddressFormat(address) === Format.Legacy
}

/**
 * Returns a boolean indicating whether the address is in bitpay format.
 * @static
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @returns {boolean}
 * @throws {InvalidAddressError}
 */
function isBitpayAddress (address) {
  return detectAddressFormat(address) === Format.Bitpay
}

/**
 * Returns a boolean indicating whether the address is in cashaddr format.
 * @static
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @returns {boolean}
 * @throws {InvalidAddressError}
 */
function isCashAddress (address) {
  return detectAddressFormat(address) === Format.Cashaddr
}

/**
 * Returns a boolean indicating whether the address is in cashaddr format.
 * @static
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @returns {boolean}
 * @throws {InvalidAddressError}
 */
function isSlpAddress (address) {
  return detectAddressFormat(address) === Format.Slpaddr
}

/**
 * Returns a boolean indicating whether the address is a mainnet address.
 * @static
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @returns {boolean}
 * @throws {InvalidAddressError}
 */
function isMainnetAddress (address) {
  return detectAddressNetwork(address) === Network.Mainnet
}

/**
 * Returns a boolean indicating whether the address is a testnet address.
 * @static
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @returns {boolean}
 * @throws {InvalidAddressError}
 */
function isTestnetAddress (address) {
  return detectAddressNetwork(address) === Network.Testnet
}

/**
 * Returns a boolean indicating whether the address is a p2pkh address.
 * @static
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @returns {boolean}
 * @throws {InvalidAddressError}
 */
function isP2PKHAddress (address) {
  return detectAddressType(address) === Type.P2PKH
}

/**
 * Returns a boolean indicating whether the address is a p2sh address.
 * @static
 * @param {string} address - A valid Bitcoin Cash address in any format.
 * @returns {boolean}
 * @throws {InvalidAddressError}
 */
function isP2SHAddress (address) {
  return detectAddressType(address) === Type.P2SH
}

/**
 * Error thrown when the address given as input is not a valid Bitcoin Cash address.
 * @constructor
 * InvalidAddressError
 */
function InvalidAddressError () {
  var error = new Error()
  this.name = error.name = 'InvalidAddressError'
  this.message = error.message = 'Received an invalid Bitcoin Cash address as input.'
  this.stack = error.stack
}

InvalidAddressError.prototype = Object.create(Error.prototype)

module.exports = {
  Format: Format,
  Network: Network,
  Type: Type,
  isValidAddress: isValidAddress,
  detectAddressFormat: detectAddressFormat,
  detectAddressNetwork: detectAddressNetwork,
  detectAddressType: detectAddressType,
  decodeAddress: decodeAddress,
  toLegacyAddress: toLegacyAddress,
  toBitpayAddress: toBitpayAddress,
  encodeAsCashaddr: encodeAsCashaddr,
  toCashAddress: toCashAddress,
  encodeAsSlpaddr: encodeAsSlpaddr,
  toSlpAddress: toSlpAddress,
  toMainnetAddress: toMainnetAddress,
  toTestnetAddress: toTestnetAddress,
  encodeAsMainnetaddr: encodeAsMainnetaddr,
  encodeAsTestnetaddr: encodeAsTestnetaddr,
  encodeAsRegtestaddr: encodeAsRegtestaddr,
  toRegtestAddress: toRegtestAddress,
  encodeAsSlpRegtestaddr: encodeAsSlpRegtestaddr,
  toSlpRegtestAddress: toSlpRegtestAddress,
  encodeAsLegacy: encodeAsLegacy,
  isLegacyAddress: isLegacyAddress,
  encodeAsBitpay: encodeAsBitpay,
  isBitpayAddress: isBitpayAddress,
  isCashAddress: isCashAddress,
  isSlpAddress: isSlpAddress,
  isMainnetAddress: isMainnetAddress,
  isTestnetAddress: isTestnetAddress,
  isP2PKHAddress: isP2PKHAddress,
  isP2SHAddress: isP2SHAddress,
  InvalidAddressError: InvalidAddressError
}
