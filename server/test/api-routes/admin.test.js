"use strict";

const request = require('supertest');
const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');
const chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should();

const {app} = require('./../../../server/index');
const User = require('./../../models/User');
const Device = require('./../../models/Device');
const {users, devices, populateDevices, populateUsers} = require('./../seed/seed');
const {settings} = require('./../../settings');

const adminPath = '/api/admin';

const token = jwt.sign({_id: users[2]._id.toHexString(), privilege: users[2].privilege}, 
                            settings.JWT.secret, 
                            {algorithm:settings.JWT.algorithm, expiresIn: settings.JWT.expiration, issuer: settings.JWT.issuer}
                            ).toString();

const nonAdminToken = jwt.sign({_id: users[0]._id.toHexString(), privilege: users[0].privilege}, 
                            settings.JWT.secret, 
                            {algorithm:settings.JWT.algorithm, expiresIn: settings.JWT.expiration, issuer: settings.JWT.issuer}
                            ).toString();

const randomId = new ObjectId();
const nonExistentUserToken = jwt.sign({_id: randomId.toHexString(), privilege: 'hr'}, 
                                settings.JWT.secret, 
                                {algorithm:settings.JWT.algorithm, expiresIn: settings.JWT.expiration, issuer: settings.JWT.issuer}
                                ).toString();
describe('[*] ADMIN API TEST:', () => {
    beforeEach(populateUsers);
    beforeEach(populateDevices);

    describe('- GET /users', () => {
        it('shouldn\'t authorize non-admin users', (done) => {
            request(app)
            .get(`${adminPath}/users`)
            .set('Authorization', `Bearer ${nonAdminToken}`)
            .expect(401)
            .end(done);
        });

        it('shouldn\'t authorize deleted users', (done) => {
            request(app)
            .get(`${adminPath}/users`)
            .set('Authorization', `Bearer ${nonExistentUserToken}`)
            .expect(401)
            .end(done);
        });

        it('should get all users',(done) => {

            request(app)
            .get(`${adminPath}/users`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.users.length).to.equal(users.length);
            })
            .end(done);
        });
    });

    describe('- GET /users/:id', () => {

        it('should get a valid user', (done) => {
            request(app)
            .get(`${adminPath}/users/${users[1]._id.toHexString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.user._id).to.equal(users[1]._id.toHexString());
            })
            .end(done);
        });

        it('should NOT get a non existing user', (done) => {
            let newId = new ObjectId();

            request(app)
            .get(`${adminPath}/users/${newId.toHexString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .end(done);
        });

        it('should NOT accept an invalid Id', (done) => {
            let badId = '1234'

            request(app)
            .get(`${adminPath}/users/${badId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
            .end(done);
        });
    });

    describe('- POST /users', () => {
        it('should create a new user', (done) => {

            const newuser = {
                username: 'newuser',
                name: 'user',
                surname: 'new',
                email: 'newuser@example.com',
                password: 'passwordlunghissima',
                privilege: 'technician',
                pin: '5678',
                rfidTag: '3'
            };

            request(app)
            .post(`${adminPath}/users`)
            .set('Authorization', `Bearer ${token}`)
            .send(newuser)
            .expect(200)
            .expect((res) => {
                expect(res.body.user.email).to.equal(newuser.email);
            })
            .end((err, res) => {
                if(err) return done(err);

                User.find({username: newuser.username}).then((users) => {
                    expect(users.length).to.equal(1);
                    done();
                }).catch((err)=> done(err));
            });
        });

        it('should NOT create a user that has a short password', (done) =>{
            const badPasswordUser = {
                username: 'newuser',
                name: 'user',
                surname: 'new',
                email: 'valid@email.org',
                password: 'short',
                privilege: 'technician',
                pin: '5678',
                rfidTag: '5'
            };

            request(app)
            .post(`${adminPath}/users`)
            .set('Authorization', `Bearer ${token}`)
            .send(badPasswordUser)
            .expect(400)
            .end((err, res) => {
                if(err) return done(err);
                User.find({username: badPasswordUser.username})
                .then((users) => {
                    expect(users.length).to.equal(0);
                    done();
                })
                .catch((err) => done(err));
            });
        });

        it('should NOT create a user with an invalid email', (done) => {
            const badEmailUser = {
                username: 'newuser',
                name: 'user',
                surname: 'new',
                email: 'imwrong',
                password: 'passwordlunghissima',
                privilege: 'technician',
                pin: '5678',
                rfidTag: '5'
            };

            request(app)
            .post(`${adminPath}/users`)
            .set('Authorization', `Bearer ${token}`)
            .send(badEmailUser)
            .expect(400)
            .end((err, res) => {
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

    describe('- PUT /users/:id', () => {
        it('should update a valid user', (done) => {

            let newEmail = 'usernewemail@example.com';
            
            let updatedUser = {...users[0]};
            updatedUser.email = newEmail;
            
            request(app)
            .put(`${adminPath}/users/${users[0]._id.toHexString()}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUser)
            .expect(200)
            .expect((res) => {
                expect(res.body.user.email).to.equal(updatedUser.email);
            })
            .end((err, res) => {
                if(err) return done(err);

                User.findById(users[0]._id)
                .then((user) => {
                    expect(user.email).to.equal(newEmail);
                    expect(user.password).to.not.equal(updatedUser.password);
                    expect(user.pin).to.not.equal(updatedUser.pin);
                    expect(user.rfidTag).to.not.equal(updatedUser.rfidTag);
                    done();
                })
                .catch((err) => done(err));
            });
        });

        
        it('should NOT update a non existent user', (done) => {
            let randomId = new ObjectId();
            request(app)
            .put(`${adminPath}/users/${randomId.toHexString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .end(done);
        });

        it('should NOT update an invalid Id', (done) => {
            request(app)
            .put(`${adminPath}/users/1234`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .end(done);
        });

        it('should NOT update a user with an invalid email', (done)=> {
            
            let badEmail = '12345';
            const badUpdated = {
                username: 'user1',
                name: 'user',
                surname: 'one',
                email: badEmail,
                password: 'passwordlunga',
                privilege: 'technician',
                pin: '1234',
                rfidTag: '6'
            };

            request(app)
            .put(`${adminPath}/users/${users[0]._id.toHexString()}`)
            .set('Authorization', `Bearer ${token}`)
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

    describe('- DELETE /users/:id', () => {
        it('should delete an existing user', (done) => {
            request(app)
            .delete(`${adminPath}/users/${users[1]._id.toHexString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.user.email).to.equal(users[1].email);
            })
            .end((err,res) => {
                if(err) return done(err);
                User.find({})
                .then((userList) => {
                    expect(userList.length).to.equal(users.length - 1);
                    done();
                })
                .catch((err) => done(err));
            });
        });

        it('should NOT accept an invalid Id', (done) => {
            request(app)
            .delete(`${adminPath}/users/234`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .end(done);
        });

        it('should not delete an invalid Id', (done)=> {
            let randId = new ObjectId();

            request(app)
            .delete(`${adminPath}/users/${randId.toHexString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .end(done);
        });
    });

    describe('- POST /devices', () => {
        it('should create a new device', (done) => {
            const newDevice = {
                building:'Colosseum',
                description:'Main entry'
            };

            request(app)
            .post(`${adminPath}/devices`)
            .send(newDevice)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);
                should.exist(res.body.authToken);
                should.exist(res.body.device);
                done();
            });
        });

        it('should NOT create a new device without building', (done) => {
            const newDevice = {
                description:'Main entry'
            };

            request(app)
            .post(`${adminPath}/devices`)
            .send(newDevice)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
            .end((err, res) => {
                should.not.exist(err);
                should.not.exist(res.body.authToken);
                should.not.exist(res.body.device);
                done();
            });
        });

        it('should NOT create a new device without description', (done) => {
            const newDevice = {
                building:'Main entry'
            };

            request(app)
            .post(`${adminPath}/devices`)
            .send(newDevice)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
            .end((err, res) => {
                should.not.exist(err);
                should.not.exist(res.body.authToken);
                should.not.exist(res.body.device);
                done();
            });
        });

        
    });

    describe('- GET /devices', () => {
        it('should get all devices', (done) => {
            request(app)
            .get(`${adminPath}/devices`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);
                expect(res.body.devices.length).to.equal(2);
                done();
            });
        });
    });

    describe('- GET /devices/:id', () => {
        it('should get a device', (done) => {
            request(app)
            .get(`${adminPath}/devices/${devices[0]._id.toHexString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);
                expect(res.body.device.building).to.equal(devices[0].building);
                expect(res.body.device.description).to.equal(devices[0].description);
                done();
            });

        });

        it('should NOT get a device that does not exist', (done) => {
            const randId = new ObjectId(); 

            request(app)
            .get(`${adminPath}/devices/${randId.toHexString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .end((err, res) => {
                should.not.exist(err);
                done();
            });

        });

        it('should NOT get a device with an invalid ID', (done) => {
            request(app)
            .get(`${adminPath}/devices/thisisinvalid`)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
            .end(done);
        });
    });

    describe('- PUT /devices/:id', () => {
        it('should update device', (done) => {
            let newDevice = {...devices[0]};
            newDevice.building='modified';
            
            request(app)
            .put(`${adminPath}/devices/${devices[0]._id.toHexString()}`)
            .send(newDevice)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err,res) => {
                should.not.exist(err);
                expect(res.body.device.description).to.equal(newDevice.description);
                done();
            });
        });

        it('should NOT update invalid device', (done) => {
            let newDevice = {...devices[0]};
            newDevice.building='modified';
            
            request(app)
            .put(`${adminPath}/devices/12`)
            .send(newDevice)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
            .end((err,res) => {
                should.not.exist(err);
                done();
            });
        });

        it('should NOT update non existing device', (done) => {

            let newId = new ObjectId();
            let newDevice = {...devices[0]};
            newDevice.building='modified';
            
            request(app)
            .put(`${adminPath}/devices/${newId.toHexString()}`)
            .send(newDevice)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .end((err,res) => {
                should.not.exist(err);
                done();
            });
        });

    });

    describe('- DELETE /devices/:id', () => {
        it('should delete a device', (done) => {
            request(app)
            .delete(`${adminPath}/devices/${devices[0]._id.toHexString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err,res) => {
                should.not.exist(err);
                expect(res.body.device.building).to.equal(devices[0].building);
                expect(res.body.device.description).to.equal(devices[0].description);
                Device.find({}).then((deviceArray) => {
                    expect(deviceArray.length).to.equal(devices.length - 1)
                    done();
                })
                .catch((err) => {
                    done(err);
                });
                
            });
        });

        it('should NOT delete a device that does not exist', (done) => {
            let newId = new ObjectId();

            request(app)
            .delete(`${adminPath}/devices/${newId.toHexString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .end(done);
        });

        it('should NOT delete a device with an invalid Id', (done) => {
            request(app)
            .delete(`${adminPath}/devices/wrong`)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
            .end(done);
        });
    });





});
