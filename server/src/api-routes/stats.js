'use strict'

const express = require('express')
const bearerToken = require('express-bearer-token')

const router = express.Router()
const {authenticate} = require('./../middleware/authenticate-stats')
const Log = require('./../models/Log')

/* /api/logs API to interact with logs */

router.use(bearerToken())
router.use(authenticate)

// GET all stats
router.get('/', async (req, res) => {
  const logs = await Log.find({})
  res.json({
    'total_actions': logs.length,
    'total_warnings': logs.filter((log) => log.severity === 'warning').length,
    'total_info': logs.filter((log) => log.severity === 'info').length,
    'total_fatal': logs.filter((log) => log.severity === 'fatal').length
  })
})

module.exports = router
