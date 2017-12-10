const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const helmet = require('helmet');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();

const adminRoute = require('./api-routes/admin');

/* DATABASE */
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/alohomora-db', { useMongoClient: true, promiseLibrary: require('bluebird') })
    .then(() =>  console.log('Connection to alohomora-db was succesful.'))
    .catch((err) => console.error(err));

/* ROUTES */
app.use(express.static(path.join(__dirname, 'dist'))); // Angular app
app.use('/api/admin', adminRoute); // Admin API

/* SECURITY */
app.use(helmet());

/* HTTP SERVER */
var httpServer = http.createServer(app);
httpServer.listen(8080,() => console.log('Example https server at localhost: 8080'));

var sslOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

/* HTTPS SERVER */
var httpsServer = https.createServer(sslOptions, app);
httpsServer.listen(8443, () => console.log('Example https server at localhost: 8443'));