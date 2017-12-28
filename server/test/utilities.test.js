"use strict";

const request = require('supertest');
const chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should();

const User = require('./../models/User');
const {users, populateUsers} = require('./seed/seed');
const {encryptAES, decryptAES} = require('./../utilities');
const {settings} = require('./../settings');

describe('[*] UTILITIES TEST:', () => {
  beforeEach(populateUsers);
  
  it('should hash user password with Argon2 algorithm', (done) => {
    User.findById(users[0]._id)
    .then((user) => {
      if(!user){
        return done('Cannot find user');
      }
      
      if(user.password.includes("argon2")){
        return done();
      } else {
        return done(new Error('Password NOT hashed, or hashed with a different algorithm'));
      }
    })
    .catch((err) => {
      return done(err);
    });
  });

  it('should hash user rfidTag with Argon2 algorithm', (done) => {
    User.findById(users[0]._id)
    .then((user) => {
      if(!user){
        return done('Cannot find user');
      }
      
      if(user.rfidTag.includes("argon2")){
        return done();
      } else {
        return done(new Error('rfidTag NOT hashed, or hashed with a different algorithm'));
      }
    })
    .catch((err) => {
      return done(err);
    });
  });

  it('should encrypt user PIN with AES encryption algorithm', (done) => {
    User.findById(users[0]._id)
    .then((user) => {
      if(!user){
        return done('Cannot find user');
      }
      
      expect(user.pin.length).to.equal(32);
      expect(user.pin).to.not.equal(users[0].pin);
      done();
    })
    .catch((err) => {
      return done(err);
    });
  });

  it('should decrypt user PIN succesfully', (done) => {
    User.findById(users[0]._id)
    .then((user) => {
      if(!user){
        return done('Cannot find user');
      }
      
      let decrypted = decryptAES(settings.AES.keyLength, settings.AES.mode, settings.AES.secret, user.pin);
      expect(decrypted).to.equal(users[0].pin);
      done();

    })
    .catch((err) => {
      return done(err);
    });
  });

  it('should throw an error if using an invalid algorithm', (done) => {
    const message = 'hello, friend!';
    try {
      let encrypted = encryptAES(settings.AES.keyLength, 'invalid-mode', settings.AES.secret, message);
      done('Should not have encrypted message');
    } catch (error) {
      expect(error.message).to.equal('Invalid algorithm length or mode');
      done();
    }
  });

  it('should throw an error if using an invalid key length', (done) => {
    const ciphertext = encryptAES(settings.AES.keyLength, settings.AES.mode, settings.AES.secret, 'Hello, world!');
    try {
      let decrypted = decryptAES(1337, settings.AES.mode, settings.AES.secret, ciphertext);
      done('Should not have decrypted message');
    } catch (error) {
      expect(error.message).to.equal('Invalid algorithm length or mode');
      done();
    }
  });

});

