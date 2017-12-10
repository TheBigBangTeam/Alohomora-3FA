var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('../models/User.js');

/*
  ADMIN API: route '/api/admin'
*/

/* GET All users*/
router.get('/users', (req, res, next) => {
  User.find((err, users) => {
    if(err) return next(err);
    res.json(users);
  });
});

/* GET a single user by ID */
router.get('/users/:id', (req, res, next) => {
  User.findById(req.params.id, (err, userRequested) => {
    if(err) return next(err);
    res.json(userRequested);
  });
});

/* SAVE user */
router.post('/users', (req, res, next) => {
  User.create(req.body, (err, userCreated) => {
    if (err) return next(err);
    res.json(userCreated);
  });
});

/* UPDATE user */
router.put('/users/:id', (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body, (err, userUpdated) => {
    if (err) return next(err);
    res.json(userUpdated);
  });
});

/* DELETE user */
router.delete('/users/:id', (req, res, next) => {
  User.findByIdAndRemove(req.params.id, req.body, (err, userDeleted) => {
    if (err) return next(err);
    res.json(userDeleted);
  });
});


module.exports = router;