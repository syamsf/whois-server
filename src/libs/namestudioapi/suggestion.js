const ErrorResponse = require("@utils/error_response")
const { request, requestAttr} = require("@libs/namestudioapi/apiRequest")

const defaultReqConfig = {
    maxResult: 30,
    includeRegistered: false,
    sensitiveContentFilter: true,
    useIdns: false,
    useNumber: true,
    similarity: 0.5
}

const requestBuilder = (lang, segmentName, tld) => {
    if (!lang || !segmentName || !tld)
        throw new ErrorResponse("lang and segment_name and tld is required", 400)

    const param = new URLSearchParams({
        "max-results": defaultReqConfig.maxResult,
        "include-registered": defaultReqConfig.includeRegistered,
        "sensitive-content-filter": defaultReqConfig.sensitiveContentFilter,
        "use-idns": defaultReqConfig.useIdns,
        "use-numbers": defaultReqConfig.useNumber,
        "lang": lang,
        "name": segmentName,
        "tlds": tld,
    })

    return param.toString()
}

const requestSuggestion = async (lang, segmentName, tld) => {
    const url = requestBuilder(lang, segmentName, tld)
    const result = await request(requestAttr.SUGGESTION, url)
    
    result.data = result.data.results.map(item => {
        item.is_available = item.availability === "available"
        return item
    })

    const errorCode = result.data?.code ?? null
    if (errorCode) {
        const errorMessage = result.data?.message ?? "There's error when try to access suggestion api"
        throw new ErrorResponse(errorMessage, 500)
    }

    return {data: result.data, requestType: "suggestion"}
}

module.exports = {
    requestBuilder: requestBuilder,
    defaultReqConfig: defaultReqConfig,
    requestSuggestion: requestSuggestion
}