const alexaTester = require('./alexa-tester');

const args = process.argv;

const endpoint = args[2];
const filePath = args[3];
const functionsMapPath = args[4];

const functionsMap = require(`./${functionsMapPath}`);

alexaTester(filePath, endpoint, functionsMap)
    .then(response => {
        let success = true;
        for (let r of response) {
            console.log(r.report);
            success = success && r.success;
        }
        if (success) {
            console.log("SUCCEEDED");
        } else {
            console.log("FAILED");
        }
    });
