const axios = require('axios').default
const WebnicTokenModel = require('../../models/WebnicToken')
const ErrorResponse = require('../../utils/error_response')

exports.fetchWebnicToken = async(baseUrl, webnicAuth) => {
  const endpoint = '/auth/realms/webnic/protocol/openid-connect/token';
  const fullUri = `${baseUrl}${endpoint}`

  const webnicUsername = webnicAuth.username ?? ''
  const webnicPassword = webnicAuth.password ?? ''
  if (webnicUsername === '' || webnicPassword === '')
    throw new ErrorResponse('webnic username or password is required', 400)

  // Prepare form data
  const params = new URLSearchParams()
  params.append('grant_type', 'client_credentials')
  params.append('scope', 'webnic-api')

  const response = await axios.post(fullUri, params, {
    auth: {
      username: webnicUsername,
      password: webnicPassword
    }
  })

  const accessToken = response.data.access_token ?? ''
  if (accessToken === '')
    throw new ErrorResponse(`webnic access_token is empty - ${new Date()}`, 500)
  
  const tokenData = {
    access_token: accessToken,
    expires_in: response.data.expires_in ?? 3600,
    token_type: response.data.token_type ?? ''
  }

  await saveToken(tokenData)

  return tokenData 
}

const saveToken = async(tokenData) => {
  const expiresInMilisecond = tokenData.expires_in * 1000
  const currentDate = new Date()
  const tokenExpiredTime = new Date(currentDate.getTime() + expiresInMilisecond)

  await WebnicTokenModel.create({
    access_token: tokenData.access_token,
    expires_in: tokenData.expires_in,
    token_type: tokenData.token_type,
    token_expired_time: tokenExpiredTime.toISOString()
  })
}

exports.fetchLatestToken = async() => {
  const tokenRawQuery = await WebnicTokenModel.findOne().sort({createdAt: 'desc'})
  return tokenRawQuery
}

exports.isTokenExpired = (tokenExpiredTime) => {
  const currentTime = (new Date()).getTime()
  const tokenExpiredTimeReformatted = (new Date(tokenExpiredTime)).getTime()

  return (currentTime > tokenExpiredTimeReformatted) ? true : false
}