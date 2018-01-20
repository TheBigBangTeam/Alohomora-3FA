const chai = require('chai') 
const expect = chai.expect

const { notifyMail } = require('./../mailer')
const { dbConnect } = require('./../db')

describe('[*] MAILER TEST', () => {
  before(dbConnect)

  it('should send email to security users', function (done) {
    this.timeout(15000);
    notifyMail('Warning', 'test').then((email) => {
      expect(email.accepted.length).to.equal(2)
      done()
    }).catch((err) => done(err))
  })
})