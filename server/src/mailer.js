'use strict'

const config = require('config')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: config.get('Settings.mail.host'),
  port: config.get('Settings.mail.port'),
  auth: {
      user: config.get('Settings.mail.auth.user'),
      pass: config.get('Settings.mail.auth.pass')
  }
});

const mail = (receiver, subject, text) => {
  // Message object
  let message = {
    from: 'Alohomora Notice',
    to: receiver,
    subject: subject,
    text: text
  };

  return transporter.sendMail(message)
}

module.exports = { mail }
