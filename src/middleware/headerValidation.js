const ErrorResponse = require("@utils/error_response")

const validateHeader = (req, res, next) => {
  try {
    if (req.get('Origin')) {
      next()
      return
    }

    const headerName = 'X-WHOIS-HEADER-AUTH'
    const { headers } = req

    if (!headers)
      throw new ErrorResponse("header is empty", 400)

    const authHeader = headers[headerName.toLowerCase()]
    if (!authHeader)
      throw new ErrorResponse("header whois_auth is not exist", 400)

    const currentAuth = process.env.HEADER_AUTH || ""
    if (!currentAuth)
      throw new ErrorResponse("header auth is not present", 500)

    if (currentAuth != authHeader)
      throw new ErrorResponse("header auth is invalid", 401)

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = validateHeader