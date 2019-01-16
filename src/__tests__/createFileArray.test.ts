import {
  importCheck,
  setImportedByProperty
} from "../file-contents/createFileArray";

const fileArray = [
  {
    baseName: "createFileArray.ts",
    directory: "src\\file-contents\\createFileArray.ts",
    extension: ".ts",
    fileName: "createFileArray",
    imports: ["findFileArray.ts", "fileTypes.ts"],
    type: "typescript",
    uid: "0eaa4fe7-7660-42e8-b0ed-babaf95e9f44"
  },
  {
    baseName: "fileTypes.ts",
    directory: "src\\file-contents\\fileTypes.ts",
    extension: ".ts",
    fileName: "fileTypes",
    imports: [],
    type: "typescript",
    uid: "5da84399-89da-498c-8ccd-05d0b9ccef23"
  },
  {
    baseName: "findFileType.ts",
    directory: "src\\file-contents\\findFileType.ts",
    extension: ".ts",
    fileName: "findFileType",
    imports: [],
    type: "typescript",
    uid: "56c29eaf-aac3-4bb9-8d8a-98d0f9bb5681"
  },
  {
    baseName: "index.ts",
    directory: "src\\index.ts",
    extension: ".ts",
    fileName: "index",
    imports: ["chalk", "fs", "inquirer", "command-line-input\\start"],
    type: "typescript",
    uid: "79c40b38-53a8-49bf-ab25-3ea093571875"
  },
  {
    baseName: "createJsonFile.ts",
    directory: "src\\output-results\\createJsonFile.ts",
    extension: ".ts",
    fileName: "createJsonFile",
    imports: ["findFileArray.ts", "fileTypes.ts", "createFileArray.ts"],
    type: "typescript",
    uid: "aa0b1ab3-16ac-4acd-9942-661b9d87d1f7"
  },
  {
    baseName: "flattenArray.ts",
    directory: "src\\utils\\flattenArray.ts",
    extension: ".ts",
    fileName: "flattenArray",
    imports: [],
    type: "typescript",
    uid: "c3711b11-2ae6-4026-b43c-a5012d4d368d"
  },
  {
    baseName: "arrays.test.ts",
    directory: "src\\__tests__\\arrays.test.ts",
    extension: ".ts",
    fileName: "arrays.test",
    imports: ["findFileArray.ts", "fileTypes.ts"],
    type: "test",
    uid: "5880a43a-6fb4-4b96-ab58-09252b4c7f57"
  },
  {
    baseName: "findFileType.test.ts",
    directory: "src\\__tests__\\findFileType.test.ts",
    extension: ".ts",
    fileName: "findFileType.test",
    imports: ["findFileArray.ts", "fileTypes.ts"],
    type: "test",
    uid: "01b56da4-9fc1-4fa2-a8ae-a111ce8a8628"
  }
];
const file = {
  baseName: "createFileArray.ts",
  directory: "src\\file-contents\\createFileArray.ts",
  extension: ".ts",
  fileName: "createFileArray",
  imports: ["findFileArray.ts", "fileTypes.ts"],
  type: "typescript",
  uid: "0eaa4fe7-7660-42e8-b0ed-babaf95e9f44"
};

describe("Set the imported value on the file list output", () => {
  test("it should set the correct importedBy values.", () => {
    expect(setImportedByProperty(file, fileArray)).toEqual({
      baseName: "createFileArray.ts",
      directory: "src\\file-contents\\createFileArray.ts",
      extension: ".ts",
      fileName: "createFileArray",
      importedBy: ["createJsonFile"],
      imports: ["findFileArray.ts", "fileTypes.ts"],
      type: "typescript",
      uid: "0eaa4fe7-7660-42e8-b0ed-babaf95e9f44"
    });
  });
});

const correctImports = [
  'import { setImportedByProperty, checkForImports } from "../file-contents/createFileArray"; ',
  'import "somejpgfile.jpg"',
  "this import should not work"
];

describe("Test to ensure imports are correctly identified", () => {
  test("array of code lines, should return only correct urls from the array provided", () => {
    expect(importCheck(correctImports)).toEqual([
      'import { setImportedByProperty, checkForImports } from "../file-contents/createFileArray"; ',
      'import "somejpgfile.jpg"'
    ]);
  });
});
