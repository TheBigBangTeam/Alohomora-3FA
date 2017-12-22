const request = require('supertest');
const {ObjectId} = require('mongodb');

var chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should();

const {app} = require('./../../../server/server');
const User = require('./../../models/User');

const adminpath = '/api/admin';

const users = [{
    _id: new ObjectId(),
    username: 'user1',
    name: 'user',
    surname: 'one',
    email: 'user1@example.com',
    password: 'passwordlunga',
    workTask: 'technician',
    pin: '1234'
},{
    _id: new ObjectId(),
    username: 'user2',
    name: 'user',
    surname: 'due',
    email: 'user2@example.com',
    password: 'passwordlunghissima',
    workTask: 'technician',
    pin: '6578'
}];

beforeEach((done) => {
    User.remove({}).then(() => {
        return User.insertMany(users);
    }).then(() => done())
});

describe('ADMIN API TEST:', () => {
    describe('GET /users', () => {
        it('should get all users',(done) => {
            request(app)
            .get(`${adminpath}/users`)
            .expect(200)
            .expect((res) => {
                expect(res.body.users.length).to.equal(2);
            })
            .end(done);
        });
    });

    describe('GET /users/:id', () => {
        it('should get user1', (done) => {
            request(app)
            .get(`${adminpath}/users/${users[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.user.username).to.equal(users[0].username);
            })
            .end(done);
        });

        it('should get user2', (done) => {
            request(app)
            .get(`${adminpath}/users/${users[1]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.user.username).to.equal(users[1].username);
            })
            .end(done);
        });

        it('should NOT get a non existing user', (done) => {
            var newId = new ObjectId();

            request(app)
            .get(`${adminpath}/users/${newId.toHexString()}`)
            .expect(404)
            .end(done);
        });
    });

    describe('POST /users', () => {
        it('should create a new user', (done) => {
            var newuser = {
                username: 'newuser',
                name: 'user',
                surname: 'new',
                email: 'newuser@example.com',
                password: 'passwordlunghissima',
                workTask: 'technician',
                pin: '5678'
            };

            request(app)
            .post(`${adminpath}/users`)
            .send(newuser)
            .expect(200)
            .expect((res) => {
                expect(res.body.user.username).to.equal(newuser.username);
                expect(res.body.user.name).to.equal(newuser.name);
                expect(res.body.user.surname).to.equal(newuser.surname);
                expect(res.body.user.email).to.equal(newuser.email);
                expect(res.body.user.password).to.equal(newuser.password);
                expect(res.body.user.workTask).to.equal(newuser.workTask);
                expect(res.body.user.pin).to.equal(newuser.pin);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.find({username: newuser.username}).then((users) => {
                    expect(users.length).to.equal(1);
                    expect(users[0].username).to.equal(newuser.username);
                    expect(users[0].name).to.equal(newuser.name);
                    expect(users[0].surname).to.equal(newuser.surname);
                    expect(users[0].email).to.equal(newuser.email);
                    expect(users[0].password).to.equal(newuser.password);
                    expect(users[0].workTask).to.equal(newuser.workTask);
                    expect(users[0].pin).to.equal(newuser.pin);
                    done();
                }).catch((err)=> done(err));
            });
        });

        it('should NOT create a user with an invalid email', (done) => {
            var badEmailUser = {
                username: 'newuser',
                name: 'user',
                surname: 'new',
                email: 'imwrong',
                password: 'passwordlunghissima',
                workTask: 'technician',
                pin: '5678'
            };

            request(app)
            .post(`${adminpath}/users`)
            .send(badEmailUser)
            .expect(400)
            .end(done);
        });

    });
});


