exports.domainAvailabilityValidation = (rawWhoisResult) => {
  const availablePattern = 'No match for domain'

  const arrayResult = rawWhoisResult.split(/\n/)
  const isDomainAvailable = arrayResult[0].includes(availablePattern)
  return isDomainAvailable
}