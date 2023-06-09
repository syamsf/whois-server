const { 
  fetchWebnicToken, 
  fetchLatestToken,
  isTokenExpired: tokenExpiredValidation
} = require('../services/webnic/token')
const { whoisDomain: doWhoisDomain } = require('../services/webnic/whois')
const { domainAvailabilityValidation } = require('../services/webnic/whoisParser')
const premiumDomainValidation = require('../services/resellerclub/premiumDomainValidation')
const ErrorResponse = require('../utils/error_response')

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
    meta: {
      code: 200,
      success: true
    },
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
  const uniqueListDomainExtension = [...new Set(domainAttributes.extension)]

  const massDomainWhois = uniqueListDomainExtension.map(async(value) => {
    const isExtensionValid = !/[-!$%^&*()_+|~=`{}\[\]:";'<>?,\/\s]/.test(value)
    if (!isExtensionValid)
      throw new ErrorResponse(`extension is not valid '${value}'`, 400)

    // Token request and validation
    const webnicBaseUri = process.env.WEBNIC_BASE_URI
    const latestToken = await fetchLatestToken()
    const isTokenExpired = latestToken ? tokenExpiredValidation(latestToken.token_expired_time) : true
    const tokenData = isTokenExpired ? await fetchWebnicToken(webnicBaseUri, webnicAuth) : latestToken 

    // Build parameter
    const domainName = domainAttributes.domain
    const cleanExtensionValue = trimDotForFirstAndLastElement(value)
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
      available: isDomainAvailable
    }

    // Domain premium validation
    const validatePremiumDomain = domainAttributes.premium_validation
    if (validatePremiumDomain) {
      whoisResult.premium_domain = {
        status: null,
        message: null
      }

      if (isDomainId({extension: value})) {
        const domainIdPremiumResult = domainIdPremiumChecker({extension: value, domain: domainName})
        
        whoisResult.premium_domain.status    = domainIdPremiumResult.premium.status 
        whoisResult.premium_domain.message   = domainIdPremiumResult.premium.message
        whoisResult.premium_domain.price     = domainIdPremiumResult.premium.price
        whoisResult.premium_domain.extension = domainIdPremiumResult.premium.extension
      } else {
        const premiumDomainStatus = await premiumDomainValidation(
          resellerClubAttributes, 
          fullDomainName
        )
  
        const premiumDomainStatusBool = (typeof premiumDomainStatus === "boolean")
          ? premiumDomainStatus : false
  
        const premiumDomainDescription = (typeof premiumDomainStatus === "boolean")
          ? `Premium domain checking is supported, result is ${premiumDomainStatus}`
          : premiumDomainStatus
  
        whoisResult.premium_domain.status = premiumDomainStatusBool 
        whoisResult.premium_domain.message = premiumDomainDescription 
      }
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

const domainIdExtension = [
  "id", "my.id", "web.id", "gov.id", "co.id", "sch.id", 
  "ac.id", "or.id", "biz.id", "ponpes.id"
]

const isDomainId = ({extension}) => domainIdExtension.includes(extension)

const domainIdPremiumChecker = ({extension, domain}) => {  
  const response = {
    premium: {
      status: false,
      extension: extension,
      description: "Premium domain checking is not supported",
      price: 0
    }
  }

  if (!isDomainId({extension: extension}))
    return response

  const priceRule = {
    "id": {
      "4 char": 2500000,
      "3 char": 15000000,
      "2 char": 500000000 
    },
    "non_id": {
      "2 char": 15000000
    }
  }

  const totalChar = domain.length
  response.premium.price = priceRule[extension]
    ? priceRule[extension][`${totalChar} char`] ?? 0
    : priceRule['non_id'][`${totalChar} char`] ?? 0

  response.premium.status = (response.premium.price) ? true : false
  response.premium.message = "Premium domain checking is supported"

  return response
}

const trimDotForFirstAndLastElement = (word) => {
  // Remove first character if dot is detected
  if (word.charAt(0) === '.') {
    word = word.substring(1);
  }

  // Remove last character if dot is detected
  if (word.charAt(word.length - 1) === '.') {
    word = word.substring(0, word.length - 1);
  }

  return word
}