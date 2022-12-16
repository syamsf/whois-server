const express = require('express')
const router = express.Router()
const { domainWhois } = require('../controllers/Whois')

router.post('/whois', domainWhois)

module.exports = router