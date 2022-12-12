const errorHandler = (error, req, res, next) => {
  // For development only
  const environment = process.env.NODE_ENV || 'development' 
  if (environment === 'development')
    console.log(error.stack.red)

  let isErrorFromWebRequest = (error.response) ?? false
  isErrorFromWebRequest = (isErrorFromWebRequest) ? true : false

  if (isErrorFromWebRequest) {
    const errorMessageVendor = error.response?.data?.error?.message ?? "There's some error"
    const errorCodeVendor = error.response?.data?.code ?? 0
    const errorDataVendor = error.response?.data ?? ''

    const errorMessageDetail = {
      error_message_vendor: errorMessageVendor,
      error_code_vendor: errorCodeVendor,
      error_data_vendor: errorDataVendor
    }

    console.log(`ERROR: `.red.underline, errorMessageDetail)
  }

  const errorStatusCode = error.statusCode || 500
  const errorMessage = error.message || "There's some error"

  res.status(errorStatusCode).json({
    error: {
      code: errorStatusCode,
      message: errorMessage
    }
  })
}

module.exports = errorHandler