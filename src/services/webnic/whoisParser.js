exports.domainAvailabilityValidation = (rawWhoisResult) => {
  const availablePattern = [
    'No match for domain', 
    'DOMAIN NOT FOUND', 
    'Domain not found.',
    'No match for',
    'No Match for',
    'NOT FOUND',
    'No Object Found',
    'No match',
    'nothing found',
    '---Available',
    'Status:\tAVAILABLE',
    'No matching record',
    'no matching objects found',
    'No entries found',
    'no entries found',
    'is available for registration',
    'The queried object does not exist',
    'This domain name has not been registered',
    'No Data Found',
    'Status: free',
    'not found in our database',
    'AVAILABLE',
    'No match!!',
    'domain was not found',
    'We do not have an entry in our database matching your query',
    'Status:\t\t\tavailable',
    'No such domain',
    'No domains matched',
    'No_Se_Encontro_El_Objeto/Object_Not_Found',
    'is free',
    'No match',
    'not found',
    'No information available',
    'Sorry - no',
    'NO MATCH',
    'Available',
    '---1',
    'The domain has not been registered',
    'has no matches',
    'Object does not exist',
    'Status: AVAILABLE',
    '220 Available',
    '---Domain not found',
    'does not exist in database',
    'No Match',
    'was not found',
    'not exist',
    'DOMINIO NO REGISTRADO',
    'not found...',
    '%ERROR:103',
    'esta disponible para ser Registrado',
    'Domain is available',
    'is available for purchase',
    '0 objects',
    'No records matching',
    'Not found:',
    'No information was found matching that query.'
  ]

  const arrayResult = rawWhoisResult.split(/\n/)
  const searchKeyword = arrayResult[0]
  const isDomainAvailableList = availablePattern.map(val => {
    return searchKeyword.includes(val)
  })
  const isDomainAvailable = isDomainAvailableList.includes(true)

  return isDomainAvailable
}