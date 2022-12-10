const axios = require('axios').default

exports.whoisDomain = async(baseUrl, webnicAttributes) => {
  try {
    const webnicToken = webnicAttributes.token ?? ''
    const domain = webnicAttributes.domain ?? ''

    if (webnicToken === '' || domain === '')
      throw new Error('webnic_token or domain is required')

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
      throw new Error(`whois response for ${domain}} is failed; ${response.data.error.message ?? ''}`)
    
    const whoisRawResult = response.data.data

    return whoisRawResult
  } catch (error) {
    let isErrorFromWebRequest = (error.response) ?? false
    isErrorFromWebRequest = (isErrorFromWebRequest) ? true : false

    if (isErrorFromWebRequest)
      return console.error({
        status_code: error.response.status ?? 0,
        status_message: error.response.statusText ?? '',
        message: error.response.data ?? ''
      })

    return console.log(`Error Message: ${error.message}`)
  }
}