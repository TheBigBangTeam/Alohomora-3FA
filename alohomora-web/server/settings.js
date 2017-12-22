var settings = {
    port: 8080,
    db: 'mongodb://localhost/alohomora-db',
    tls: {
        set: 'no',
        keyPath: './key.pem',
        certPath:'./cert.pem'
    }
};


module.exports = {settings};