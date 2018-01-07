'use strict'

const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const argon2 = require('argon2')

const {encryptAES} = require('./../utilities')
const {settings} = require('./../settings')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 5,
    validate: [{
      validator: value => validator.isEmail(value),
      message: '{VALUE} is not a valid email'
    }]
  },
  password: { // Stored as a hash value (argon2)
    type: String,
    required: true,
    minlength: 10
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  privileges: [{
    type: String,
    enum: ['admin', 'logs', 'stats']
  }],
  pin: { // Access pin stored as encrypted value
    type: String,
    required: true
  },
  rfidTag: { // Stored as a hash value (argon2) to prevent duplication of tag
    type: String,
    required: true,
    unique: true
  }
})

// OVERRIDE .toJSON
UserSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  return _.pick(userObject, ['_id', 'email', 'username', 'name', 'surname'])
}

UserSchema.methods.generateAuthToken = function () {
  const user = this // Document
  const token = jwt.sign({_id: user._id.toHexString(), privileges: user.privileges },
                            settings.JWT.secret,
                            {algorithm: settings.JWT.algorithm, expiresIn: settings.JWT.expiration, issuer: settings.JWT.issuer}
                          ).toString()

  return token
}

UserSchema.methods.isAdmin = function () {
  let user = this
  return user.privileges.includes('admin')
}

UserSchema.methods.hasLogsPermission = function () {
  let user = this
  return user.privileges.includes('logs')
}

UserSchema.statics.findByRfid = async function (rfid) {
  const User = this

  const encryptedTag = encryptAES(settings.AES.keyLength, settings.AES.mode, settings.AES.secret, rfid)
  const user = await User.findOne({rfidTag: encryptedTag})
  return (user)
}

UserSchema.statics.findByRfidAndPin = async function (rfid, pin) {
  const User = this

  const encryptedTag = encryptAES(settings.AES.keyLength, settings.AES.mode, settings.AES.secret, rfid)
  const encryptedPin = encryptAES(settings.AES.keyLength, settings.AES.mode, settings.AES.secret, pin)
  const user = await User.findOne({rfidTag: encryptedTag, pin: encryptedPin})
  return (user)
}

UserSchema.statics.findByCredentials = async function (username, password) {
  const User = this

  const user = await User.findOne({username})
  if (!user) {
    throw new Error()
  }

  const match = await argon2.verify(user.password, password)
  if (!match) {
    throw new Error()
  }

  return user
}

UserSchema.statics.findByToken = async function (token) {
  const User = this
  let decoded

  try {
    decoded = jwt.verify(token, settings.JWT.secret)
  } catch (error) {
    throw new Error()
  }

  let user = await User.findOne({
    _id: decoded._id,
    privilege: decoded.privilege
  })

  return user
}

UserSchema.pre('save', async function (next) {
  let user = this

  if (user.isModified('password')) user.password = await argon2.hash(user.password, settings.argon2)
  if (user.isModified('rfidTag')) user.rfidTag = encryptAES(settings.AES.keyLength, settings.AES.mode, settings.AES.secret, user.rfidTag)
  if (user.isModified('pin')) user.pin = encryptAES(settings.AES.keyLength, settings.AES.mode, settings.AES.secret, user.pin)

  next()
})

module.exports = mongoose.model('User', UserSchema)
