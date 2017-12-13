const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const helmet = require('helmet');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const adminRoute = require('./api-routes/admin');

/* MISCELLANEOUS */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':true}));

/* DATABASE */
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/alohomora-db', { useMongoClient: true, promiseLibrary: require('bluebird') })
    .then(() =>  console.log('Connection to alohomora-db was succesful.'))
    .catch((err) => console.error(err));


/* ROUTES */
app.use(express.static(path.join(__dirname, '../dist')));

// Admin API
app.use('/api/admin', adminRoute); 

// Middleware to catch errors
var urlAux;
app.use(function (req, res, next) {
    urlAux = req.originalUrl.split("/");
    if(urlAux[1] === 'api') {res.status(400).send('Bad request.');}
    else {next()};
    
});
  
app.get('/*', (req,res) => { res.sendFile(path.join(__dirname, '../dist/index.html')); });

/* SECURITY */
app.use(helmet());

/* HTTP SERVER */
var httpServer = http.createServer(app);
httpServer.listen(8080,() => console.log('Example https server at localhost: 8080'));



/* HTTPS SERVER */

var sslOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

var httpsServer = https.createServer(sslOptions, app);
httpsServer.listen(8443, () => console.log('Example https server at localhost: 8443'));
