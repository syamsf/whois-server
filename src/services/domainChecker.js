const { 
  fetchWebnicToken, 
  fetchLatestToken,
  isTokenExpired: tokenExpiredValidation
} = require('../services/webnic/token')
const { whoisDomain: doWhoisDomain } = require('../services/webnic/whois')
const { domainAvailabilityValidation } = require('../services/webnic/whoisParser')
const ErrorResponse = require('../utils/errorResponse')

exports.domainChecker = async(domainName, domainExtension) => {
  const cleanDomainName = removeDomainSymbol(domainName)
  const webnicAuth = {
    username: process.env.WEBNIC_USERNAME ?? '',
    password: process.env.WEBNIC_PASSWORD ?? ''
  }

  const domainAttributes = {
    domain: cleanDomainName,
    extension: domainExtension
  }

  const whoisDomainRawResult = await promiseDomainChecker(domainAttributes, webnicAuth)
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

const domainWhoisLogic = async(domainAttributes, webnicAuth) => {
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

    return whoisResult
  })

  return massDomainWhois
}

const promiseDomainChecker = async(domainAttributes, webnicAuth) => {
  const massDomainWhois = await domainWhoisLogic(domainAttributes, webnicAuth)
  const whoisAggregateResult = await Promise.all(massDomainWhois)
    .then((value) => value)
    .catch((value) => {
      throw new ErrorResponse(value.message, 500)
    })

  return whoisAggregateResult
}