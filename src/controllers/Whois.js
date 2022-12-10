const { domainChecker } = require('../services/domainChecker')

exports.domainWhois = async(req, res, next) => {
  const domainName = req.query.domain ?? ''

  if (domainName === '')
    return res.status(400).json({status: "error"})

  const whoisResult = await domainChecker(domainName)
  return res.status(200).json(whoisResult)
}