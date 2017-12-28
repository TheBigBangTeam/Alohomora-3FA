"use strict";

const {settings} = require('./settings');

const setEnvironment = (env) => {
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
}

module.exports = {
    setEnvironment   
};