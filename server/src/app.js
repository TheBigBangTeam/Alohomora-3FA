'use strict'

const express = require('express')
const path = require('path')
const helmet = require('helmet')
const bodyParser = require('body-parser')
//const morgan = require('morgan')

const checkRoute = require('./middleware/check-route')
const {dbConnect} = require('./db')

/* SERVER & PARAMETERS */
const app = express()

/* SECURITY */
app.use(helmet())

/* LOGGING */
//app.use(morgan('combined'))

/* MISCELLANEOUS */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({'extended': true}))

/* DATABASE */
dbConnect().catch((e) => {
  console.log(e.message)
  process.exit(1)
})

/* ROUTES */

// Routers
const adminRoute = require('./api-routes/admin')
const userRoute = require('./api-routes/user')
const authenticationRoute = require('./api-routes/authentication')
const logsRoute = require('./api-routes/logs')
const statsRoute = require('./api-routes/stats')

// Server static assets
if (process.env.NODE_ENV === 'production') app.use(express.static(path.join(__dirname, 'app', 'build')))

// Admin API
app.use('/api/admin', adminRoute)

// User API
app.use('/api/user', userRoute)

// Doorlock authentication API
app.use('/api/authenticate', authenticationRoute)

// Logs API
app.use('/api/logs', logsRoute)

// Stats API
app.use('/api/stats', statsRoute)

// Middleware to catch errors
app.use(checkRoute)

module.exports = {app}
