import * as fs from 'fs'
import * as inquirer from 'inquirer'

inquirer
  .prompt([
    {
      choices: [
        {
          name: "Yes, let's do this... ??",
        },
        {
          name: "Ah no, wait I'll be back ?",
        },
      ],
      message:
        'Are you ready and are you in your parent folder with a *src* folder included?',
      name: 'start',
      type: 'list'
    },
  ])
  .then((answers) => {
    console.log(JSON.stringify(answers, null, '  '));
    // validate(answer) {
    // const startPath = process.cwd();
    // fs.readdirSync(startPath).some(item => item === 'src')
    //   ? "Let's a go ??"
    //   : "Hmm seems you weren't telling the truth about a src folder here ... ??";
    // },
  });
