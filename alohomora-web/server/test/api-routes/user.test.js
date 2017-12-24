const request = require('supertest');
var chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should();

const User = require('./../../models/User');
const {app} = require('./../../../server/server');
const {users, populateUsers} = require('./../seed/seed');

const userPath = '/api/user';

describe('[*] USER API TEST:', () => {
    beforeEach(populateUsers);

    describe('- POST /', () => {
      it('should login correctly', (done) => {
          credentials = {
            username: users[0].username,
            password: users[0].password
          }

          request(app)
          .post(`${userPath}`)
          .send(credentials)
          .expect(200)
          .end(done)
      });
    });
    
});
