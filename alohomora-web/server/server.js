const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const helmet = require('helmet');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

/* SERVER PARAMETERS */
const port = process.env.PORT || 8080;
const tls = process.env.TLS || false;

const adminRoute = require('./api-routes/admin');

/* MISCELLANEOUS */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':true}));

/* DATABASE */
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/alohomora-db', { useMongoClient: true, promiseLibrary: require('bluebird') })
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


// STARTUP SERVER

if(tls){
    /* HTTPS SERVER */
    var sslOptions = {
        key: fs.readFileSync(process.env.KEY_PATH || 'key.pem'),
        cert: fs.readFileSync(process.env.CERT_PATH || 'cert.pem')
    };

    var httpsServer = https.createServer(sslOptions, app);
    httpsServer.listen(port, () => console.log(`HTTPS server at localhost: ${port}`));

} else {

    /* HTTP SERVER */
    var httpServer = http.createServer(app);
    httpServer.listen(port,() => console.log(`HTTP server at localhost: ${port}`));

}

