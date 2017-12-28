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
const {setEnvironment} = require('./environment');
const checkRoute = require('./middleware/check-route');

/* NODE ENVIRONMENT */
setEnvironment();

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
.then()
.catch((err) => {
    console.error('[*ERROR*] Could not connect to MongoDB');
    process.exit(1);
});

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
app.use(checkRoute);

// Angular redirect  
app.get('/*', (req,res) => { res.sendFile(path.join(__dirname, '../dist/index.html')); });



// STARTUP SERVER

if(tls === 'yes'){
    /* HTTPS SERVER */
    const sslOptions = {
        key: fs.readFileSync(process.env.KEY_PATH || 'key.pem'),
        cert: fs.readFileSync(process.env.CERT_PATH || 'cert.pem')
    };

    let httpsServer = https.createServer(sslOptions, app);
    httpsServer.listen(port, () => console.log(`HTTPS server at localhost: ${port}\n`));

} else {

    /* HTTP SERVER */
    let httpServer = http.createServer(app);
    httpServer.listen(port, () => console.log(`HTTP server at localhost: ${port}\n`));

}

module.exports = {app};
