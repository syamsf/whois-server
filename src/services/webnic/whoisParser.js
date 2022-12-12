exports.domainAvailabilityValidation = (rawWhoisResult) => {
  const availablePattern = ['No match for domain', 'DOMAIN NOT FOUND']

  const arrayResult = rawWhoisResult.split(/\n/)
  const searchKeyword = arrayResult[0]
  const isDomainAvailableList = availablePattern.map(val => {
    return searchKeyword.includes(val)
  })
  const isDomainAvailable = isDomainAvailableList.includes(true)

  return isDomainAvailable
}