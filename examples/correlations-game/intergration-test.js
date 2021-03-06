require('dotenv').load();
const helper = require('../helpers/test-helper');
const RequestBuilder = require('../helpers/request-builder');
// const alexaSkill = require('../routes/voice-alexa.js');

/* 
    How to get a correct answer from the correlations service

    const questionExample = `Question 1. Robert Mugabe was mentioned in a recent article with which one of the following people? one) Morgan Tsvangirai. two) Sean Hannity. three) Roy Moore.`;
    const extractedPeople = helper.getPeopleFromQuestion(questionExample);
    helper.getCorrectAnswer(extractedPeople.personX, extractedPeople.people)
        .then(answer => {
            console.log(answer);
        });

    Send a request 

    helper.sendRequest(request, alexaSkill.handler)
        .then(response => {
            console.log(response);
        });
*/

const requestBuilder = new RequestBuilder({
    applicationId: 'amzn1.echo-sdk-ams.app.123',
    sessionId: '1234',
    userId: 'test-user',
    requestId: 'request-id-1234',
    locale: 'en-GB'
});

const launchRequest = requestBuilder.buildRequest();

helper.sendRequest(launchRequest, alexaSkill.handler)
    .then(response => {
        requestBuilder.updateAttributes(response.sessionAttributes);
        const yesRequest = requestBuilder.buildRequest('AMAZON.YesIntent');
        return helper.sendRequest(yesRequest, alexaSkill.handler);
    })
    .then(response => {
        requestBuilder.updateAttributes(response.sessionAttributes);        
        const question = helper.processSpeech(response.response.outputSpeech.ssml);
        const extractedPeople = helper.getPeopleFromQuestion(question);
        return helper.getCorrectAnswer(extractedPeople.personX, extractedPeople.people);
    })
    .then(answer => {
        const answerSlots = [{name: 'Answer', value: answer}];
        const answerRequest = requestBuilder.buildRequest('AnswerIntent', answerSlots);
        return helper.sendRequest(answerRequest, alexaSkill.handler);
    })
    .then(response => {
        requestBuilder.updateAttributes(response.sessionAttributes);      
        console.log(response);  
    });
