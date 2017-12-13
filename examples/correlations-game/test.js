const answerFunctions = require('./helpers/answer-functions');
const alexaTester = require('../../alexa-tester');

alexaTester('models/example-complex.json', 'http://localhost:8060/alexa', answerFunctions)
    .then(response => {
        for (let r of response) {
            console.log(r.report);
        }
    });
