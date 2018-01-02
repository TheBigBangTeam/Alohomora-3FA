'use strict'

const mongoose = require('mongoose'),
  Schema = mongoose.Schema

const LogSchema = new mongoose.Schema({
  severity: {
    type: String,
    require: true,
    enum: ['info', 'warning', 'fatal']
  },
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  description: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Log', LogSchema)
