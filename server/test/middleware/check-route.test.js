'use strict'

const request = require('supertest')

const {app} = require('./../../../server/index')

describe('[*] ROUTE CHECKER MIDDLEWARE TEST', () => {
  it('Should return 400', (done) => {
    request(app)
        .get('/api/non-existent')
        .expect(400)
        .end(done)
  })

  it('Should return 401', (done) => {
    request(app)
        .get('/api/admin/users')
        .expect(401)
        .end(done)
  })

  it('Should return 200', (done) => {
    request(app)
        .get('/')
        .expect(200)
        .end(done)
  })

  it('Should return 404', (done) => {
    request(app)
        .post('/')
        .expect(404)
        .end(done)
  })
})
