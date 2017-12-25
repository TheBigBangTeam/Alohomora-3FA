const express = require('express');
const _ = require('lodash');

var User = require('../models/User.js');
var {authenticate} = require('./../middleware/authenticate-user');

const router = express.Router();

/*
  USER API: route '/api/user'
*/

/* GET / self info */
router.get('/', authenticate, (req,res) => {
    res.send(req.user);
});

/* POST / login user */
router.post('/', (req,res) => {
    var body = _.pick(req.body, ['username', 'password']); // Additional protection from backdoors.
    User.findByCredentials(body.username, body.password)
        .then((user) => {
            return user.generateAuthToken().then((token) => {
                res.header('x-auth', token).send(user);
            })
        })
        .catch((err) => {
            res.sendStatus(400);
        });
});

/* DELETE / logout user */

router.delete('/',authenticate, (req,res) => {
    req.user.removeToken(req.token)
            .then(() => {
                res.sendStatus(200);
            })
            .catch(() => {
                res.sendStatus(400);
            });
});

module.exports = router;