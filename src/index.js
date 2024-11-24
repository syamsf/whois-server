const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const timeout = require('connect-timeout')
const cookieParser = require('cookie-parser')

// Custom middleware
require('module-alias/register')
const errorHandler = require('@middleware/error_handler')

// Load env config
dotenv.config({path: path.resolve(__dirname, '../.env')})

// Connect to DB
const connectDB = require('@config/db')
connectDB()

// Current config
const ENVIRONMENT = process.env.NODE_ENV || 'development'

// Initialize express
const app = express()

// Timeout handler
app.use(timeout('180s'))
app.use((req, res, next) => {
  if (!req.timedout) next()
})

app.use((req, res, next) => {
  if (!req.timedout) next()
})


// Use body parser, cookie parser
app.use(express.json({limit: '2mb'}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

// https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', true)

// Enable custom middleware
require("@config/morgan")(app)
require("@config/security")(app, ENVIRONMENT)

// Router handler
const router = require('@routes/route_management')
const routerV2 = require('@routes/v2/routes_v2')
app.use('/api/v1', router)
app.use('/api/v2', routerV2)

// Public storage handler
app.use('/public', express.static(__dirname + '/public'))

// Mount middleware
app.use((err, req, res, next) => {
  if (req.timedout) {
    res.status(503).send('Request timed out. Please try again later.')
  } else {
    next(err)
  }
})

app.use(errorHandler)

// Set blank page if it's 404
app.use((req, res) => res.status(404).send(''))

module.exports = {
  app: app,
  environment: ENVIRONMENT
}
