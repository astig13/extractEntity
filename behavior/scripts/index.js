'use strict'

const firstOfEntityRole = function (message, entity, role) {
    role = role || 'generic';

    const slots = message.slots
    const entityValues = message.slots[entity]
    const valsForRole = entityValues ? entityValues.values_by_role[role] : null

    return valsForRole ? valsForRole[0] : null
}

exports.handle = function handle(client) {
    // Create steps
    const sayHello = client.createStep({
        satisfied() {
            return Boolean(client.getConversationState().helloSent)
        },

        prompt() {
            client.addResponse('welcome')
            client.addResponse('provide/documentation', {
                documentation_link: 'http://docs.init.ai',
            })
            client.addResponse('provide/instructions')

            client.updateConversationState({
                helloSent: true
            })

            client.done()
        }
    })

    const collectCity = client.createStep({
        satisfied() {
            console.log('conversation state:', client.getConversationState().weatherCity)
            return Boolean(client.getConversationState().weatherCity)
        },

        extractInfo() {
            const city = firstOfEntityRole(client.getMessagePart(), 'number')

            if (city) {
                console.log('update conversation state:', city.value)
                client.updateConversationState({
                    weatherCity: city,
                })

                console.log('User wants the weather in:', city.value)
            }
        },

        prompt() {
            // Need to prompt user for city    
            //client.addResponse('provide_information/city')
            client.addResponse('app:response:name:ask_information/number')
            console.log('Need to ask user for city')
            client.done()
        },
    })

    const handleCustomerRegistered = client.createStep({
        satisfied() {
            return false
        },
        prompt() {
            client.addTextResponse("Register affirmative")
            client.done()
        }
    })

    const handleCustomerNotRegistered = client.createStep({
        satisfied() {
            return false
        },
        prompt() {
            client.addTextResponse("Registered declined")
            client.done()
        }
    })

    const formalHello = client.createStep({
        satisfied() {
            console.log('class = ', client.getMessagePart().classification.base_type.value)
            return (typeof client.getConversationState().overAgeEighteen !== 'undefined')
            //return Boolean(client.getMessagePart().classification.base_type.value != 'undefined')
            //console.log('conversation state:', client.getConversationState().weatherCity) 
            //return Boolean(client.getConversationState().weatherCity)
            //return false
        },

        next() {
            const subscrWantsToBeRegistered = client.getConversationState().overAgeEighteen
            if (subscrWantsToBeRegistered === true) {
                
                return 'customerRegistered'
            } else if (subscrWantsToBeRegistered === false) {
               
                return 'customerNotRegistered'
            }
        },

        prompt() {
            //client.addTextResponse('Hello user ' + client.getConversationState().weatherCity.value + '. How can I help you')
            client.addTextResponse('Hello user ' + client.getConversationState().weatherCity.value + '. Do you want to be registered?')
            let baseClassification = client.getMessagePart().classification.base_type.value
            if (baseClassification === 'affirmative') {
                client.updateConversationState({
                    overAgeEighteen: true,
                })
                console.log('User said YES')
                return 'init.proceed' // `next` from this step will get called
            } else if (baseClassification === 'decline') {
                console.log('User said NO')
                client.updateConversationState({
                    overAgeEighteen: false,
                })
                return 'init.proceed' // `next` from this step will get called
            }
            client.expect(client.getStreamName(), ['affirmative', 'decline'])
            client.done()
        },
    })

    //const checkRegistration = client.createStep({
    //    satisfied() {
    //        //console.log('conversation state:', client.getConversationState().weatherCity) 
            
    //        return false
    //    },

    //    next() {
    //        const IsRegistered = false
    //        if (IsRegistered === true) {
    //            return 'customerRegistered'
    //        } else if (IsRegistered === false) {
    //            return 'customerNotRegistered'
    //        }
    //    },

    //    prompt() {
    //        //client.addTextResponse('Hello user ' + client.getConversationState().weatherCity.value + '. How can I help you')
    //        let baseClassification = client.getMessagePart().classification.base_type.value
    //        if (baseClassification === 'affirmative') {
    //            console.log('User said YES')
    //            return 'init.proceed' // `next` from this step will get called
    //        } else if (baseClassification === 'decline') {
    //            console.log('User said NO')
    //            return 'init.proceed' // `next` from this step will get called
    //        }
    //        client.expect(client.getStreamName(), ['affirmative', 'decline'])
    //        client.done()
    //    },
    //})

    const untrained = client.createStep({
        satisfied() {
            return false
        },

        prompt() {
            client.addResponse('apology/untrained')
            client.done()
        }
    })

    client.runFlow({
        classifications: {
            // map inbound message classifications to names of streams
        },
        autoResponses: {
            // configure responses to be automatically sent as predicted by the machine learning model
        },
        streams: {
            main: 'getInfoCity',
            hi: [sayHello],
            getInfoCity: [collectCity, formalHello],
            customerRegistered: [handleCustomerRegistered],
            customerNotRegistered: [handleCustomerNotRegistered]
        },
    })
}
