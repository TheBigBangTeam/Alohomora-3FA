'use strict'

const {settings} = require('./settings')

const setEnvironment = (env) => {
  switch (env) {
    case 'production':
      process.env.MONGODB_URI = settings.db
      process.env.KEY_PATH = settings.tls.keyPath
      process.env.CERT_PATH = settings.tls.certPath
      break
    case 'development':
    default: // Defaults to 'development'
      process.env.PORT = 3001
      process.env.MONGODB_URI = 'mongodb://localhost/alohomora-db-devel'
      break
  }
}

module.exports = {
  setEnvironment
}
