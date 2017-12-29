"use strict";

const express = require('express');
const bearerToken = require('express-bearer-token');

const User = require('./../models/User');
const {authenticate} = require('./../middleware/authenticate-device');

const router = express.Router();

/* /api/authentication API FOR DOOR MECHANISM */

/* MIDDLEWARE TO FIND BEARER TOKEN */
router.use(bearerToken());

/* MIDDLEWARE FOR DEVICE AUTHENTICATION */
router.use(authenticate);

router.get('/:rfid', async (req, res) => {
    try {
        const user = await User.findByRfid(req.params.rfid);
        if(!user) return res.sendStatus(401);
        res.sendStatus(200);
        
    } catch (error) {
        res.sendStatus(400);
    }
});

router.get('/:rfid/:pin', async (req, res) => {
    try {
        const user = await User.findByRfidAndPin(req.params.rfid, req.params.pin);
        if(!user) return res.sendStatus(401);
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(400);
    }
});


module.exports = router;