const express = require('express');
const Promise = require('bluebird');
const _ = require('lodash');

var User = require('../models/User.js');
var {authenticate} = require('./../middleware/authenticate-user');

const router = express.Router();

/*
  USER API: route '/api/user'
*/

/* GET self info */
router.get('/', authenticate, (req,res) => {
    res.send(req.user);
});

/* POST login user */
router.post('/', (req,res) => {
    var body = _.pick(req.body, ['username', 'password']);

    User.findOne({username: body.username})
        .then((user) => {
            if(!user) {
                return Promise.reject();
            }
            if(user.password === body.password){
              return user.generateAuthToken();
            } else {
                return Promise.reject();
            }
                
        })
        .then((token) => {
            res.header('x-auth', token);
            res.sendStatus(200);
        })
        .catch((err) => {
            res.sendStatus(404);
        });
});

module.exports = router;