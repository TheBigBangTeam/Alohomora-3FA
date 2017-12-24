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
          .end((err, res) => {
            if(err) {
              return done(err);
            }

            if(res.header['x-auth'] === '' || !res.header['x-auth'])
            {
              return done('x-auth should be present in the header');
            }
            done();


          });
      });

      it('should NOT login with an invalid username', (done) => {
        credentials = {
          username: 'idontexist',
          password: users[0].password
        }

        request(app)
        .post(`${userPath}`)
        .send(credentials)
        .expect(400)
        .end(done)
      });

      it('should NOT login with a wrong password', (done) => {
        credentials = {
          username: users[1].username,
          password: users[1].password + 'invalid'
        }

        request(app)
        .post(`${userPath}`)
        .send(credentials)
        .expect(400)
        .end(done);
      });
    });

    describe('- GET /', () => {
      it('should get self results properly', (done) => {
        credentials = {
          username: users[0].username,
          password: users[0].password
        }

        request(app)
        .post(`${userPath}`)
        .send(credentials)
        .end((err, res) => {
          request(app)
          .get(`${userPath}`)
          .set('x-auth', res.header['x-auth'])
          .expect(200)
          .end((err, res) => {
            if(err){
              done(err);
            }

            expect(res.body.email).to.equal(users[0].email);
            done();

          });
        });

      });

      it('should NOT get results back with an invalid token', (done) => {
        request(app)
        .get(`${userPath}`)
        .set('x-auth', 'invalidt0ken')
        .expect(401)
        .end(done);
      });
    });
    
});
