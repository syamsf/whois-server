const whois = require("whois")
const { fetchByExtension } = require("@repositories/domain_extension.repo")
const tld = require("@helpers/tld")
const DomainResultData = require("@data/domainResult.data");

function lookupDomain(domain, whoisUri = null) {
    const options = {
        "server":  whoisUri,
        "follow":  2,
        "timeout": 60000, // 60s
        "verbose": false,
        "bind": null
    }

    return new Promise((resolve, reject) => {
        whois.lookup(domain, options, (err, data) => {
            if (err) {
                return reject(`[WHOIS SOCKET]: ${err.message}`)
            }
            resolve(data)
        })
    })
}

const whoisCheck = async (domain, includeRawWhois = true) => {
    const extension = tld(domain)

    const extensionData = await fetchByExtension(`.${extension}`)
    if (!extensionData) {
        throw new Error("Extension not found")
    }

    const whoisUri = extensionData.whois_uri.replace(/socket:\/\//g, "")

    return lookupDomain(domain, whoisUri)
        .then(data => {
            const result = {
                domain: domain,
                raw_whois: includeRawWhois ? data : null,
                available: false,
                whois_server: whoisUri
            }

            if (data === extensionData.available) {
                result.available = true
                return result
            }

            const firstLine = data.slice(0, data.indexOf("\n"))

            result.available = firstLine.includes(extensionData.available)
            return result
        })
        .catch(error => {
            throw new Error(error)
        })
}

exports.domainChecker = whoisCheck

exports.bulkDomainChecker = async (domains) => {
    // TODO: Add Check for premium domain

    return Promise
        .allSettled(domains.map(async (domain) => await whoisCheck(domain, false)))
        .then(data => data.map(item => {
            return (new DomainResultData({
                domain: item.value.domain,
                whoisServer: item.value.whois_server,
                isAvailable: item.value.available
            })).formatForBulkWhois()
        }))
}
