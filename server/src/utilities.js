'use strict'

const crypto = require('crypto')

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

module.exports = {
  encryptAES,
  decryptAES
  
}
