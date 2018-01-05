const chai = require('chai')
const expect = chai.expect

const {setEnvironment} = require('./../environment')

describe('[*] ENVIRONMENT TEST', () => {
  it('should load development environment', () => {
    setEnvironment('development')

    expect(process.env.PORT).to.equal('3001')
    expect(process.env.MONGODB_URI).to.equal('mongodb://localhost/alohomora-db-devel')
  })
})
