const alexaTester = require('./alexa-tester');

const args = process.argv;

const endpoint = args[2];
const filePath = args[3];
const functionsMapPath = args[4];

const functionsMap = require(`./${functionsMapPath}`);

alexaTester(filePath, endpoint, functionsMap)
    .then(response => {
        for (let r of response) {
            console.log(r.report);
        }
    });
