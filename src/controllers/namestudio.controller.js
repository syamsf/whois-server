const namestudio = require('@services/namestudio/namestudio.services')
const ErrorResponse = require('@utils/error_response')
const asyncHandler = require('@utils/async_handler')

exports.brainstorm = asyncHandler(async(req, res) => {
    const domainName = req.query.domain ?? null
    if (!domainName)
        throw new ErrorResponse('domain_name is required', 400)

    const result = await namestudio(domainName)

    return res.status(200).json(result)
})