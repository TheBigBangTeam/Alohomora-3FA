'use strict'

const express = require('express')
const bearerToken = require('express-bearer-token')

const User = require('./../models/User')
const Log = require('./../models/Log')
const {authenticate} = require('./../middleware/authenticate-device')
const { notifyMail } = require('./../mailer')

const router = express.Router()

/* /api/authentication API FOR DOOR MECHANISM */

/* MIDDLEWARE TO FIND BEARER TOKEN */
router.use(bearerToken())

console.log('BEARER TOKEN PASSATO')
/* MIDDLEWARE FOR DEVICE AUTHENTICATION */
router.use(authenticate)

console.log('Authenticate PASSATO')
router.get('/:rfid', async (req, res) => {
  const user = await User.findByRfid(req.params.rfid)
  if (!user) {
    const log = {
      severity: 'warning',
      device: req.device._id,
      description: `!DENIED! PIN unlock at ${req.device.functionality} of ${req.device.description} at ${req.device.building} with RFID:${req.params.rfid}`
    }
    await Log.create(log)
    res.sendStatus(404)
    notifyMail(log.severity, log.description)
    
  } else {
    const log = {
      severity: 'info',
      device: req.device._id,
      user: user._id,
      description: `${user.username} succesfully unlocked PIN at ${req.device.functionality} of ${req.device.description} at ${req.device.building}`
    }
    await Log.create(log)
    res.sendStatus(200)
  }
})

router.get('/:rfid/:pin', async (req, res) => {
  const user = await User.findByRfidAndPin(req.params.rfid, req.params.pin)
  if (!user) {
    const log = {
      severity: 'warning',
      device: req.device._id,
      description: `!DENIED! DOOR unlock at ${req.device.functionality} of ${req.device.description} at ${req.device.building} with RFID:${req.params.rfid} and PIN ${req.params.pin}`
    }
    await Log.create(log)
    res.sendStatus(401)
    notifyMail(log.severity, log.description)
  } else {
    const log = {
      severity: 'info',
      device: req.device._id,
      user: user._id,
      description: `${user.username} succesfully unlocked DOOR at ${req.device.functionality} of ${req.device.description} at ${req.device.building}`
    }
    await Log.create(log)
    res.sendStatus(200)
  }
})

module.exports = router
