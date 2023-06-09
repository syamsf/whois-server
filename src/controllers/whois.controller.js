const { domainChecker } = require('@services/domainChecker')
const ErrorResponse = require('@utils/error_response')
const asyncHandler = require('@utils/async_handler')

exports.domainWhois = asyncHandler(async(req, res) => {
  const domainName = req.body.domain ?? ''
  const domainExtension = req.body.extension ?? []
  const checkPremiumDomain = req.body.validate_premium_domain ?? false

  // TODO: refactor to use joi
  // https://www.npmjs.com/package/joi
  if (domainName === '')
    throw new ErrorResponse('domain is required', 400)

  if (!domainExtension.length)
    throw new ErrorResponse('domain extension is required', 400)

  const whoisAttributes = { premium_validation: checkPremiumDomain }
  const whoisResult = await domainChecker(domainName.toLowerCase(), domainExtension, whoisAttributes)
  return res.status(200).json(whoisResult)
})