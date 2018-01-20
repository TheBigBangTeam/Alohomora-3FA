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

mail = (sender, receiver, subject, text) => {
  // Message object
  let message = {
    from: sender,
    to: receiver,
    subject: subject,
    text: text
  };

  transporter.sendMail(message, (err, info) => {
      if (err) {
          console.log('Error occurred. ' + err.message);
          return process.exit(1);
      }

      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
}

module.exports = { mail }
