'use strict'

const express = require('express')
const bearerToken = require('express-bearer-token')

const router = express.Router()
const {authenticate} = require('./../middleware/authenticate-logs')
const Log = require('./../models/Log')

/* /api/logs API to interact with logs */

router.use(bearerToken())
router.use(authenticate)

router.get('/', async (req, res) => {
  const logs = await Log.find()
  res.json({logs})
})

module.exports = router
