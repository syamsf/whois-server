const morgan = require('morgan')
const moment = require('moment-timezone')

const morganLogger = (app) => {
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

  app.use(morgan(':method [:time[Asia/Jakarta]] - :status - :ip - ":url" "HTTP/:http-version" - :res[content-length] ":referrer" ":user-agent" :total-time[2] ms'))
} 

module.exports = morganLogger