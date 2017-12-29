"use strict";

const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const { ObjectId } = require('mongodb');
const bearerToken = require('express-bearer-token');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('./../models/User');
const Device = require('./../models/Device');
const {authenticate} = require('./../middleware/authenticate-admin');
const {settings} = require('./../settings');
/*
  ADMIN API: route '/api/admin'
*/

/* MIDDLEWARE TO FIND BEARER TOKEN */
router.use(bearerToken());

/* MIDDLEWARE FOR AUTHENTICATION */
router.use(authenticate);

/*
    ADMIN USERS API
*/

/* GET All users*/
router.get('/users', async (req, res) => {

  const users = await User.find();
  res.json({users});

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
router.put('/users/:id', async (req, res) => {
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
  
  try {
    let user = await User.findById(req.params.id);
    if(!user) return res.sendStatus(404);
    
    Object.assign(user, body);

    const updatedUser = await user.save(); 
    return res.json({user: updatedUser});
  } catch (error) {
      
    return res.sendStatus(400);
  }

});

/* DELETE user */
router.delete('/users/:id', async (req, res) => {
  if(!ObjectId.isValid(req.params.id)){
    return res.sendStatus(404);
  }

  const user = await User.findByIdAndRemove(req.params.id);
  if(!user) return res.sendStatus(404);
  res.json({user});
});

/*
    ADMIN DEVICES API
*/

/* CREATE DEVICE API */
router.post('/devices', async (req, res) => {
  const body = _.pick(req.body,      // pick makes sure only correct values are validated
                      ['building', // and not values that shouldn't be set
                      'description',]
                    );
  try {
   
    const device = await Device.create(body);
    const authToken = jwt.sign({_id: device._id.toHexString()}, settings.JWT.secret, {algorithm:settings.JWT.algorithm, issuer: settings.JWT.issuer}).toString(); 
    res.json({authToken, device});

  } catch (error) {
    res.sendStatus(400);
  }
});

/* GET DEVICES API */
router.get('/devices', async (req, res) => {

  const devices = await Device.find();
  res.json({devices});

});

/* GET SPECIFIC DEVICE API */
router.get('/devices/:id', async (req, res) => {
  try {

    const device = await Device.findById(req.params.id);
    if(!device) {
      return res.sendStatus(404);
    }
    
    res.json({device});

  } catch (error) {
    res.sendStatus(400);
  }

});

/* UPDATE SPECIFIC DEVICE*/
router.put('/devices/:id', async (req,res) => {
    const body = _.pick(req.body,['building', 'description']);
    try {
      const device = await Device.findByIdAndUpdate(req.params.id, {body}, {new: true, runValidators: true});
      if(!device) { 
        return res.sendStatus(404)
      };
      res.json({device});
    } catch (error) {
      res.sendStatus(400);
    }
});

/* DELETE SPECIFIC DEVICE */
router.delete('/devices/:id', async (req,res) => {
  if(!ObjectId.isValid(req.params.id)){
    return res.sendStatus(400);
  }
  
  const device = await Device.findByIdAndRemove(req.params.id);
  if(!device) return res.sendStatus(404);
  res.send({device});


});




module.exports = router;