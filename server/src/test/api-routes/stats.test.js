'use strict'

const request = require('supertest')
const chai = require('chai')
const config = require('config')
const expect = chai.expect
const jwt = require('jsonwebtoken')
const {ObjectId} = require('mongodb')

const {users, logs, populateUsers, populateLogs} = require('./../seed/seed')
const {app} = require('./../../app')

const logsPath = '/api/stats'

const tokenAdmin = jwt.sign({_id: users[2]._id.toHexString(), privileges: users[2].privileges},
                                  config.get('Settings.JWT.secret'), {algorithm: config.get('Settings.JWT.algorithm'), expiresIn: config.get('Settings.JWT.expiration'), issuer: config.get('Settings.JWT.issuer')}
                                  ).toString()

const notAuthorizedToken = jwt.sign({_id: users[0]._id.toHexString(), privileges: users[0].privileges},
                                  config.get('Settings.JWT.secret'), {algorithm: config.get('Settings.JWT.algorithm'), expiresIn: config.get('Settings.JWT.expiration'), issuer: config.get('Settings.JWT.issuer')}
                                  ).toString()
const nonExistentId = new ObjectId()
const nonExistentUserToken = jwt.sign({_id: nonExistentId.toHexString(), privileges: users[2].privileges},
                                                              config.get('Settings.JWT.secret'), {algorithm: config.get('Settings.JWT.algorithm'), expiresIn: config.get('Settings.JWT.expiration'), issuer: config.get('Settings.JWT.issuer')}
                                                              ).toString()

describe('[*] STATS API TEST', () => {
  it('should return all stats to admin', (done) => {
    request(app)
    .get(logsPath)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .expect(200)
    .end((err, res) => {
      if (err) return done(err)
      expect(res.body.total_actions).to.equal(3)
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
