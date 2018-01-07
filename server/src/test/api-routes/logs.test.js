'use strict'

const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
const jwt = require('jsonwebtoken')
const {ObjectId} = require('mongodb')

const {users, logs, populateDevices, populateUsers, populateLogs} = require('./../seed/seed')
const {app} = require('./../../app')
const {settings} = require('./../../settings')

const logsPath = '/api/logs'

const tokenAdmin = jwt.sign({_id: users[2]._id.toHexString(), privileges: users[2].privileges},
                            settings.JWT.secret,
                            {algorithm: settings.JWT.algorithm, expiresIn: settings.JWT.expiration, issuer: settings.JWT.issuer}
                            ).toString()
const authorizedToken = jwt.sign({_id: users[1]._id.toHexString(), privileges: users[1].privileges},
                        settings.JWT.secret,
                        {algorithm: settings.JWT.algorithm, expiresIn: settings.JWT.expiration, issuer: settings.JWT.issuer}
                        ).toString()
const notAuthorizedToken = jwt.sign({_id: users[0]._id.toHexString(), privileges: users[0].privileges},
                        settings.JWT.secret,
                        {algorithm: settings.JWT.algorithm, expiresIn: settings.JWT.expiration, issuer: settings.JWT.issuer}
                        ).toString()

const nonExistentId = new ObjectId()
const nonExistentUserToken = jwt.sign({_id: nonExistentId.toHexString(), privileges: users[2].privileges},
                        settings.JWT.secret,
                        {algorithm: settings.JWT.algorithm, expiresIn: settings.JWT.expiration, issuer: settings.JWT.issuer}
                        ).toString()

describe('[*] LOG API TEST', () => {
  beforeEach(populateUsers)
  beforeEach(populateDevices)
  beforeEach(populateLogs)

  it('should return all logs to the admin', (done) => {
    request(app)
        .get(`${logsPath}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done('Error on request')
          expect(res.body.logs.length).to.equal(logs.length)
          done()
        })
  })

  it('should return 401', (done) => {
    request(app)
        .get(`${logsPath}`)
        .expect(401)
        .end(done)
  })

  it('should return all logs to authorized people', (done) => {
    request(app)
        .get(`${logsPath}`)
        .set('Authorization', `Bearer ${authorizedToken}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done('Error on request')
          expect(res.body.logs.length).to.equal(logs.length)
          done()
        })
  })

  it('should NOT return logs to unauthorized people', (done) => {
    request(app)
        .get(`${logsPath}`)
        .set('Authorization', `Bearer ${notAuthorizedToken}`)
        .expect(401)
        .end(done)
  })

  it('should NOT return logs to non existent people', (done) => {
    request(app)
        .get(`${logsPath}`)
        .set('Authorization', `Bearer ${nonExistentUserToken}`)
        .expect(401)
        .end(done)
  })
})
