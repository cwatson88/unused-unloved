import * as fs from "fs";
import * as path from "path";
// tslint:disable-next-line:no-submodule-imports
import * as uuid from "uuid/v4";
import { flattenArrayDeep } from "../utils/flattenArray";
import { fileTypes } from "./fileTypes";
import { findFileType } from "./findFileType";

interface InterfaceFileOutput {
  baseName: string;
  directory: string;
  extension: string;
  fileName: string;
  type: string;
  imports: string[];
  importedBy?: string[];
  uid: string;
}

const makeFileImportsList = (filename: string): string[] => {
  // ? What if the line just includes the word import, is there a way to tell that
  // ? it is actually doing an import and not just a false positive?
  // ? checking for the word from wouldn't help due to simple whole file imports.

  if (!fs.statSync(filename).isDirectory()) {
    const codeLines: string[] = fs.readFileSync(filename, "utf-8").split("\n");

    const importsList: string[] = codeLines
      .filter((line: string) => line.includes("import"))
      .map((line: string) => {
        const start = line.lastIndexOf("from") + 4;
        const end = line.lastIndexOf(";") || line.length - 1; // if the dev is not using semis
        const filePath = line
          .substring(start, end)
          .trim()
          .replace(/"/g, "");

        return path.normalize(filePath);
      });

    return importsList;
  }
};

// checks the file agains the file list to see if it is included
const setImportedByProperty = (
  file: InterfaceFileOutput,
  fileArray: object[]
): InterfaceFileOutput => {
  file.importedBy = fileArray
    .filter(
      (currentfile: any): string[] =>
        currentfile.imports.some(
          (str: string): boolean => RegExp(file.fileName, "gi").test(str)
        )
    )
    .map((currentFile: any) => currentFile.fileName);

  return file;
};

// this needs to be named like file object array - it is an array of objects containing the file details
// Change this from recursion to a map item with an if statement
const createFileSummaryList = (dir: string): any[] => {
  const nestedArray = fs.readdirSync(dir).map((file: string) => {
    const dirPath = path.join(dir, file);
    const { ext, base, name } = path.parse(dirPath);

    const result = fs.statSync(dirPath).isDirectory()
      ? createFileSummaryList(dirPath)
      : {
        baseName: base,
        directory: dirPath,
        extension: ext,
        fileName: name,
        imports: makeFileImportsList(dirPath),
        type: findFileType(file, ext, fileTypes),
        uid: uuid()
      };

    return result;
  });
  return nestedArray;
};

const createFileArray = (dir: string) => {
  const fileList: object[] = createFileSummaryList(dir);
  const flatFileList: InterfaceFileOutput[] = flattenArrayDeep(fileList);
  const filesOutput: object[] = flatFileList.map((file: InterfaceFileOutput) =>
    setImportedByProperty(file, flatFileList)
  );

  return filesOutput;
};

export { createFileArray, setImportedByProperty };
