const ErrorResponse = require("@utils/error_response")
const axios = require("axios")

const requestAttr = {
    PREFIX: {
        path: "add-prefix"
    },
    SUFFIX: {
        path: "add-suffix"
    },
    SPIN_WORD: {
        path: "spin-word"
    },
    SEGMENT: {
        path: "segment"
    },
    BULK_CHECK: {
        path: "bulk-check"
    },
    SUGGESTION: {
        path: "suggest"
    }
}

const request = async(type, endpoint) => {
    if (!type || !endpoint)
        throw new ErrorResponse("type or endpoint is required", 400)

    const path = type?.path
    if (!path)
        throw new ErrorResponse(`request type "${type}" is not available`)

    const namestudioEndpoint = process.env.NAMESTUDIO_BASE_URI || ""
    if (!namestudioEndpoint)
        throw new ErrorResponse("namestudio_baseurl is not exist")

    const namestudioAPIKey = process.env.NAMESTUDIO_API_KEY || ""
    if (!namestudioAPIKey)
      throw new ErrorResponse("namestudio_api_key is not exist")

    const baseEndpoint = (new URL(namestudioEndpoint)).origin
    if (!baseEndpoint)
        throw new ErrorResponse("namestudio_base_endpoint is not valid")

    const thirtySecond = 1000 * 30

    return await axios.get(`${baseEndpoint}/ns-api/2.0/${path}?${endpoint}`, {
        timeout: thirtySecond,
        headers: {
            "X-Namesuggestion-Apikey": namestudioAPIKey,
            Accept: 'application/json'
        }
    }).catch(error => {
        if (error.response)
            return error.response

        return error
    })
}

const bundleRequest = async (requestList) => {
    if (!requestList)
        throw new ErrorResponse("request_list is empty", 400)

    return await Promise.allSettled(requestList)
        .then(results => {
            return results.map((result) => {
                const errorCode =  result.value?.data?.code ?? null
                if (errorCode) {
                    const errorMessage = result.value?.data?.message ?? "There's error when try to get suffix and prefix"
                    throw new ErrorResponse(errorMessage, 500)
                }

                const reformattedResult = result.value.data.results.map(item => {
                    item.is_available = item.availability === "available"
                    return item
                })

                const data = {
                    result: reformattedResult,
                    type: result.value.requestType,
                }

                if (result.value.position || result.value.position === 0) {
                    data.position = result.value.position
                }

                if (result.value?.segment ?? null) {
                    data.segment = result.value.segment
                }

                return data
            })
        })
        .catch(err => {
            throw new ErrorResponse(err, 500)
        })
}

module.exports = {
    request: request,
    requestAttr: requestAttr,
    bundleRequest: bundleRequest
}