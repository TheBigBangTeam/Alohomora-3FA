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
    // list of permissions in addition to admin
    permissionEnum: ['technician', 'hr', 'security', 'worker'],
    argon2: { // WARNING: CHANGE THIS ONLY IF YOU KNOW WHAT YOU ARE DOING OR YOU ARE GETTING PERFORMANCE ISSUES.
        // Defaults suggested by argon2 Draft RFC https://tools.ietf.org/html/draft-irtf-cfrg-argon2-03 with custom memory tweak
        timeCost: 1,    // Increase adds security but more time to the computation
        memoryCost: safeMemoryCost > 10 ? safeMemoryCost : 11 , // Be careful as this is already a high default value. Anything > 10 should suffice.
        parallelism: nThreads, // Max number of parallelism 
        type: 2 // 2 is argon2id, the recommended from the Draft RFC
    },
    JWT: {
        // WARNING: You should change this the first time before starting the server, if you change it later you can't validate old tokens.
        secret: 'This-Should-Be-Changed',
        issuer: 'TheBigBangTeam',
        expiration: '12h',
        algorithm: 'HS512'
    },
    AES: {
        // WARNING: You should change this the first time before starting the server, if you change it later you can't decrypt whatever is encrypted with these parameters.
        secret: 'This-Should-Be-Changed-Too',
        keyLength: 256,
        mode: 'cbc'
    }
};


module.exports = {settings};