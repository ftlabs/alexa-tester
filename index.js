const alexaTester = require('./alexa-tester');
const chalk = require('chalk');

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
            if (!r.success) {
                console.log(r.path);
                console.log(r.report);
            }
            success = success && r.success;
        }
        if (count != 1) plural = 'es';

        if (success) {
            console.log(`${chalk.bold.green('Success:')} ${count}/${response.length} branch${plural} passed.`);
        } else {
            console.log(`${chalk.bold.red('Failure:')} ${count}/${response.length} branch${plural} passed.`);
        }
    }).catch(e => {
        const requiresAuth = e.statusCode && e.statusCode == 401;
        if (requiresAuth) {
            console.log(chalk.bold.red("Error: Unauthorized, have you disabled authentication within the Alexa skill?"))
        }
        else {
            console.log(chalk.bold.red(e.message));
            console.log(e.error)
        }
    });
