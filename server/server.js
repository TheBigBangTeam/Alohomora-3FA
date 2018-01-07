const http = require('http')
const https = require('https')
const fs = require('fs')
const config = require('config')

const {app} = require('./src/app')

if (process.env.NODE_ENV === 'production') {
      /* HTTPS PRODUCTION SERVER */

      // TODO Redirect from 80 to 443
  const sslOptions = {
    key: fs.readFileSync(config.get('Settings.TLS.keyPath')),
    cert: fs.readFileSync(config.get('Settings.TLS.certPath'))
  }

  let httpsServer = https.createServer(sslOptions, app)
  httpsServer.listen(443)
} else {
      /* HTTP DEVELOPMENT SERVER */
  let httpServer = http.createServer(app)
  httpServer.listen(3001, () => console.log(`HTTP server at localhost: 3001\n`))
}
