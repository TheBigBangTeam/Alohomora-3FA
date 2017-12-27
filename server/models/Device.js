"use strict";

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cryptoRandomString = require('crypto-random-string');
const _ = require('lodash');

const {encryptAES} = require('./../utilities');
const {settings} = require('./../settings');

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
    alohomora_ok: {
        type: String,
        required: true,
        minlength: 16
    }
});

// OVERRIDE .toJSON
DeviceSchema.methods.toJSON = function () {
    const device = this;
    const deviceObject = user.toObject();

    return _.pick(userObject, ['_id', 'building','descriptiom']);
};

DeviceSchema.methods.generateAuthToken = function() {
    const device = this; // Document
    const token = jwt.sign({_id: device._id.toHexString()}, 
                            settings.JWT.secret, 
                            {algorithm:settings.JWT.algorithm, issuer: settings.JWT.issuer}
                          ).toString();

    return token;
};

module.exports = mongoose.model('Device', DeviceSchema);