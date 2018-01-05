const http = require('http')
const https = require('https')
const fs = require('fs')

const {app} = require('./src/app')

const env = process.env.NODE_ENV

if (env === 'production') {
      /* HTTPS PRODUCTION SERVER */

      // TODO Redirect from 80 to 443
  const sslOptions = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH)
  }

  let httpsServer = https.createServer(sslOptions, app)
  httpsServer.listen(443)
} else {
      /* HTTP DEVELOPMENT SERVER */
  let httpServer = http.createServer(app)
  httpServer.listen(3001, () => console.log(`HTTP server at localhost: 3001\n`))
}
