const WhoisResultData = require("@data/whoisResult.data")
const DomainResultData = require("@data/domainResult.data")
const z = require("zod")
const { domainChecker, bulkDomainChecker } = require("@services/socket_whois/whois.domain")
const asyncHandler = require('@utils/async_handler')

exports.whois = asyncHandler(async (req, res) => {
    const resultData = new WhoisResultData()

    try {
        const domainRegex = /^(?!:\/\/)([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/

        const domain = z.object({
            domain: z.string().min(2).regex(domainRegex),
        })

        domain.parse({
            domain: req.body.domain,
        })
    } catch (e) {
        resultData.statusCode = 400
        resultData.success = false
        resultData.errorMessages = e.errors
        return res.status(400).json(resultData.formatForWeb())
    }

    const result = await domainChecker(req.body.domain.toLowerCase())
    resultData.domains = new DomainResultData({
        domain: result.domain,
        rawWhois: result.raw_whois,
        whoisServer: result.whois_server,
        errorMessages: null,
        isAvailable: result.available
    })

    return res.status(resultData.statusCode).json(resultData.formatForWeb())
})

exports.bulkWhois = asyncHandler(async(req, res) => {
    const resultData = new WhoisResultData()

    try {
        const domainRegex = /^[a-zA-Z0-9-]+$/

        const domain = z.object({
            domain: z.string().min(2).regex(domainRegex),
            extension: z.array(z.string()).min(1)
        })

        domain.parse({
            domain: req.body.domain,
            extension: req.body.extension
        })
    } catch (e) {
        resultData.statusCode = 400
        resultData.success = false
        resultData.errorMessages = e.errors
        return res.status(400).json(resultData.formatForWeb())
    }

    resultData.domains = await bulkDomainChecker(req.body.extension.map(ext => `${req.body.domain.toLowerCase()}.${ext}`))

    return res.status(200).json(resultData.formatForBulkWhois())
})
