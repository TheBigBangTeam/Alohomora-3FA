"use strict";

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {setEnvironment} = require('./environment');
const checkRoute = require('./middleware/check-route');
const {startServer} = require('./server');

/* NODE ENVIRONMENT */
const env = process.env.NODE_ENV || 'development';
setEnvironment(env);

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
mongoose.connect(process.env.MONGODB_URI)
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

startServer(app, tls, port);

module.exports = {app};
