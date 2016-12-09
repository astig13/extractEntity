module.exports = function getIsRegistered(locationName, next) {
    const requestUrl = `http://atata/Bls.LPM.Api.CustomApi/CustomApiRest.svc/IsCustomerRegistered?source=WEB&channel=SITE&externalReferenceId=1111&subscriberId=${locationName}&subscriberIdType=Msisdn&language=EN`
    console.log('Making HTTP GET request to:', requestUrl)

    request(requestUrl, (err, res, body) => {
        if (err) {
            throw new Error(err)
        }

        if (body) {
            var parsedResult = JSON.parse(body)

            if (!parsedResult || parsedResult.IsCustomerRegisteredResult.Error == '') {
                console.log('API ERROR fct: error code: ' + parsedResult.IsCustomerRegisteredResult.Error.ErrorCode)
                parsedResult = ''
            }
            else {
                parsedResult = parsedResult.IsCustomerRegisteredResult.IsCustomerRegistered
            }
            next(parsedResult)
        } else {
            next()
        }
    })
}
// JavaScript source code
