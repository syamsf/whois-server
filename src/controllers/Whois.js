const { domainChecker } = require('../services/domainChecker')
const ErrorResponse = require('../utils/errorResponse')

exports.domainWhois = async(req, res, next) => {
  try {
    const domainName = req.body.domain ?? ''
    const domainExtension = req.body.extension ?? []
    const checkPremiumDomain = req.body.validate_premium_domain ?? false

    if (domainName === '')
      throw new ErrorResponse('domain is required', 400)

    if (!domainExtension.length)
      throw new ErrorResponse('domain extension is required', 400)
  
    const whoisResult = await domainChecker(domainName.toLowerCase(), domainExtension)
    return res.status(200).json(whoisResult)
  } catch (error) {
    next(error)
  }
}