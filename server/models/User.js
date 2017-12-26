"use strict";

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const argon2 = require('argon2');

const {settings} = require('./../settings');

const UserSchema = new mongoose.Schema({
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
    password: { // Stored as a hash value (argon2)
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
    privilege: {
        type: String,
        enum: ['admin', 'technician', 'hr', 'security', 'worker'],
        required:true
    },
    pin: { // Access pin stored as a hash value
        type: String,
        required: true
    },
    rfidTag:{
        type: String,
        required:true,
        unique: true
    }
});

// OVERRIDE .toJSON
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = async function () {
    const user = this; // Document
    const access  = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, settings.jwtSecret).toString();

    user.tokens.push({access,token});
    
    try {
        await user.save();
        return token;   
    } catch (error) {
        throw new Error();
    }
};

UserSchema.methods.isAdmin = function () {
    let user = this;
    return user.privilege === 'admin' ? true : false;
};

UserSchema.methods.removeToken = function (token) {
    let user = this;

    return user.update({
        $pull: {
            tokens: {
                token
            }
        }
    });
};

UserSchema.statics.findByToken = function (token){
    let User = this; // Model
    let decoded;

    try {
        decoded = jwt.verify(token, settings.jwtSecret);
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (username, password){
    let User = this;

    return User.findOne({username})
               .then((user) => {
                   if(!user){
                       return Promise.reject();
                   }

                   return new Promise((resolve, reject) => {
                        argon2.verify(user.password, password)
                        .then((match) => {
                            if(!match) {
                                reject();
                            }
                            resolve(user);
                        });
                   });
               });
};

UserSchema.pre('save', async function (next) {
    let user = this;

    if(user.isModified('password')){
        user.password = await argon2.hash(user.password, settings.argon2);
    }
    
    next();
});

module.exports = mongoose.model('User', UserSchema);