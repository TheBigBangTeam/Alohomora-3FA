'use strict'

const crypto = require('crypto')
const config = require('config')

const encryptAES = (length, mode, secret, plaintext) => {
  let cipher
  try {
    cipher = crypto.createCipher(`aes-${length}-${mode}`, secret)
  } catch (error) {
    throw new Error('Invalid algorithm length or mode')
  }

  let encrypted = cipher.update(plaintext, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return encrypted
}

const decryptAES = (length, mode, secret, ciphertext) => {
  let decipher
  try {
    decipher = crypto.createDecipher(`aes-${length}-${mode}`, secret)
  } catch (error) {
    throw new Error('Invalid algorithm length or mode')
  }

  let decrypted = decipher.update(ciphertext, 'hex', 'utf8')

  decrypted += decipher.final('utf8')

  return decrypted
}

const hashPBKDF2 = (password) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, config.get("Settings.PBKDF2.salt"), parseInt(config.get("Settings.PBKDF2.iterations")), parseInt(config.get("Settings.PBKDF2.keylen")), config.get("Settings.PBKDF2.digest"), (err, derivedKey) => {
      if (err) return reject(err);
      return resolve(derivedKey.toString('hex'))
    })
  })
  
}

const verifyPBKDF2 = (password, hash) => {
  return new Promise((resolve,reject) => {
    crypto.pbkdf2(password, config.get("Settings.PBKDF2.salt"),parseInt(config.get("Settings.PBKDF2.iterations")), parseInt(config.get("Settings.PBKDF2.keylen")), config.get("Settings.PBKDF2.digest"), (err, derivedKey) => {
      if (err) return reject(err);
      return resolve(hash === derivedKey.toString('hex'))
    });
  })
  
}

module.exports = {
  encryptAES,
  decryptAES,
  hashPBKDF2,
  verifyPBKDF2
}
