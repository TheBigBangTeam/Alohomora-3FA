'use strict'

const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
const jwt = require('jsonwebtoken')

const {users, logs, populateDevices, populateUsers, populateLogs} = require('./../seed/seed')
const {app} = require('./../../../index')
const {settings} = require('./../../settings')

const logsPath = '/api/logs'

const tokenAdmin = jwt.sign({_id: users[2]._id.toHexString(), privilege: users[2].privilege},
                            settings.JWT.secret,
                            {algorithm: settings.JWT.algorithm, expiresIn: settings.JWT.expiration, issuer: settings.JWT.issuer}
                            ).toString()
const authorizedToken = jwt.sign({_id: users[0]._id.toHexString(), privilege: users[0].privilege},
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

  it('should return all logs to authorized peopele', (done) => {
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
})
