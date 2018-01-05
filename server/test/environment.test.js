const chai = require('chai')
const expect = chai.expect

const {setEnvironment} = require('./../environment')
const {settings} = require('./../settings')

describe('[*] ENVIRONMENT TEST', () => {
  it('should load development environment', () => {
    setEnvironment('development')

    expect(process.env.PORT).to.equal('3001')
    expect(process.env.MONGODB_URI).to.equal('mongodb://localhost/alohomora-db-devel')
  })

  it('should load production environment', () => {
    setEnvironment('production')
    expect(process.env.PORT).to.equal(settings.port)
    expect(process.env.MONGODB_URI).to.equal(settings.db)
    expect(process.env.TLS).to.equal(settings.tls.set)
    expect(process.env.KEY_PATH).to.equal(settings.tls.keyPath)
    expect(process.env.CERT_PATH).to.equal(settings.tls.certPath)
  })
})
