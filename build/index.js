var inquirer = require('inquirer');
var fs = require('fs');
inquirer
    .prompt([
    {
        type: 'list',
        message: 'Are you ready and are you in your parent folder with a *src* folder included?',
        name: 'start',
        choices: [
            {
                name: "Yes, let's do this... ??",
            },
            {
                name: "Ah no, wait I'll be back ?",
            },
        ],
        validate: function (answer) {
            var startPath = process.cwd();
            fs.readdirSync(startPath).some(function (item) { return item === 'src'; })
                ? "Let's a go ??"
                : "Hmm seems you weren't telling the truth about a src folder here ... ??";
        },
    },
])
    .then(function (answers) {
    console.log(JSON.stringify(answers, null, '  '));
});
