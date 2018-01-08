'use strict'

const request = require('supertest')
const chai = require('chai')
const expect = chai.expect

const {logs, populateTokens} = require('./../seed/seed')
const {app} = require('./../../app')

const logsPath = '/api/stats'

describe('[*] STATS API TEST', () => {
  const {tokenAdmin, notAuthorizedToken, authorizedToken, nonExistentUserToken} = populateTokens()

  it('should return all stats to admin', (done) => {
    request(app)
    .get(logsPath)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .expect(200)
    .end((err, res) => {
      if (err) return done(err)
      expect(res.body.total_actions).to.equal(logs.length)
      expect(res.body.total_info).to.equal(1)
      expect(res.body.total_warnings).to.equal(1)
      expect(res.body.total_fatal).to.equal(1)
      done()
    })
  })

  it('should NOT return stats to non authorized users', (done) => {
    request(app)
    .get(logsPath)
    .set('Authorization', `Bearer ${notAuthorizedToken}`)
    .expect(401)
    .end(done)
  })

  it('should NOT return stats to non existent users', (done) => {
    request(app)
    .get(logsPath)
    .set('Authorization', `Bearer ${nonExistentUserToken}`)
    .expect(401)
    .end(done)
  })
})
