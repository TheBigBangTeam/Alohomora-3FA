'use strict'

const Device = require('./../models/Device')

/* MIDDLEWARE FOR DEVICE AUTHENTICATION */

const authenticate = async (req, res, next) => {
  try {
    const device = await Device.findByToken(req.token)
    if (!device) {
      console.log('Device non trovato')
      return res.sendStatus(401)
    }
    req.device = device
    next()
  } catch (error) {
    console.log('Errore database')
    return res.sendStatus(401)
  }
}

module.exports = {authenticate}
