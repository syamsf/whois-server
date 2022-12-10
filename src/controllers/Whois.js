const { domainChecker } = require('../services/domainChecker')
const ErrorResponse = require('../utils/errorResponse')

exports.domainWhois = async(req, res, next) => {
  try {
    const domainName = req.query.domain ?? ''

    if (domainName === '')
      throw new ErrorResponse('domain is required', 400)
  
    const whoisResult = await domainChecker(domainName)
    return res.status(200).json(whoisResult)
  } catch (error) {
    next(error)
  }
}