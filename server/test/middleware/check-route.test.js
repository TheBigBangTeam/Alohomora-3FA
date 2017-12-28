"use strict";

const request = require('supertest');
const chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should();

const {app} = require('./../../../server/server');

describe('[*] ROUTE CHECKER MIDDLEWARE TEST', () => {
    it('Should return 400', (done) => {
        request(app)
        .get('/api/non-existent')
        .expect(400)
        .end(done);
    });

    it('Should return 401', (done) => {
        request(app)
        .get('/api/admin/users')
        .expect(401)
        .end(done);
    });

    it('Should return 404', (done) => {
        // Remember to delete 
        request(app)
        .get('/')
        .expect(404)
        .end(done);
    });
});