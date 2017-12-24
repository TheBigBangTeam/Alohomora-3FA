const express = require('express');
const mongoose = require('mongoose');

const _ = require('lodash');
const { ObjectId } = require('mongodb');

const router = express.Router();

var User = require('../models/User.js');

/*
  ADMIN API: route '/api/admin'
*/


/* MIDDLEWARE FOR AUTHENTICATION */
var authenticate = (req, res ,next) => {
  var token = req.header('x-auth');

    User.findByToken(token)
    .then((user) => {
        if(!user) {
            return res.sendStatus(401);
        }

        // TODO Admin logic
        next();
    })
    .catch((e) => {
        return res.sendStatus(401);
    });
};

/* GET All users*/
router.get('/users', (req, res) => {
  User.find((err, users) => {
    if(err) return res.sendStatus(400);
    res.json({users});
  });
});

/* GET a single user by ID */
router.get('/users/:id', (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if(!user) return res.sendStatus(404);
      res.json({user});
    })
    .catch((err) => {
      res.sendStatus(400);
    });
});

/* SAVE user */
router.post('/users', (req, res) => {
  var body = _.pick(req.body,      // pick makes sure only correct values are validated
                      ['username', // and not values that shouldn't be set
                      'name',
                      'surname',
                      'email',
                      'password',
                      'privilege',
                      'pin',
                      'rfidTag'
                      ]
                    );
  User.create(body)
    .then((user) => {
      res.json({user});
    }).catch((err) => {
      res.status(400).send(err);
    });
});

/* UPDATE user */
router.put('/users/:id', (req, res) => {
  var body = _.pick(req.body,      // pick makes sure only correct values are validated
                    ['username', // and not values that shouldn't be set
                    'name',
                    'surname',
                    'email',
                    'password',
                    'privilege',
                    'pin',
                    'rfidTag'
                    ]
  );

  if(!ObjectId.isValid(req.params.id)){
    return res.sendStatus(404);
  }

  User.findByIdAndUpdate(req.params.id, body,{new: true, runValidators: true})
    .then((user) => {
      if(!user) return res.sendStatus(404); 
      res.json({user});
    }).catch((err) => {
      res.sendStatus(400);
    });
});

/* DELETE user */
router.delete('/users/:id', (req, res) => {
  if(!ObjectId.isValid(req.params.id)){
    return res.sendStatus(404);
  }

  User.findByIdAndRemove(req.params.id, req.body)
  .then((user) => {
    if(!user) return res.sendStatus(404);
    res.json({user});
  })
  .catch((err) => {
    res.sendStatus(400);
  });
});


module.exports = router;