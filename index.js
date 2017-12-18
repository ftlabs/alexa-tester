const alexaTester = require('./alexa-tester');

const args = process.argv;

const endpoint = args[2];
const filePath = args[3];
const functionsMapPath = args[4];

const functionsMap = require(`./${functionsMapPath}`);

alexaTester(filePath, endpoint, functionsMap)
    .then(response => {
        let success = true;
        let count = 0;
        let plural = '';

        for (let r of response) {
            if (r.success) count += 1;
            success = success && r.success;
        }
        if (count != 1) plural = 'es';

        if (success) {
            console.log(`Success. ${count}/${response.length} branch${plural} passed.`);
        } else {
            console.log(`Failure. ${count}/${response.length} branch${plural} passed.`);
        }
    });
