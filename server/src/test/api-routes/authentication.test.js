'use strict'

const request = require('supertest')
const jwt = require('jsonwebtoken')
const chai = require('chai')
const expect = chai.expect

const {app} = require('./../../app')
const {users, devices, logs, populateLogs, populateUsers, populateDevices} = require('./../seed/seed')
const {settings} = require('./../../settings')
const Log = require('./../../models/Log')
const authenticationPath = '/api/authenticate'

const token = jwt.sign({_id: devices[0]._id.toHexString()}, settings.JWT.secret, {algorithm: settings.JWT.algorithm, issuer: settings.JWT.issuer}).toString()
const tokenFake = jwt.sign({_id: devices[0]._id.toHexString()}, 'Fake', {algorithm: settings.JWT.algorithm, issuer: settings.JWT.issuer}).toString()
const noDbToken = jwt.sign({_id: '5a469a203d4f2410c9cb7632'}, settings.JWT.secret, {algorithm: settings.JWT.algorithm, issuer: settings.JWT.issuer}).toString()

describe('[*] AUTHENTICATION ROUTE TEST', () => {
  beforeEach(populateUsers)
  beforeEach(populateDevices)
  beforeEach(populateLogs)

  describe('- GET /:rfid', () => {
    it('should return 200', (done) => {
      request(app)
            .get(`${authenticationPath}/${users[0].rfidTag}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err)
              Log.find({}, (err, logList) => {
                if (err) {
                  return done(err)
                }
                expect(logList.length).to.equal(logs.length + 1)
                done()
              })
            })
    })

    it('should return 401 (invalid token)', (done) => {
      request(app)
            .get(`${authenticationPath}/${users[0].rfidTag}`)
            .set('Authorization', `Bearer ${tokenFake}`)
            .expect(401)
            .end(done)
    })

    it('should return 404 ', (done) => {
      request(app)
            .get(`${authenticationPath}/nonexistent`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .end((err, res) => {
              if (err) return done(err)
              Log.find({}, (err, logList) => {
                if (err) {
                  return done(err)
                }
                expect(logList.length).to.equal(logs.length + 1)
                done()
              })
            })
    })

    it('should return 401 (device not found)', (done) => {
      request(app)
            .get(`${authenticationPath}/${users[0].rfidTag}`)
            .set('Authorization', `Bearer ${noDbToken}`)
            .expect(401)
            .end(done)
    })
  })

  describe('- GET /:rfid/:pin', () => {
    it('should return 200 (Open the door)', (done) => {
      request(app)
            .get(`${authenticationPath}/${users[0].rfidTag}/${users[0].pin}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err)
              Log.find({}, (err, logList) => {
                if (err) {
                  return done(err)
                }
                expect(logList.length).to.equal(logs.length + 1)
                done()
              })
            })
    })

    it('should return 401 ', (done) => {
      request(app)
            .get(`${authenticationPath}/${users[0].rfidTag}/28310381028312`)
            .set('Authorization', `Bearer ${token}`)
            .expect(401)
            .end((err, res) => {
              if (err) return done(err)
              Log.find({}, (err, logList) => {
                if (err) {
                  return done(err)
                }
                expect(logList.length).to.equal(logs.length + 1)
                done()
              })
            })
    })
  })
})
