'use strict'

const crypto = require('crypto')
const nodemailer = require('nodemailer')

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

let mailConfig
let transporter
if (process.env.NODE_ENV === 'production' ){
    // all emails are delivered to destination
    mailConfig = {
        host: '',
        port: 587,
        auth: {
            user: '',
            user: ''
        }
    };
    transporter = nodemailer.createTransport(mailConfig);
} else {
    // all emails are catched by ethereal.email
    nodemailer.createTestAccount((err, account) => {
      mailConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass  // generated ethereal password
        }
      }
      transporter = nodemailer.createTransport(mailConfig);
      console.log(transporter)
    });
    
}




module.exports = {
  encryptAES,
  decryptAES,
  transporter
}
