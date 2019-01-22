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

// Get the file path without quotes
const getFilePathFromModule = (moduleCode: string): string => {
  // match both single and double qquoted file paths
  const filePathRegex: RegExp = new RegExp(`("[^]*?"\s?)|('[^]*?'\s?)`, "gi");
  const [filePath]: string[] = moduleCode.match(filePathRegex);
  const importPath: string = filePath.trim().replace(/"|'/g, "");

  return path.normalize(importPath);
};

// TODO: make sure that you ask the user to choose require vs import or should you allow BOTH?
// get the whole file as a string and break down the imports/requires to an array
const getFileModules = (
  codeLineWithImport: string,
  moduleType: string = "import"
): string[] => {
  // ? this takes a big string and breaks it down don't give it an array(s)
  const matchModuleType: RegExp = new RegExp(
    `(\t|^)(${moduleType}[^.]*?"[^]*?"\s?)|(${moduleType}[^.]*?'[^]*?'\s?)`,
    `mig`
  ); // this will match both single and double quotes

  try {
    const match: string[] = codeLineWithImport.match(matchModuleType);
    return match;
  } catch (e) {
    console.log(
      "Ah there was an issue with getting your files, make sure that you have chosen import or require!"
    );
  }
};

const makeFileImportsList = (filename: string): string[] => {
  if (!fs.statSync(filename).isDirectory()) {
    const fileContents: string = fs.readFileSync(filename, "utf-8");

    const importsList: string[] = getFileModules(fileContents).map(
      (line: string) => getFilePathFromModule(line)
    ); // second to check to make sure only actual file paths are returned

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

export {
  createFileArray,
  setImportedByProperty,
  getFilePathFromModule,
  getFileModules,
  makeFileImportsList
};
