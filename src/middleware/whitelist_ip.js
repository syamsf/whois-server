// const { fetchWhitelistIPList } = require("@models/middleware/whitelistIP")
// const ErrorResponse = require("@utils/errorResponse")

// const whitelistIP = async (req, res, next) => {
//   try {
//     const whitelistIPList = await fetchWhitelistIPList()
//     if (!(!!whitelistIPList.length))
//       return next()

//     const originIPAddress = req.ip
//     const isIPAllowed = whitelistIPList.find(item => item.ip_address === originIPAddress)
//     if (isIPAllowed === undefined)
//       throw new ErrorResponse(`IP Address ${originIPAddress} is not allowed`, 403)

//     next()
//   } catch (error) {
//     next(error)
//   }
// }

// module.exports = whitelistIP