const http = require('http')
const https = require('https')

const startServer = (app, tls, port) => {
  if (tls === 'yes') {
        /* HTTPS SERVER */
    const sslOptions = {
      key: fs.readFileSync(process.env.KEY_PATH || 'key.pem'),
      cert: fs.readFileSync(process.env.CERT_PATH || 'cert.pem')
    }

    let httpsServer = https.createServer(sslOptions, app)
    httpsServer.listen(port, () => console.log(`HTTPS server at localhost: ${port}\n`))
  } else {
        /* HTTP SERVER */
    let httpServer = http.createServer(app)
    httpServer.listen(port, () => console.log(`HTTP server at localhost: ${port}\n`))
  }
}

module.exports = {
  startServer
}
