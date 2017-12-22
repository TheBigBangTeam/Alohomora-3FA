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
var env = process.env.NODE_ENV || 'development';

if(env === 'development'){
    process.env.PORT = 8080;
    process.env.MONGODB_URI = 'mongodb://localhost/alohomora-db-devel';
} else if (env === 'test'){
    process.env.PORT = 8080;
    process.env.MONGODB_URI = 'mongodb://localhost/alohomora-db-test';
} else if(env === 'production'){
    process.env.PORT = settings.port;
    process.env.MONGODB_URI = settings.db;
    process.env.TLS = settings.tls.set;
    process.env.KEY_PATH = settings.tls.keyPath;
    process.env.CERT_PATH = settings.tls.certPath; 
} else {
    return console.log('FATAL EXCEPTION: Invalid ENV, be sure to set one of these values: development, test, production.');
}

if(env !== 'test'){
    
    console.log(`Starting ${env} server....`);
}



/* SERVER & PARAMETERS */
const app = express();
const port = process.env.PORT || 8080;
const tls = process.env.TLS || 'no';

/* MISCELLANEOUS */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':true}));

/* DATABASE */
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/alohomora-db', { useMongoClient: true, promiseLibrary: require('bluebird') })
    .then(() =>  {
        if(env !== 'test'){
            console.log('Connection to alohomora-db was succesful.');
        } 
    })
    .catch((err) => console.error(err));


/* ROUTES */
app.use(express.static(path.join(__dirname, '../dist')));

const adminRoute = require('./api-routes/admin');

// Admin API
app.use('/api/admin', adminRoute); 

// Middleware to catch errors
var urlAux;
app.use(function (req, res, next) {
    urlAux = req.originalUrl.split("/"); // Splits originating url route and saves first level.
    if(urlAux[1] === 'api') {res.status(400).send('Bad request.');} // Checks if the first level is /api
    else {next()};
    
});
  
app.get('/*', (req,res) => { res.sendFile(path.join(__dirname, '../dist/index.html')); });

/* SECURITY */
app.use(helmet());


// STARTUP SERVER

if(tls === 'yes'){
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
    httpServer.listen(port,() => {
        if(env !== 'test'){
            console.log(`HTTP server at localhost: ${port}`);

        }
    });

}

module.exports = {app};
