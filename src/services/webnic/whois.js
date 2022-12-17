const axios = require('axios').default
const ErrorResponse = require('../../utils/errorResponse')

exports.whoisDomain = async(webnicAttributes) => {
  const baseUrl = webnicAttributes.base_url ?? ''
  const webnicToken = webnicAttributes.token ?? ''
  const domain = webnicAttributes.domain ?? ''

  if (webnicToken === '' || domain === '' || baseUrl === '')
    throw new ErrorResponse('webnic_token or domain or base_url is required', 400)

  const endpoint = `/domain/whois/universal?domainName=${domain}`;
  const fullUri = `${baseUrl}${endpoint}`
  
  const response = await axios.get(fullUri, {
    headers: {
      Authorization: `Bearer ${webnicToken}`,
      Accept: 'application/json'
    }
  })

  const responseCode = parseInt(response.data.code) ?? 0
  const isWhoisRequestFailed = responseCode === 1000 ? false : true
  if (isWhoisRequestFailed)
    throw new ErrorResponse(`whois response for ${domain}} is failed; ${response.data.error.message ?? ''}`, 500)
  
  const whoisRawResult = response.data.data
  return whoisRawResult
}
