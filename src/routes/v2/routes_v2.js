const express = require("express")
const router = express.Router()
const { whois, bulkWhois } = require("@controllers/whois_v2.controller")

router.post("/whois", whois)
router.post("/bulk-whois", bulkWhois)

module.exports = router
