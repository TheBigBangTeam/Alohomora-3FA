"use strict";

const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const { ObjectId } = require('mongodb');

const router = express.Router();

const User = require('./../models/User');
const {authenticate} = require('./../middleware/authenticate-admin');

/*
  ADMIN API: route '/api/admin'
*/


/* MIDDLEWARE FOR AUTHENTICATION */
router.use(authenticate);

/* GET All users*/
router.get('/users', async (req, res) => {

  try {
    const users = await User.find();
    res.json({users});  
  } catch (error) {
    res.sendStatus(400);
  }

});

/* GET a single user by ID */
router.get('/users/:id', async (req, res) => {
  try {

    const user = await User.findById(req.params.id);
    if(!user) 
      return res.sendStatus(404);
    res.json({user});

  } catch (error) {
    res.sendStatus(400);
  }
});

/* SAVE user */
router.post('/users', async (req, res) => {
  const body = _.pick(req.body,      // pick makes sure only correct values are validated
                      ['username', // and not values that shouldn't be set
                      'name',
                      'surname',
                      'email',
                      'password',
                      'privilege',
                      'pin',
                      'rfidTag']
                    );
  try {
   
    const user = await User.create(body);
    res.json({user});

  } catch (error) {
    res.sendStatus(400);
  }
});

/* UPDATE user */
router.put('/users/:id', (req, res) => {
  let body = _.pick(req.body,      // pick makes sure only correct values are validated
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