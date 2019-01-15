#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const fs = require("fs");
const inquirer = require("inquirer");
const start_1 = require("./command-line-input/start");
//  start point for the program
inquirer
    .prompt([
    {
        default: false,
        message: "Are you ready and are you in your parent folder with a *src* folder included?",
        name: "run",
        type: "confirm"
    }
])
    .then(({ run }) => {
    if (run) {
        const startPath = process.cwd();
        if (fs
            .readdirSync(startPath)
            .some((folderName) => folderName === "src")) {
            console.log(chalk_1.default.green("Yes, let's do this... ⚡️"));
            start_1.default();
        }
        else {
            console.log(chalk_1.default.red("Hmm cant find a src folder here, just sayin ... 🤔"));
        }
    }
    else {
        console.log(chalk_1.default.yellow("OK head to your folder with *src* and try again! 📂"));
    }
});
