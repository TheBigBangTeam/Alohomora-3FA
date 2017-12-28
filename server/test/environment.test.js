const chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should();

const {setEnvironment} = require('./../environment');
const {settings} = require('./../settings');

describe('[*] ENVIRONMENT TEST', () => {
    it('should load development environment', () => {
        setEnvironment('development');

        expect(process.env.PORT).to.equal('8080');
        expect(process.env.MONGODB_URI).to.equal('mongodb://localhost/alohomora-db-devel');
    });

    it('should load production environment', () => {
        setEnvironment('production');
        expect(process.env.PORT).to.equal(settings.port);
        expect(process.env.MONGODB_URI).to.equal(settings.db);
        expect(process.env.TLS).to.equal(settings.tls.set);
        expect(process.env.KEY_PATH).to.equal(settings.tls.keyPath);
        expect(process.env.CERT_PATH).to.equal(settings.tls.certPath);

    });

    it('should load test environment', () => {
        setEnvironment('test');

        expect(process.env.PORT).to.equal('8080');
        expect(process.env.MONGODB_URI).to.equal('mongodb://localhost/alohomora-db-test');
    });

    
});