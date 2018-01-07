'use strict'

const config = require('config')
const chai = require('chai')
const expect = chai.expect

const User = require('./../models/User')
const {users, populateUsers} = require('./seed/seed')
const {encryptAES, decryptAES} = require('./../utilities')

describe('[*] UTILITIES TEST:', () => {
  beforeEach(populateUsers)

  it('should hash user password with Argon2 algorithm', (done) => {
    User.findById(users[0]._id)
    .then((user) => {
      if (!user) {
        return done('Cannot find user')
      }

      if (user.password.includes('argon2')) {
        return done()
      } else {
        return done(new Error('Password NOT hashed, or hashed with a different algorithm'))
      }
    })
    .catch((err) => {
      return done(err)
    })
  })

  it('should encrypt user rfidTag using AES algorithm', (done) => {
    User.findById(users[0]._id)
    .then((user) => {
      if (!user) {
        return done('Cannot find user')
      }

      expect(user.rfidTag).to.not.equal(users[0].rfidTag)
      expect(user.rfidTag.length).to.equal(32)
      done()
    }).catch((err) => {
      done(err)
    })
  })

  it('should encrypt user PIN with AES encryption algorithm', (done) => {
    User.findById(users[0]._id)
    .then((user) => {
      if (!user) {
        return done('Cannot find user')
      }

      expect(user.pin.length).to.equal(32)
      expect(user.pin).to.not.equal(users[0].pin)
      done()
    })
    .catch((err) => {
      return done(err)
    })
  })

  it('should decrypt user PIN succesfully', (done) => {
    User.findById(users[0]._id)
    .then((user) => {
      if (!user) {
        return done('Cannot find user')
      }

      let decrypted = decryptAES(config.get('Settings.AES.keyLength'), config.get('Settings.AES.mode'), config.get('Settings.AES.secret'), user.pin)
      expect(decrypted).to.equal(users[0].pin)
      done()
    })
    .catch((err) => {
      return done(err)
    })
  })

  it('should throw an error if using an invalid algorithm', (done) => {
    const message = 'hello, friend!'
    try {
      encryptAES(config.get('Settings.AES.keyLength'), 'invalid-mode', config.get('Settings.AES.secret'), message)
      done('Should not have encrypted message')
    } catch (error) {
      expect(error.message).to.equal('Invalid algorithm length or mode')
      done()
    }
  })

  it('should throw an error if using an invalid key length', (done) => {
    const ciphertext = encryptAES(config.get('Settings.AES.keyLength'), config.get('Settings.AES.mode'), config.get('Settings.AES.secret'), 'Hello, world!')
    try {
      decryptAES(1337, config.get('Settings.AES.mode'), config.get('Settings.AES.secret'), ciphertext)
      done('Should not have decrypted message')
    } catch (error) {
      expect(error.message).to.equal('Invalid algorithm length or mode')
      done()
    }
  })
})
