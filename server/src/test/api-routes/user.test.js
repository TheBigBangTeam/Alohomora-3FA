'use strict'

const request = require('supertest')
const config = require('config')
const chai = require('chai')
const expect = chai.expect
const should = chai.should()
const jwt = require('jsonwebtoken')
const {ObjectId} = require('mongodb')

const {app} = require('./../../app')
const {users, populateUsers} = require('./../seed/seed')

const userPath = '/api/user'

describe('[*] USER API TEST:', () => {
  beforeEach(populateUsers)

  describe('- POST /', () => {
    it('should login correctly', (done) => {
      const credentials = {
        username: users[0].username,
        password: users[0].password
      }

      request(app)
          .post(`${userPath}`)
          .send(credentials)
          .expect(200)
          .end((err, res) => {
            should.not.exist(err)
            expect(res.body.token).to.not.be.an('undefined')
            expect(res.body.user.email).to.equal(users[0].email)
            done()
          })
    })

    it('should NOT login with an invalid username', (done) => {
      const credentials = {
        username: 'invalid',
        password: users[0].password
      }

      request(app)
        .post(`${userPath}`)
        .send(credentials)
        .expect(400)
        .end(done)
    })

    it('should NOT login with a wrong password', (done) => {
      const credentials = {
        username: users[1].username,
        password: users[1].password + 'invalid'
      }

      request(app)
        .post(`${userPath}`)
        .send(credentials)
        .expect(400)
        .end(done)
    })
  })

  describe('- GET /', () => {
    it('should get self results properly', (done) => {
      const credentials = {
        username: users[0].username,
        password: users[0].password
      }

      request(app)
        .post(`${userPath}`)
        .send(credentials)
        .end((err, res) => {
          if (err) {
            done(err)
          }

          request(app)
          .get(`${userPath}`)
          .set('Authorization', `Bearer ${res.body.token}`)
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err)
            }

            expect(res.body.email).to.equal(users[0].email)
            expect(res.body.username).to.equal(users[0].username)
            expect(res.body.name).to.equal(users[0].name)
            expect(res.body.surname).to.equal(users[0].surname)
            expect(res.body._id).to.equal(users[0]._id.toHexString())
            done()
          })
        })
    })

    it('should NOT get results back with an invalid token', (done) => {
      request(app)
        .get(`${userPath}`)
        .set('Authorization', 'invalidt0ken')
        .expect(401)
        .end(done)
    })

    it('should NOT get results back with a rogue Token', (done) => {
      let rogueToken = jwt.sign({ _id: users[2]._id.toHexString, privilege: 'admin' }, 'not a valid key').toString()
      request(app)
        .get(`${userPath}`)
        .set('Authorization', `Bearer ${rogueToken}`)
        .expect(401)
        .end(done)
    })

    it('should NOT get results back with a non-existent user', (done) => {
      const id = new ObjectId()
      let wrongUserToken = jwt.sign({ _id: id, privileges: ['admin'] }, config.get('Settings.JWT.secret')).toString()
      request(app)
        .get(`${userPath}`)
        .set('Authorization', `Bearer ${wrongUserToken}`)
        .expect(401)
        .end(done)
    })
  })
})
