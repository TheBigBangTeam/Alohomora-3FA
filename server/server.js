"use strict";

const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const helmet = require('helmet');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {settings} = require('./settings');

/* ENVIRONMENT */
const env = process.env.NODE_ENV || 'development';

switch(env){
    case 'development':
        process.env.PORT = 8080;
        process.env.MONGODB_URI = 'mongodb://localhost/alohomora-db-devel';
        break;
    case 'test':
        process.env.PORT = 8080;
        process.env.MONGODB_URI = 'mongodb://localhost/alohomora-db-test';
        break;
    case 'production':
        process.env.PORT = settings.port;
        process.env.MONGODB_URI = settings.db;
        process.env.TLS = settings.tls.set;
        process.env.KEY_PATH = settings.tls.keyPath;
        process.env.CERT_PATH = settings.tls.certPath;
        break;
    default:
        return console.log('FATAL EXCEPTION: Invalid ENV, be sure to set one of these values: development, test, production.');
}

if(env !== 'test'){
    
    console.log(`Starting ${env} server....`);
}



/* SERVER & PARAMETERS */
const app = express();
const port = process.env.PORT;
const tls = process.env.TLS || 'no';

/* SECURITY */
app.use(helmet());

/* MISCELLANEOUS */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':true}));

/* DATABASE */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true })
    .then(() =>  {
        if(env !== 'test'){
            console.log('Connection to alohomora-db was succesful.');
        } 
    })
    .catch((err) => console.error(err));



/* ROUTES */

// Static files
app.use(express.static(path.join(__dirname, '../dist')));

// Routers
const adminRoute = require('./api-routes/admin');
const userRoute = require('./api-routes/user');

// Admin API
app.use('/api/admin', adminRoute); 

// User API
app.use('/api/user', userRoute);

// Middleware to catch errors
let urlAux;
app.use(function (req, res, next) {
    urlAux = req.originalUrl.split("/"); // Splits originating url route and saves first level.
    if(urlAux[1] === 'api') {res.sendStatus(400);} // Checks if the first level is /api
    else {next()}; // otherwise it must be a angular route and it should be handled by frontend
    
});
  
app.get('/*', (req,res) => { res.sendFile(path.join(__dirname, '../dist/index.html')); });



// STARTUP SERVER

if(tls === 'yes'){
    /* HTTPS SERVER */
    const sslOptions = {
        key: fs.readFileSync(process.env.KEY_PATH || 'key.pem'),
        cert: fs.readFileSync(process.env.CERT_PATH || 'cert.pem')
    };

    let httpsServer = https.createServer(sslOptions, app);
    httpsServer.listen(port, () => console.log(`HTTPS server at localhost: ${port}`));

} else {

    /* HTTP SERVER */
    let httpServer = http.createServer(app);
    httpServer.listen(port,() => {
        if(env !== 'test'){
            console.log(`HTTP server at localhost: ${port}`);

        }
    });

}

module.exports = {app};
