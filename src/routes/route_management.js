const express = require("express")
const router = express.Router()

// Route files declaration
const whoisRoute = require('@routes/route_list/whois.routes')
const namestudioRoute = require('@routes/route_list/namestudio.routes')

// Mount the routes
router.use('/whois', whoisRoute)
router.use(namestudioRoute)

module.exports = router