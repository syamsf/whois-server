const cors = require('cors')
const validateHeader = require("@middleware/headerValidation")
// const whitelistIP = require("@middleware/whitelistIP")

const securityConfig = (app, environment) => {
  const whitelistCors = [
    'http://yoursite.com',
    'https://yoursite.com',
    'https://www.yoursite.com',
  ]

  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || whitelistCors.indexOf(origin) !== -1) {
        callback(null, true)
      } else if (/\.jagoanhosting\.com$/.test(origin)) { 
        callback(null, true)
      } else if (!origin) {
        callback(null, true)
      } else {
        callback(new Error('Bad request'))
      }
    }
  }

  if (environment === 'development') {
    app.use(cors())
  } else {
    app.use(cors(corsOptions))
  }

  app.use(validateHeader)
}

module.exports = securityConfig