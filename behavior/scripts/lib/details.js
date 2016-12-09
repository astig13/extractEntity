// JavaScript source code
'use strict'

const request = require('request')

module.exports = function details(locationName, next) {
    const requestUrl = `http://91.231.232.36/Bls.LPM.Api.CustomApi/CustomApiRest.svc/GetCustomerProfile?source=WEB&channel=SITE&externalReferenceId=1111&subscriberId=${locationName}&subscriberIdType=Msisdn&language=EN`
    console.log('Making HTTP GET request to:', requestUrl)

    request(requestUrl, (err, res, body) => {
        if (err) {
            throw new Error(err)
        }

        if (body) {
            var parsedResult = JSON.parse(body)

            if (!parsedResult || parsedResult.GetCustomerProfileResult.Error == '') {
                console.log('API ERROR fct: error code: ' + parsedResult.GetCustomerProfileResult.Error.ErrorCode)
                parsedResult = ''
            }
            else {
                parsedResult = 'Mr/Ms ' + parsedResult.GetCustomerProfileResult.CustomerGeneralInfo.FirstName + ' ' + parsedResult.GetCustomerProfileResult.CustomerGeneralInfo.LastName
            }
            next(parsedResult)
        } else {
            next()
        }
    })
}
