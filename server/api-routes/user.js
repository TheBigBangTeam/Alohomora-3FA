"use strict";

const express = require('express');
const _ = require('lodash');
const bearerToken = require('express-bearer-token');

const User = require('../models/User.js');
const {authenticate} = require('./../middleware/authenticate-user');

const router = express.Router();

/*
  USER API: route '/api/user'
*/

/* GET / self info */
router.get('/', bearerToken(), authenticate, (req,res) => {
    res.send(req.user);
});
/* POST / login user */
router.post('/', async (req,res) => {
    const body = _.pick(req.body, ['username', 'password']);

    try {
        const user = await User.findByCredentials(body.username, body.password);
        const token = await user.generateAuthToken();
        return res.json({user, token});
    } catch (error) {
        return res.sendStatus(400);
    }
});

module.exports = router;