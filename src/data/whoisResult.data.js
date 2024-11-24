module.exports = class WhoisResultData {
  constructor(
      statusCode = 200,
      success = true,
      domains = null,
      errorMessages = null
  ) {
      this.statusCode = statusCode
      this.success = success
      this.domains = domains
      this.errorMessages = errorMessages
  }

  formatForWeb() {
      const data = {
          meta: {
              status_code: this.statusCode,
              success: this.success
          },
          data: {}
      }

      if (this.errorMessages) {
          data.data.errors = this.errorMessages
          return data
      }

      data.data = this.domains?.formatForWeb() ?? null
      return data
  }

  formatForBulkWhois() {
    const data = {
        meta: {
            status_code: this.statusCode,
            success: this.success
        },
        data: {}
    }

    if (this.errorMessages) {
        data.data.errors = this.errorMessages
        return data
    }

    data.data.domains = this.domains ?? null
    return data
  }
}
