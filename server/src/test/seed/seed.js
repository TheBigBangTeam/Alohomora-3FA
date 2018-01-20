'use strict'

const {ObjectId} = require('mongodb')
const jwt = require('jsonwebtoken')
const config = require('config')

const User = require('./../../models/User')
const Device = require('./../../models/Device')
const Log = require('./../../models/Log')

const user0Id = new ObjectId()
const user1Id = new ObjectId()
const adminId = new ObjectId()

const users = [{
  _id: user0Id,
  username: 'user0',
  name: 'user',
  surname: 'zero',
  email: 'user0@example.com',
  password: 'longpassword',
  privileges: [],
  pin: '1234',
  rfidTag: '1'
}, {
  _id: user1Id,
  username: 'user1',
  name: 'user',
  surname: 'one',
  email: 'user1@example.com',
  password: 'longlongpassword',
  privileges: ['logs', 'stats'],
  pin: '6578',
  rfidTag: '2'
}, {
  _id: adminId,
  username: 'admin',
  name: 'Adminio',
  surname: 'Surminio',
  email: 'admin@expample.com',
  password: 'longpassword',
  privileges: ['admin'],
  pin: '1337',
  rfidTag: '1377'
}]

const device0Id = new ObjectId()
const device1Id = new ObjectId()

const devices = [{
  _id: device0Id,
  building: 'Home',
  description: 'Main entrance',
  functionality: 'Entrance'
}, {
  _id: device1Id,
  building: 'Office',
  description: 'Backdoor',
  functionality: 'Exit'
}]

const log0Id = new ObjectId()
const log1Id = new ObjectId()
const log2Id = new ObjectId()

const logs = [{
  _id: log0Id,
  severity: 'info',
  device: device0Id,
  user: user0Id,
  description: 'Succesful access'
}, {
  _id: log1Id,
  severity: 'warning',
  device: device1Id,
  user: user1Id,
  description: 'Wrong pin'
}, {
  _id: log2Id,
  severity: 'fatal',
  description: 'Cannot communicate to device'
}]

const populateUsers = (done) => {
  User.remove({})
        .then(() => {
          let userOnePromise = User.create(users[0])
          let userTwoPromise = User.create(users[1])
          let adminUserPromise = User.create(users[2])
          return Promise.all([userOnePromise, userTwoPromise, adminUserPromise])
        })
        .then(() => done())
}

const populateDevices = (done) => {
  Device.remove({})
    .then(() => {
      let deviceOnePromise = Device.create(devices[0])
      let deviceTwoPromise = Device.create(devices[1])
      return Promise.all([deviceOnePromise, deviceTwoPromise])
    })
    .then(() => done())
}

const populateLogs = (done) => {
  Log.remove({})
    .then(() => {
      let logOnePromise = Log.create(logs[0])
      let logTwoPromise = Log.create(logs[1])
      let logThreePromise = Log.create(logs[2])
      return Promise.all([logOnePromise, logTwoPromise, logThreePromise])
    })
    .then(() => done())
}

const populateTokens = () => {
  const tokenAdmin = jwt.sign({_id: users[2]._id.toHexString(), privileges: users[2].privileges},
                                  config.get('Settings.JWT.secret'), {algorithm: config.get('Settings.JWT.algorithm'), expiresIn: config.get('Settings.JWT.expiration'), issuer: config.get('Settings.JWT.issuer')}
                                  ).toString()

  const notAuthorizedToken = jwt.sign({_id: users[0]._id.toHexString(), privileges: users[0].privileges},
                                  config.get('Settings.JWT.secret'), {algorithm: config.get('Settings.JWT.algorithm'), expiresIn: config.get('Settings.JWT.expiration'), issuer: config.get('Settings.JWT.issuer')}
                                  ).toString()
  const authorizedToken = jwt.sign({_id: users[1]._id.toHexString(), privileges: users[1].privileges},
                                  config.get('Settings.JWT.secret'), {algorithm: config.get('Settings.JWT.algorithm'), expiresIn: config.get('Settings.JWT.expiration'), issuer: config.get('Settings.JWT.issuer')}
                                  ).toString()
  const nonExistentId = new ObjectId()
  const nonExistentUserToken = jwt.sign({_id: nonExistentId.toHexString(), privileges: users[2].privileges},
                                                              config.get('Settings.JWT.secret'), {algorithm: config.get('Settings.JWT.algorithm'), expiresIn: config.get('Settings.JWT.expiration'), issuer: config.get('Settings.JWT.issuer')}
                                                              ).toString()
  return {tokenAdmin, notAuthorizedToken, authorizedToken, nonExistentUserToken}
}

const createTestTransporter = () => {
  let transporter
  nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }

    // Create a SMTP transporter object
        transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });

  });

  return transporter
}

module.exports = {users, devices, logs, populateUsers, populateDevices, populateLogs, populateTokens, createTestTransporter}
