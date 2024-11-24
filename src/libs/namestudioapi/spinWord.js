const ErrorResponse = require("@utils/error_response")
const { request, requestAttr} = require("@libs/namestudioapi/apiRequest")

const defaultReqConfig = {
    maxResult: 30,
    includeRegistered: true,
    sensitiveContentFilter: true,
    useIdns: false,
    similarity: 0.5
}

const requestBuilder = (lang, segmentName, tld, position) => {
    if (!lang || !segmentName || !tld)
        throw new ErrorResponse("lang and segment_name and tld is required", 400)

    const param = new URLSearchParams({
        "max-results": defaultReqConfig.maxResult,
        "include-registered": defaultReqConfig.includeRegistered,
        "sensitive-content-filter": defaultReqConfig.sensitiveContentFilter,
        "use-idns": defaultReqConfig.useIdns,
        "lang": lang,
        "name": segmentName,
        "tlds": tld,
        "similarity": defaultReqConfig.similarity,
        "position": position
    })

    return param.toString()
}

const requestSpinWord = async (lang, segmentName, tld, position = 0) => {
    const url = requestBuilder(lang, segmentName, tld, position)
    const result = await request(requestAttr.SPIN_WORD, url)

    const errorCode = result.data?.code ?? null
    if (errorCode) {
        const errorMessage = result.data?.message ?? "There's error when try to access spin-word api"
        throw new ErrorResponse(errorMessage, 500)
    }

    return {data: result.data, requestType: "spin-word", position: position, segment: segmentName}
}

module.exports = {
    requestBuilder: requestBuilder,
    defaultReqConfig: defaultReqConfig,
    requestSpinWord: requestSpinWord
}