import chalk from "chalk";
import * as fs from "fs";

const createJSONFile = (startDirName: string) =>
  fs.writeFile(
    "./unused-file-report.json",
    JSON.stringify(createFileArray(startDirName), null, 2),
    err => {
      if (err) {
        throw err;
      } else {
        console.log(chalk.blue("The file has been saved!ðŸŽŠðŸŽŠ"));
        console.log(
          chalk.italic(
            "Try copy and pasting the contents of unused-file-report.json into http://json2table.com/"
          )
        );
      }
    }
  );

export { createJSONFile };
