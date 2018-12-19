const inquirer = require('inquirer');
const fs = require('fs')

inquirer
  .prompt([
    {
      type: 'checkbox',
      message: 'Are you ready and are you in your parent folder with a *src* file included?',
      name: 'start',
      choices: [
        new inquirer.Separator(' = The Meats = '),
        {
          name: "Yes, let's do this... 🐱‍👤"
        },
        {
          name: "Ah no, wait I'll be back 😎"
        }
      ],
      validate: function(answer) {
        if (answer.length < 1) {
          return 'OK hurry back! ⏳.';
        } else {
             const startPath = process.cwd();
            return fs.readdirSync(startPath).some(item => item === "src") ? "Let's a go 👾" : "Hmm seems you weren't telling the truth about a src folder here ... 🤔"
        }
        return true;
      }
    }
  ])
  .then(answers => {
    console.log(JSON.stringify(answers, null, '  '));
  });