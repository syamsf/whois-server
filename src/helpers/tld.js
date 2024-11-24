const ErrorResponse = require("@utils/error_response")

const tld = (domain) => {
    if (!domain)
        throw new ErrorResponse("domain is required", 400)

    const domainArr = domain.split(".")
    const domainLength = domainArr.length

    if (domainLength <= 1)
        throw new ErrorResponse(`domain_length is invalid with size ${domainLength}`, 400)

    if (domainLength === 2)
        return domainArr[1]

    return `${domainArr[1]}.${domainArr[2]}`
}

module.exports = tld