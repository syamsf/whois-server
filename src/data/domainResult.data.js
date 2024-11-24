module.exports = class DomainResultData {
    constructor({domain = null, isAvailable = false, rawWhois = null, errorMessages = null, whoisServer = null}) {
        this.domain = domain
        this.isAvailable = isAvailable
        this.rawWhois = rawWhois
        this.errorMessages = errorMessages
        this.whoisServer = whoisServer
    }

    formatForWeb() {
        return {
            domain: this.domain,
            whois_server: this.whoisServer,
            is_available: this.isAvailable,
            error_message: this.errorMessages,
            raw_whois: this.rawWhois
        }
    }

    formatForBulkWhois() {
        return {
            domain_name: this.domain,
            whois_server: this.whoisServer,
            available: this.isAvailable,
            error_message: this.errorMessages,
            premium_domain: {
                status: false,
                message: "Premium Domain Not Supported"
            }
        }
    }
}
