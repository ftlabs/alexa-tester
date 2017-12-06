const helper = require('../../helpers/helper');
const correlationsHelper = require('./helpers/test-helper')
const alexaTester = require('../../alexa-tester');

const stringToFunction = {
    "correctAnswer": correctAnswer,
    "incorrectAnswer": incorrectAnswer,
    "misunderstoodAnswer": misunderstoodAnswer
};

function correctAnswer(outputSpeech) {
    const speech = helper.processSpeech(outputSpeech);
    const possiblePeople = correlationsHelper.getPeopleFromQuestion(speech);
    return correlationsHelper.getCorrectAnswer(possiblePeople.personX, possiblePeople.people);
}

function incorrectAnswer(outputSpeech) {
    const speech = helper.processSpeech(outputSpeech);
    const possiblePeople = correlationsHelper.getPeopleFromQuestion(speech);
    return correlationsHelper.getIncorrectAnswer(possiblePeople.personX, possiblePeople.people);
}

function misunderstoodAnswer(outputSpeech) {
    return "NOT AN ANSWER";
}

alexaTester('models/example-complex.json', 'http://localhost:8060/alexa', stringToFunction)
    .then(response => {
        for (let r of response) {
            console.log(r.report);
        }
    });
