'use strict'

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const config = require('config')

const DeviceSchema = new mongoose.Schema({
  building: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  functionality: {
    type: String,
    enum: ['Entrance', 'Exit'],
    required: true
  }
})

// OVERRIDE .toJSON
DeviceSchema.methods.toJSON = function () {
  const device = this
  const deviceObject = device.toObject()

  return _.pick(deviceObject, ['_id', 'building', 'description', 'functionality'])
}

DeviceSchema.statics.findByToken = async function (token) {
  const Device = this
  let decoded

  try {
    decoded = jwt.verify(token, config.get('Settings.JWT.secret'))
  } catch (error) {
    throw new Error()
  }
  const device = await Device.findById(decoded._id)
  return (device)
}

module.exports = mongoose.model('Device', DeviceSchema)
