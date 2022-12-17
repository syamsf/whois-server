const { 
  fetchWebnicToken, 
  fetchLatestToken,
  isTokenExpired: tokenExpiredValidation
} = require('../services/webnic/token')
const { whoisDomain: doWhoisDomain } = require('../services/webnic/whois')
const { domainAvailabilityValidation } = require('../services/webnic/whoisParser')
const premiumDomainValidation = require('../services/resellerclub/premiumDomainValidation')
const ErrorResponse = require('../utils/errorResponse')

exports.domainChecker = async(domainName, domainExtension, domainWhoisAttributes) => {
  const cleanDomainName = removeDomainSymbol(domainName)

  const webnicAuth = {
    username: process.env.WEBNIC_USERNAME ?? '',
    password: process.env.WEBNIC_PASSWORD ?? ''
  }

  const domainAttributes = {
    domain: cleanDomainName,
    extension: domainExtension,
    premium_validation: domainWhoisAttributes.premium_validation
  }

  const resellerClubAttributes = {
    base_uri: process.env.RC_BASE_URI ?? '',
    auth_key: process.env.RC_API_KEY ?? '',
    reseller_id: parseInt(process.env.RC_RESELLER_ID)  ?? ''
  }

  const whoisDomainRawResult = await promiseDomainChecker(
    domainAttributes, 
    webnicAuth, 
    resellerClubAttributes
  )

  const whoisResult = {
    code: 200,
    data: {
      domains: whoisDomainRawResult
    }
  }

  return whoisResult
}

const removeDomainSymbol = (domainName) => {
  const cleanedDomainName = domainName.split('.')
  return cleanedDomainName[0]
}

const domainWhoisLogic = async(domainAttributes, webnicAuth, resellerClubAttributes) => {
  const massDomainWhois = domainAttributes.extension.map(async(value) => {
    // Token request and validation
    const webnicBaseUri = process.env.WEBNIC_BASE_URI
    const latestToken = await fetchLatestToken()
    const isTokenExpired = latestToken ? tokenExpiredValidation(latestToken.token_expired_time) : true
    const tokenData = isTokenExpired ? await fetchWebnicToken(webnicBaseUri, webnicAuth) : latestToken 

    // Build parameter
    const domainName = domainAttributes.domain
    const cleanExtensionValue = value.replace('.', '')
    const fullDomainName =`${domainName}.${cleanExtensionValue}`
    const webnicAttributes = {
      token: tokenData.access_token,
      base_url: webnicBaseUri,
      domain: fullDomainName
    }

    // Do whois process
    const whoisDomainRawResult = await doWhoisDomain(webnicAttributes)
    const whoisServer = whoisDomainRawResult.whoisServer ?? 'unknown'
    const isDomainAvailable = domainAvailabilityValidation(whoisDomainRawResult.whoisResult)

    const whoisResult = {
      domain_name: fullDomainName,
      whois_server: whoisServer,
      availability: isDomainAvailable
    }

    // Domain premium validation
    const validatePremiumDomain = domainAttributes.premium_validation
    if (validatePremiumDomain) {
      const premiumDomainStatus = await premiumDomainValidation(
        resellerClubAttributes, 
        fullDomainName
      )

      whoisResult.premium_domain_status = premiumDomainStatus
    }

    return whoisResult
  })

  return massDomainWhois
}

const promiseDomainChecker = async(domainAttributes, webnicAuth, resellerClubAttributes) => {
  const massDomainWhois = await domainWhoisLogic(
    domainAttributes, 
    webnicAuth, 
    resellerClubAttributes
  )

  const whoisAggregateResult = await Promise.all(massDomainWhois)
    .then((value) => value)
    .catch((value) => {
      throw new ErrorResponse(value.message, 500)
    })

  return whoisAggregateResult
}