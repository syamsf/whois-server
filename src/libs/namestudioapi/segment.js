const ErrorResponse = require("@utils/error_response")
const {request, requestAttr} = require("@libs/namestudioapi/apiRequest")

const requestBuilder = (domainName) => {
    if (!domainName)
        throw new ErrorResponse("domain_name is required", 400)

    const domainWord = domainName.split(".")

    const param = new URLSearchParams({
        "lang": "eng,ind",
        "name": domainWord[0]
    })

    return param.toString()
}

const doRequest = async (domainName) => {
    const segmentUrl = requestBuilder(domainName)

    const result = await request(requestAttr.SEGMENT, segmentUrl)
    if (!result.data?.segmentedName)
        throw new ErrorResponse(`segmented_name of ${domainName} is not available`, 400)

    return result.data
}

module.exports = {
    requestBuilder: requestBuilder,
    segmentRequest: doRequest
}