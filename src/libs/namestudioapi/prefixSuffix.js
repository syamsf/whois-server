const ErrorResponse = require("@utils/error_response")
const { request, requestAttr} = require("@libs/namestudioapi/apiRequest")

const defaultReqConfig = {
    maxResult: 30,
    includeRegistered: true,
    sensitiveContentFilter: true,
    useIdns: false,
    useDashes: false,
}

const requestBuilder = (type, lang, segmentName, tld) => {
    if (!lang || !segmentName || !tld)
        throw new ErrorResponse("lang and segment_name and tld is required", 400)

    const formattedType = type.toLowerCase() === "suffix" ? "@suffixes" : "@prefixes"

    const param = new URLSearchParams({
        "max-results": defaultReqConfig.maxResult,
        "include-registered": defaultReqConfig.includeRegistered,
        "sensitive-content-filter": defaultReqConfig.sensitiveContentFilter,
        "use-idns": defaultReqConfig.useIdns,
        "use-dashes": defaultReqConfig.useDashes,
        "lang": lang,
        "name": segmentName,
        "vocabulary": formattedType,
        "tlds": tld
    })

    return param.toString()
}

const requestPrefix = async (lang, segmentName, tld) => {
    return await doRequest("PREFIX", lang, segmentName, tld)
}

const requestSuffix = async (lang, segmentName, tld) => {
    return await doRequest("SUFFIX", lang, segmentName, tld)
}

const doRequest = async (type, lang, segmentName, tld) => {
    const url = requestBuilder(type, lang, segmentName, tld)
    const requestEnum = requestAttr[type]
    const result = await request(requestEnum, url)

    return {data: result.data, requestType: type.toLowerCase()}
}

const requestPrefixSuffix = async (lang, segmentName, tld) => {
    const requestList = [requestPrefix(lang, segmentName, tld), requestSuffix(lang, segmentName, tld)]

    return await Promise.allSettled(requestList)
        .then(results => {
            return results.map((result) => {
                const errorCode =  result.value?.data?.code ?? null
                if (errorCode) {
                    const errorMessage = result.value?.data?.message ?? "There's error when try to get suffix and prefix"
                    throw new ErrorResponse(errorMessage, 500)
                }
                
                return {
                    result: result.value.data.results,
                    type: result.value.requestType
                }
            })
        })
        .catch(err => {
            throw new ErrorResponse(err, 500)
        })
}

module.exports = {
    requestBuilder: requestBuilder,
    defaultReqConfig: defaultReqConfig,
    requestPrefixSuffix: requestPrefixSuffix,
    requestPrefix: requestPrefix,
    requestSuffix: requestSuffix,
}