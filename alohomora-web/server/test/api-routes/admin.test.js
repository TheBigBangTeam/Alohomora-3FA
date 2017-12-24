const request = require('supertest');
const {ObjectId} = require('mongodb');

var chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should();

const {app} = require('./../../../server/server');
const User = require('./../../models/User');

const adminPath = '/api/admin';

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

describe('ADMIN API TEST:', () => {
    // TODO: create an admin before
    
    beforeEach((done) => {
        User.remove({}).then(() => {
            return User.insertMany(users);
        }).then(() => done())
    });


    describe('GET /users', () => {
        it('should get all users',(done) => {
            request(app)
            .get(`${adminPath}/users`)
            .expect(200)
            .expect((res) => {
                expect(res.body.users.length).to.equal(2);
            })
            .end(done);
        });
    });

    describe('GET /users/:id', () => {

        it('should get a valid user', (done) => {
            request(app)
            .get(`${adminPath}/users/${users[1]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.user._id).to.equal(users[1]._id.toHexString());
            })
            .end(done);
        });

        it('should NOT get a non existing user', (done) => {
            var newId = new ObjectId();

            request(app)
            .get(`${adminPath}/users/${newId.toHexString()}`)
            .expect(404)
            .end(done);
        });

        it('should NOT accept an invalid Id', (done) => {
            var badId = '1234'

            request(app)
            .get(`${adminPath}/users/${badId}`)
            .expect(400)
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
            .post(`${adminPath}/users`)
            .send(newuser)
            .expect(200)
            .expect((res) => {
                expect(res.body.user.email).to.equal(newuser.email);
            })
            .end((err, res) => {
                if(err) return done(err);

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
            .post(`${adminPath}/users`)
            .send(badEmailUser)
            .expect(400)
            .end((err,res) => {
                if(err) return done(err);
                User.find({username: badEmailUser.username})
                .then((users) => {
                    expect(users.length).to.equal(0);
                    done();
                })
                .catch((err) => done(err));
            });
        });

    });

    describe('PUT /users/:id', () => {
        it('should update a valid user', (done) => {
            var newEmail = 'usernewemail@example.com';
            
            var updated = {
                username: 'user1',
                name: 'user',
                surname: 'one',
                email: newEmail,
                password: 'passwordlunga',
                workTask: 'technician',
                pin: '1234'
            }


            request(app)
            .put(`${adminPath}/users/${users[0]._id.toHexString()}`)
            .send(updated)
            .expect(200)
            .expect((res) => {
                expect(res.body.user.email).to.equal(updated.email);
            })
            .end((err, res) => {
                if(err) return done(err);

                User.findById(users[0]._id)
                .then((user) => {
                    expect(user.email).to.equal(newEmail);
                    done();
                })
                .catch((err) => done(err));
            });
        });

        it('should NOT update a non existent user', (done) => {
            var randomId = new ObjectId();
            request(app)
            .put(`${adminPath}/users/${randomId.toHexString()}`)
            .expect(404)
            .end(done);
        });

        it('should NOT update an invalid Id', (done) => {
            request(app)
            .put(`${adminPath}/users/1234`)
            .expect(404)
            .end(done);
        });

        it('should NOT update a user with an invalid email', (done)=> {
            
            var badEmail = '12345';
            var badUpdated = {
                username: 'user1',
                name: 'user',
                surname: 'one',
                email: badEmail,
                password: 'passwordlunga',
                workTask: 'technician',
                pin: '1234'
            }

            request(app)
            .put(`${adminPath}/users/${users[0]._id.toHexString()}`)
            .send(badUpdated)
            .expect(400)
            .end((err, res) => {
                if(err) return done(err);

                User.findById(users[0]._id)
                .then((user) => {
                    expect(user.email).to.equal(users[0].email);
                    done();
                })
                .catch((err) => done(err));
            });
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete an existing user', (done) => {
            request(app)
            .delete(`${adminPath}/users/${users[1]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.user.email).to.equal(users[1].email);
            })
            .end((err,res) => {
                if(err) return done(err);
                User.find({})
                .then((users) => {
                    expect(users.length).to.equal(1);
                    done();
                })
                .catch((err) => done(err));
            });
        });

        it('should NOT accept an invalid Id', (done) => {
            request(app)
            .delete(`${adminPath}/users/234`)
            .expect(404)
            .end(done);
        });

        it('should not delete an invalid Id', (done)=> {
            var randId = new ObjectId();

            request(app)
            .delete(`${adminPath}/users/${randId.toHexString()}`)
            .expect(404)
            .end(done);
        });
    });

});
