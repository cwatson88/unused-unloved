#!/usr/bin/env node
import chalk from "chalk";
import * as fs from "fs";
import * as inquirer from "inquirer";
import startCLI from "./command-line-input/start";

//  start point for the program
inquirer
  .prompt([
    {
      default: false,
      message:
        "Are you ready and are you in your parent folder with a *src* folder included?",
      name: "run",
      type: "confirm"
    }
  ])
  .then(({ run }) => {
    if (run) {
      const startPath: string = process.cwd();
      if (
        fs
          .readdirSync(startPath)
          .some((folderName: string) => folderName === "src")
      ) {
        console.log(chalk.green("Yes, let's do this... ✨⏳"));
        startCLI();
      } else {
        console.log(
          chalk.red("Hmm cant find a src folder here, just sayin ... 🤔")
        );
      }
    } else {
      console.log(
        chalk.yellow("OK head to your folder with *src* and try again! 📂")
      );
    }
  });
