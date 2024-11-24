const express = require('express')
const router = express.Router()

const { brainstorm } = require('@controllers/namestudio.controller')

router.get('/brainstorm', brainstorm)

module.exports = router