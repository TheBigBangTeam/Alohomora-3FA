'use strict'

const request = require('supertest')
const chai = require('chai')
const expect = chai.expect

const {logs, populateDevices, populateUsers, populateLogs, populateTokens} = require('./../seed/seed')
const {app} = require('./../../app')

const logsPath = '/api/logs'

describe('[*] LOG API TEST', () => {
  beforeEach(populateUsers)
  beforeEach(populateDevices)
  beforeEach(populateLogs)
  const {tokenAdmin, notAuthorizedToken, authorizedToken, nonExistentUserToken} = populateTokens()

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
