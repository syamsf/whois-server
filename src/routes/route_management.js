const express = require("express")
const router = express.Router()

// Route files declaration
const whoisRoute = require('@routes/route_list/whois.routes')

// Mount the routes
router.use('/whois', whoisRoute)

module.exports = router