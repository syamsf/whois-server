const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cookieParse = require('cookie-parser')
const cors = require('cors')
const colors = require('colors')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/errorHandler')

// Load env config
dotenv.config({path: path.resolve(__dirname, './.env')})

// Current config
const ENVIRONMENT = process.env.NODE_ENV || 'development'

// Connect to DB
const connectDB = require('./config/db')
connectDB()

// Route files declaration
const whoisRouter = require('./routes/Whois')

// Initialize express
const app = express()

// Use body parser and cookie parser
app.use(express.json())
app.use(cookieParser())

// Middleware
if (ENVIRONMENT === 'development')
  app.use(morgan('dev'))

// Mount routers
app.use(whoisRouter)

// Mount middleware
app.use(errorHandler)

// Initialize servers
const PORT = process.env.PORT || 3000
const server = app.listen(
  PORT,
  console.log(`Server running in ${ENVIRONMENT} with port ${PORT}`)
)

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
})