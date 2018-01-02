"use strict";

const request = require('supertest');
const chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should();
const jwt = require('jsonwebtoken');

const {users, devices, logs, populateDevices, populateUsers, populateLogs} = require('./../seed/seed');
const {app} = require('./../../../server/index');
const {settings} = require('./../../settings');

const logsPath = '/api/logs';

const token = jwt.sign({_id: users[2]._id.toHexString(), privilege: users[2].privilege}, 
                            settings.JWT.secret, 
                            {algorithm:settings.JWT.algorithm, expiresIn: settings.JWT.expiration, issuer: settings.JWT.issuer}
                            ).toString();

describe('[*] LOG API TEST', () => {
    beforeEach(populateUsers);
    beforeEach(populateDevices);
    beforeEach(populateLogs);

    it('should return all logs to the admin', (done) => {
        request(app)
        .get(`${logsPath}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
            if(err) return done('Error on request')
            expect(res.body.logs.length).to.equal(logs.length);
            done();
        });
    });
});