const {
    defaultReqConfig: psConfig,
    requestBuilder: psRequestBuilder, requestPrefix, requestSuffix
} = require("@libs/namestudioapi/prefixSuffix")

const { bundleRequest } = require("@libs/namestudioapi/apiRequest")
const { segmentRequest } = require("@libs/namestudioapi/segment")
const tld = require("@helpers/tld")
const { requestSpinWord } = require("@libs/namestudioapi/spinWord")
const { requestSuggestion } = require("@libs/namestudioapi/suggestion")

const generateBrainstormDomain = async(domain) => {
    const domainTld = tld(domain)

    // 1. Fetch segmentedName and language
    const segmentResult = await segmentRequest(domain)
    const segmentedName = segmentResult.segmentedName.join(",")
    const language = segmentResult.language

    // 1.1  If more than 6 words, then use suggestion
    if (segmentResult.segmentedName.length >= 6) {
        return await requestSuggestion(language, segmentedName, domainTld)
    }

    const requestList = [
        await requestPrefix(language, segmentedName, domainTld),
        await requestSuffix(language, segmentedName, domainTld),
    ]

    // 2. Iterate segmented name for spin word
    for (let i= 0; i < segmentResult.segmentedName.length; i++) {
        requestList.push(await requestSpinWord(language, segmentedName, domainTld, i))
    }
    
    // 3. Fetch prefix, suffix, spinword
    return await bundleRequest(requestList)
}

module.exports = generateBrainstormDomain