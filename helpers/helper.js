const fs = require('fs');
const striptags = require('striptags');
const path = require('path');

function sendRequest(event, handler) {
    return new Promise((resolve, reject) => {
        handler(event, {
            succeed: resolve,
            fail: reject
        });
    });
}

function processSpeech(speech) {
    speech = striptags(speech);
    speech = speech.trim();
    return speech;
}

function getInteractionModelFromJSON(filename) {
    return new Promise(function(resolve, reject) {
        fs.readFile(path.join(process.cwd(), filename), 'utf-8', function(err, data){
            if (err) {
                reject(err); 
            } else {
                resolve(data);
            }
        });
    });
};

function buildRequest(info, session, attributes, request) {
    const newRequest = {
        session: {
            attributes: attributes,
            sessionId: session.sessionId,
            application: {
                applicationId: info.applicationId,
            },
            user: {
                userId: info.userId,
            },
            new: info.newSession
        }, 
        request: {
            type: request.type,
            locale: info.locale,
            requestId: info.requestId,
            timestamp: + new Date()
        }
    };

    if (request.type === 'IntentRequest') {        
        newRequest.request.type = 'IntentRequest';
        newRequest.request.intent = {
            name: request.name
        }
        if (request.slots) {
            newRequest.request.intent.slots = request.slots;
        }
    }

    return newRequest;
}

module.exports = {
    sendRequest,
    getInteractionModelFromJSON,
    processSpeech,
    buildRequest
}
