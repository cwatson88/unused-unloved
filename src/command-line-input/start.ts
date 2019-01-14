import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { createJSONFile } from "../output-results/createJsonFile";

// ! Begin the program
const startCLI = () => {
  const startDirName: string = path.basename(`${process.cwd()}/src`);
  const startPath: string = process.cwd();

  fs.readdirSync(startPath).some(item => item === "src")
    ? createJSONFile(startDirName)
    : console.log(
        "😥ah looks like there is not a 'src' folder in here can you please point me in the right direction by running me in your main project directory where your 'src file is!"
      );
};

export default startCLI;
