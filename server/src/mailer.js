'use strict'

const config = require('config')
const nodemailer = require('nodemailer')

const User = require('./models/User')

const transporter = nodemailer.createTransport({
  host: config.get('Settings.mail.host'),
  port: config.get('Settings.mail.port'),
  auth: {
      user: config.get('Settings.mail.auth.user'),
      pass: config.get('Settings.mail.auth.pass')
  }
});

const notifyMail = async (subject, text) => {
  
  const users = await User.find({})
  let message = {
    from: 'Alohomora Notice',
    to: users.map( user => user.isAdmin || user.hasSecurityPermission),
    subject: subject,
    text: text
  };

  return transporter.sendMail(message)
}

module.exports = { notifyMail }
