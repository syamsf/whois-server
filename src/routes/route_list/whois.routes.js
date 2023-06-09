const express = require('express')
const router = express.Router()
const { domainWhois } = require('@controllers/whois.controller')

router.post('/', domainWhois)

module.exports = router