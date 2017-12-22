const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');

var User = require('../models/User.js');

/*
  ADMIN API: route '/api/admin'
*/

/* GET All users*/
router.get('/users', (req, res) => {
  User.find((err, users) => {
    if(err) return res.sendStatus(400);
    res.json({users});
  });
});

/* GET a single user by ID */
router.get('/users/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if(err) return res.sendStatus(400);
    if(!user) return res.sendStatus(404);
    res.json({user});
  });
});

/* SAVE user */
router.post('/users', (req, res) => {
  var body = _.pick(req.body, 
                      ['username',
                      'name',
                      'surname',
                      'email',
                      'password',
                      'workTask',
                      'pin',
                      //'rfidTag'
                      ]
                    );
  User.create(body, (err, user) => {
    if (err) return res.status(400).send(err);
    res.json({user});
  });
});

/* UPDATE user */
router.put('/users/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, (err, userUpdated) => {
    if (err) return res.sendStatus(400);
    res.json(userUpdated);
  });
});

/* DELETE user */
router.delete('/users/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id, req.body, (err, userDeleted) => {
    if (err) return res.sendStatus(400);
    res.json(userDeleted);
  });
});


module.exports = router;