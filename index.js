'use strict'

const express = require('express')
const path = require('path')
const helmet = require('helmet')
const bodyParser = require('body-parser')

const {setEnvironment} = require('./server/environment')
const checkRoute = require('./server/middleware/check-route')
const {startServer} = require('./server/server')
const {dbConnect} = require('./server/db')

/* NODE ENVIRONMENT */
const env = process.env.NODE_ENV
setEnvironment(env)

/* SERVER & PARAMETERS */
const app = express()
const port = process.env.PORT
const tls = process.env.TLS || 'no'

/* SECURITY */
app.use(helmet())

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
const adminRoute = require('./server/api-routes/admin')
const userRoute = require('./server/api-routes/user')
const authenticationRoute = require('./server/api-routes/authentication')
const logsRoute = require('./server/api-routes/logs')

// Server static assets
app.use(express.static(path.join(__dirname, 'app', 'build')))

// Admin API
app.use('/api/admin', adminRoute)

// User API
app.use('/api/user', userRoute)

// Doorlock authentication API
app.use('/api/authenticate', authenticationRoute)

// Logs API
app.use('/api/logs', logsRoute)

// Middleware to catch errors
app.use(checkRoute)

startServer(app, tls, port)

module.exports = {app}
