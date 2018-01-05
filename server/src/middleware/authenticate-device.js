'use strict'

const Device = require('./../models/Device')

/* MIDDLEWARE FOR AUTHENTICATION */

const authenticate = async (req, res, next) => {
  try {
    const device = await Device.findByToken(req.token)
    if (!device) {
      return res.sendStatus(401)
    }
    req.device = device
    next()
  } catch (error) {
    return res.sendStatus(401)
  }
}

module.exports = {authenticate}
