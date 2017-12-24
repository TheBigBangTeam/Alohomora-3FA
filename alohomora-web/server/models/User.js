const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique:true
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
    password: {
        type: String,
        required:true,
        minlength: 10
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    name: {
        type: String,
        required:true
    },
    surname: {
        type: String,
        required:true
    },
    workTask: {
        type: String,
        required:true
    },
    pin: {
        type: String,
        required: true
    },
    // rfidTag:{
    //     type: String,
    //     required:true
    // } 
});

// OVERRIDE .toJSON
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access  = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({access,token});

    user.save().then(() => {
        return token;
    });
};

module.exports = mongoose.model('User', UserSchema);