const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cookieParse = require('cookie-parser')
const cors = require('cors')
const colors = require('colors')
const cookieParser = require('cookie-parser')
const moment = require('moment-timezone')

// Custom middleware
require('module-alias/register')
const errorHandler = require('@middleware/error_handler')
// const whitelistIP = require("@middleware/whitelistIP")

// Load env config
dotenv.config({path: path.resolve(__dirname, '../.env')})

// Connect to DB
const connectDB = require('@config/db')
connectDB()

// Current config
const ENVIRONMENT = process.env.NODE_ENV || 'development'

// Initialize express
const app = express()

// Use body parser, cookie parser
app.use(express.json({limit: '2mb'}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

// https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', true)

// Morgan token
// Custom token function to extract the IP address without the ::ffff: prefix
morgan.token('ip', function(req, res) {
  const ipAddress = req.ip
  
  if (ipAddress.startsWith('::ffff:'))
    return ipAddress.substr(7)
  
  return ipAddress
})

morgan.token('time', (req, res, tz) => {
  return moment().tz(tz).format();
})
moment.tz.setDefault('Asia/Jakarta')

// Middleware
if (ENVIRONMENT === 'development')
  app.use(morgan(':ip - :method ":url" "HTTP/:http-version" :status - :res[content-length] ":referrer" ":user-agent" [:time[Asia/Jakarta]] :total-time[2] ms'))

// Enable custom middleware
// app.use(whitelistIP)

// Router handler
const router = require('@routes/route_management')
app.use('/api/v1', router)

// Public storage handler
app.use('/public', express.static(__dirname + '/public'))

// Mount middleware
app.use(errorHandler)

// Set blank page if it's 404
app.use((req, res) => res.status(404).send(''))

module.exports = {
  app: app,
  environment: ENVIRONMENT
}