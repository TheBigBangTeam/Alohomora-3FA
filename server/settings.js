"use strict";

const os = require('os');
const math = require('mathjs');

const getMaxMemoryCost = () => math.floor(math.log(os.totalmem() / 1024, 2)); // e.g with 8GB -> 22, with 4GB -> 21 etc...
const safeMemoryCost = getMaxMemoryCost() - 5;
const nThreads = os.cpus().length;

const settings = {
    port: 8080,
    db: 'mongodb://localhost/alohomora-db',
    tls: {
        set: 'no',
        keyPath: './key.pem',
        certPath:'./cert.pem'
    },
    argon2: { // WARNING CHANGE THIS ONLY IF YOU KNOW WHAT YOU ARE DOING OR YOU ARE GETTING PERFORMANCE ISSUES.
        // Defaults suggested by argon2 Draft RFC https://tools.ietf.org/html/draft-irtf-cfrg-argon2-03 with custom memory tweak
        timeCost: 1,    // Increase adds security but more time to the computation
        memoryCost: safeMemoryCost > 10 ? safeMemoryCost : 11 , // Be careful as this is already a high default value. Anything > 10 should suffice.
        parallelism: nThreads, // Max number of parallelism 
        type: 2 // 2 is argon2id, the recommended from the Draft RFC
    },
    jwtSecret: 'This-Should-Be-Secret' // YOU SHOULD DEFINITELY CHANGE THIS.
};


module.exports = {settings};