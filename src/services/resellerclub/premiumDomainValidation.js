const axios = require('axios').default
const ErrorResponse = require('../../utils/errorResponse')

const premiumDomainValidation = async(resellerClubAttributes, domainName) => {
  const baseUri = resellerClubAttributes.base_uri ?? ''
  const apiKey = resellerClubAttributes.auth_key ?? ''
  const resellerId = resellerClubAttributes.reseller_id ?? ''

  if (domainName === '')
    throw new ErrorResponse('domain_name is required for premium domain validation', 400)

  if (baseUri === '' || apiKey === '' || resellerId === '' || resellerId === 0)
    throw new ErrorResponse('base_uri or api_key or reseller_id is required for premium domain validation', 400)
  
  const endpoint = `/api/domains/premium-check.json?auth-userid=${resellerId}&api-key=${apiKey}&domain-name=${domainName}`;
  const fullUri = `${baseUri}${endpoint}`
  
  const response = await axios.get(fullUri)
    .then((result) => result.data)
    .catch((result) => {
      const isResponseError = result.response.data?.status ?? 'ERROR'
      const responseErrorMessage = (isResponseError === 'ERROR') 
        ? result.response.data?.message ?? 'failed to lookup premium domain'
        : 'failed to lookup premium domain; no response from RC'
      
      return {        
        error_status: isResponseError,
        error_message: responseErrorMessage
      }
    })
  
  const isResponseError = ((response.error_status ?? '') === 'ERROR')
  if (isResponseError)
    return response.error_message
  
  const premiumStatus = ((response.premium ?? 'false') === 'true') && (response.status === 'SUCCESS')
  return premiumStatus
} 

module.exports = premiumDomainValidation