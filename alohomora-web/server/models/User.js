const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const argon2 = require('argon2');

const {settings} = require('./../settings');

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
    privilege: {
        type: String,
        enum: ['admin', 'technician', 'hr', 'security'],
        required:true
    },
    pin: { // Access pin
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
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    var user = this; // Document
    var access  = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, settings.jwtSecret).toString();

    user.tokens.push({access,token});

    return user.save()
    .then(() => {
        return token;
    });
};

UserSchema.methods.isAdmin = function () {
    var user = this;
    return user.privilege === 'admin' ? true : false;
};

UserSchema.statics.findByToken = function (token){
    var User = this; // Model
    var decoded;

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
    var User = this;

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

UserSchema.pre('save', function (next) {
    var user = this;

    if(user.isModified('password')){
        argon2.hash(user.password, settings.argon2)
              .then((hash) => {
                    user.password = hash;
                    next();
              })
    } else {
        next();
    }
});

module.exports = mongoose.model('User', UserSchema);