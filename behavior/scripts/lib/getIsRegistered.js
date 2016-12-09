'use strict'

const request = require('request')

module.exports = function getIsRegistered(locationName, next) {
    const requestUrl = 'http://91.231.232.36/Bls.LPM.Api.CustomApi/CustomApiRest.svc/IsCustomerRegistered?source=WEB&channel=SITE&externalReferenceId=1111&subscriberId=${locationName}&subscriberIdType=Msisdn&language=EN'
    console.log('Making HTTP GET request to:', requestUrl)

    request(requestUrl, (err, res, body) => {
        if (err) {
            console.log('get error1')
            throw new Error(err)
        }

        if (body) {
            var parsedResult = JSON.parse(body)
            console.log('get error2')
            if (!parsedResult || parsedResult.IsCustomerRegisteredResult.Error == '') {
                console.log('API ERROR fct: error code: ' + parsedResult.IsCustomerRegisteredResult.Error.ErrorCode)
                parsedResult = ''
            }
            else {
                parsedResult = parsedResult.IsCustomerRegisteredResult.IsCustomerRegistered
            }
            next(parsedResult)
        } else {
            console.log('get error3')
            next()

        }
    })
}
// JavaScript source code
