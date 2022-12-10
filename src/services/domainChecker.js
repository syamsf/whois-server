const { 
  fetchWebnicToken, 
  fetchLatestToken,
  isTokenExpired: tokenExpiredValidation
} = require('../services/webnic/token')
const { whoisDomain: doWhoisDomain } = require('../services/webnic/whois')
const { domainAvailabilityValidation } = require('../services/webnic/whoisParser')

exports.domainChecker = async(domainName) => {
  const webnicBaseUri = process.env.WEBNIC_BASE_URI
  const webnicAuth = {
    username: process.env.WEBNIC_USERNAME ?? '',
    password: process.env.WEBNIC_PASSWORD ?? ''
  }

  const latestToken = await fetchLatestToken()
  const isTokenExpired = latestToken ? tokenExpiredValidation(latestToken.token_expired_time) : true
  const tokenData = isTokenExpired ? await fetchWebnicToken(webnicBaseUri, webnicAuth) : latestToken 

  const webnicAttributes = {
    token: tokenData.access_token,
    domain: domainName
  }

  const whoisDomainRawResult = await doWhoisDomain(webnicBaseUri, webnicAttributes)
  const whoisServer = whoisDomainRawResult.whoisServer ?? 'unknown'
  const isDomainAvailable = domainAvailabilityValidation(whoisDomainRawResult.whoisResult)
  const whoisResult = {
    domain_name: domainName,
    whois_server: whoisServer,
    available: isDomainAvailable
  }

  return whoisResult
}