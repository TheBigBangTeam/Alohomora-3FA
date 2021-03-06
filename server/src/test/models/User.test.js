const chai = require('chai')
const expect = chai.expect

const User = require('./../../models/User')
const {users, populateUsers} = require('./../seed/seed')

beforeEach(populateUsers)

describe('[*] User Model test', () => {
  it('should trigger pre save', (done) => {
    User.findById(users[0]._id)
        .then((user) => {
          let password = user.password = `${users[0].password}changed`
          let rfid = user.rfidTag = `${users[0].rfidTag}changed`
          let pin = user.pin = `${users[0].pin}changed`
          user.save((err, saved) => {
            if (err) { return done(err) };
            expect(saved.pin.length).to.equal(32)
            expect(saved.password).to.not.equal(password)
            expect(saved.rfidTag).to.not.equal(rfid)
            expect(saved.pin).to.not.equal(pin)

            done()
          })
        })
        .catch((e) => {
          done(e.message)
        })
  })
})
