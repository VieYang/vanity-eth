/* eslint-env worker */
const crypto = require('crypto');
const keccak = require('keccak');
const randomBytes = require('randombytes');
// const base58check = require('base58check');

const step = 500;
const curve = 'prime256v1'; /* OpenSSL curve name */

/**
 * Create a wallet from a random private key
 * @returns {{address: string, privKey: string}}
 */
const getRandomWallet = () => {
    const ecdh = crypto.createECDH(curve);
    ecdh.generateKeys();
    var key = ecdh.getPrivateKey();
    var pub = ecdh.getPublicKey();
    return {
        address: keccak('keccak256').update(pub.slice(1)).digest().slice(-20).toString('hex'),
        privKey: key.toString('hex')
    };
};

/**
 * Check if a wallet respects the input constraints
 * @param address
 * @param input
 * @param isChecksum
 * @param isSuffix
 * @returns {boolean}
 */
const isValidVanityAddress = (address, input, isChecksum, isSuffix) => {
    const subStr = isSuffix ? address.substr(40 - input.length) : address.substr(0, input.length);

    if (!isChecksum) {
        return input === subStr;
    }
    if (input.toLowerCase() !== subStr) {
        return false;
    }

    return isValidChecksum(address, input, isSuffix);
};

const isValidChecksum = (address, input, isSuffix) => {
    const hash = keccak('keccak256').update(address).digest().toString('hex');
    const shift = isSuffix ? 40 - input.length : 0;

    for (let i = 0; i < input.length; i++) {
        const j = i + shift;
        if (input[i] !== (parseInt(hash[j], 16) >= 8 ? address[j].toUpperCase() : address[j])) {
            return false;
        }
    }
    return true;
};


/**
 * Check if a wallet respects the input constraints
 * @param address
 * @param input
 * @param isChecksum
 * @param isSuffix
 * @returns {boolean}
 */
const isValidVanityNewAddress = (address, input, isChecksum, isSuffix) => {
    const subStr = isSuffix ? address.substr(33 - input.length) : address.substr(0, input.length);

    if (isChecksum) {
        return input === subStr;
    }
    return input.toLowerCase() === subStr.toLowerCase();
};

const encode = (data) => {
  let ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  let BASE = ALPHABET.length
  let LEADER = ALPHABET.charAt(0)
  let FACTOR = Math.log(BASE) / Math.log(256) // log(BASE) / log(256), rounded up
  let iFACTOR = Math.log(256) / Math.log(BASE) // log(256) / log(BASE), rounded up

  let prefix = '00'
  let encoding = 'hex'

    if (typeof data === 'string') {
      data = new Buffer(data, encoding)
    }
    if (!(data instanceof Buffer)) {
      throw new TypeError('"data" argument must be an Array of Buffers')
    }
    if (!(prefix instanceof Buffer)) {
      prefix = new Buffer(prefix, encoding)
    }
    let hash = Buffer.concat([prefix, data])
    hash = crypto.createHash('sha256').update(hash).digest()
    hash = crypto.createHash('sha256').update(hash).digest()
    hash = Buffer.concat([prefix, data,  hash.slice(0, 4)])

    let source = hash

   if (!Buffer.isBuffer(source)) throw new TypeError('Expected Buffer')
   if (source.length === 0) return ''

   // Skip & count leading zeroes.
   let zeroes = 0
   let length = 0
   let pbegin = 0
   const pend = source.length

   while (pbegin !== pend && source[pbegin] === 0) {
     pbegin++
     zeroes++
   }

   // Allocate enough space in big-endian base58 representation.
   const size = ((pend - pbegin) * iFACTOR + 1) >>> 0
   const b58 = new Uint8Array(size)

   // Process the bytes.
   while (pbegin !== pend) {
     let carry = source[pbegin]

     // Apply "b58 = b58 * 256 + ch".
     let i = 0
     for (let it = size - 1; (carry !== 0 || i < length) && (it !== -1); it--, i++) {
       carry += (256 * b58[it]) >>> 0
       b58[it] = (carry % BASE) >>> 0
       carry = (carry / BASE) >>> 0
     }

     if (carry !== 0) throw new Error('Non-zero carry')
     length = i
     pbegin++
   }

   // Skip leading zeroes in base58 result.
   let it = size - length
   while (it !== size && b58[it] === 0) {
     it++
   }

   // Translate the result into a string.
   let str = LEADER.repeat(zeroes)
   for (; it < size; ++it) str += ALPHABET.charAt(b58[it])

   return str
};

const toNewAddress = (address) => {
    const bytes = Buffer.from('41f8' + address, 'hex');
    const newAddress = encode(bytes); // base58check.encode(bytes);

    return newAddress;
};

const toChecksumAddress = (address) => {
    const hash = keccak('keccak256').update(address).digest().toString('hex');
    let ret = '';
    for (let i = 0; i < address.length; i++) {
        ret += parseInt(hash[i], 16) >= 8 ? address[i].toUpperCase() : address[i];
    }
    return ret;
};

/**
 * Generate a lot of wallets until one satisfies the input constraints
 * @param input - String chosen by the user
 * @param isChecksum - Is the input case-sensitive
 * @param isSuffix - Is it a suffix, or a prefix
 * @param cb - Callback called after x attempts, or when an address if found
 * @returns
 */
const getVanityWallet = (input, isChecksum, isCheckNew, isSuffix, cb) => {
    input = isChecksum ? input : input.toLowerCase();
    let wallet = getRandomWallet();
    let attempts = 1;

    while (true) {
      if (isCheckNew) {
        let address = toNewAddress(wallet.address);
        if (isValidVanityNewAddress(address.substr(4), input, isChecksum, isSuffix)) {
          cb({address: 'NEW' + address, privKey: wallet.privKey, attempts});
          break;
        }
      } else {
        if (isValidVanityAddress(wallet.address, input, isChecksum, isSuffix)) {
          cb({address: '0x' + toChecksumAddress(wallet.address), privKey: wallet.privKey, attempts});
          break;
        }
      }
      if (attempts >= step) {
          cb({attempts});
          attempts = 0;
      }
      wallet = getRandomWallet();
      attempts++;
    }
};

onmessage = function (event) {
    const input = event.data;
    try {
        getVanityWallet(input.hex, input.checksum, input.checknew, input.suffix, (message) => postMessage(message));
    } catch (err) {
        self.postMessage({error: err.toString()});
    }
};

module.exports = {
    onmessage
};
