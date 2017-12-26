"use strict";

const express = require('express');
const _ = require('lodash');

const User = require('../models/User.js');
const {authenticate} = require('./../middleware/authenticate-user');

const router = express.Router();

/*
  USER API: route '/api/user'
*/

/* GET / self info */
router.get('/', authenticate, (req,res) => {
    res.send(req.user);
});

/* POST / login user */
router.post('/', async (req,res) => {
    const body = _.pick(req.body, ['username', 'password']);

    try {
        const user = await User.findByCredentials(body.username, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send({user});
    } catch (error) {
        res.sendStatus(400);
    }
});

/* DELETE / logout user */

router.delete('/',authenticate, async (req,res) => {
    try {
        await req.user.removeToken(req.token)
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(400);
    }
    
    
});

module.exports = router;