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

const importCheck = (codeLinesWithImport: string[]): string[] => {
  const imports = codeLinesWithImport.filter((line: string) => {
    const importLine: string = line.trim();
    const importRegex = /^(\bimport\b)/gim;
    const stringRegex = /\"/gi;

    return (
      importRegex.test(importLine) && importLine.match(stringRegex).length > 1
    );
  });

  return imports;
};

const getImportedFilePath = (codeLineWithImport: string, quotesType: string = "double"): string => {
  // Should this auto change quotes or ask the user? 
  // Do we need more robust checking in place to find the imported path?

  let quotes;

  switch (quotesType) {
    case 'single':
      quotes = /\'(\w|\W)+?\'/gi
      break
    case 'double':
      quotes = /\"(\w|\W)+?\"/gi
      break;
    default:
      console.log("Please define the types of string that you are using for imports")
  }

  if (quotes.test(codeLineWithImport)) {

    const [filePath] = codeLineWithImport.match(quotes) // take the first value and discard the rest
    const importPath = filePath.trim().replace(/"/g, "")

    return path.normalize(importPath);
  } else {
    return null
  }

}

const makeFileImportsList = (filename: string): string[] => {

  if (!fs.statSync(filename).isDirectory()) {
    const codeLines: string[] = fs.readFileSync(filename, "utf-8").split("\n");

    const importsList: string[] =
      importCheck(codeLines)
        .filter((line: string) => getImportedFilePath(line)) // second to check to make sure only actual file paths are returned

    return importsList
  };
}

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

export {
  createFileArray,
  setImportedByProperty,
  getImportedFilePath,
  importCheck
}
