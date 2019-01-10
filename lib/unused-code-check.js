"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const fs = require("fs");
const path = require("path");
// tslint:disable-next-line:no-submodule-imports
const uuid = require("uuid/v4");
const fileTypes = [
    {
        formatExtensions: [
            ".ai",
            ".bmp",
            ".gif",
            ".ico",
            ".jpeg",
            ".png",
            ".ps",
            ".psd",
            ".svg",
            ".tif"
        ],
        type: "img"
    },
    {
        formatExtensions: [".eot", ".ttf", ".woff"],
        type: "font"
    },
    {
        formatExtensions: [".css", ".scss", ".less"],
        type: "styles"
    },
    {
        formatExtensions: [".js"],
        type: "javascript"
    },
    {
        formatExtensions: [".ts"],
        type: "typescript"
    },
    {
        formatExtensions: [".jsx", ".tsx"],
        type: "react"
    }
];
function listImports(filename) {
    // ? What if the line just includes the word import, is there a way to tell that
    // ? it is actually doing an import and not just a false positive?
    // ? checking for the word from wouldn't help 😥
    if (!fs.statSync(filename).isDirectory()) {
        const lines = fs
            .readFileSync(filename, "utf-8")
            .split("\n")
            .filter((line) => line.includes("import"))
            .map((line) => {
            const start = line.lastIndexOf("from") + 4;
            const end = line.lastIndexOf(";") || line.length - 1; // if the dev is not using semis
            const filePath = line
                .substring(start, end)
                .trim()
                .replace(/"/g, "");
            return path.normalize(filePath);
        });
        return lines;
    }
}
function getFileType({ file: fileName, ext: fileExtension }, fileTypeList) {
    // if js OR jsx / tsx then check to see if it is a component using Pascal Check
    const fileTypeName = isReactComponent(fileName, fileExtension) ||
        isTestFile(fileName) ||
        fileTypeCheck(fileExtension, fileTypeList) ||
        "other";
    return fileTypeName;
}
function isTestFile(fileName) {
    const isTest = /\.test/gi.test(fileName);
    return isTest ? "test" : false;
}
function isReactComponent(fileName, fileExtension) {
    const firstLetterIsUpperCase = fileName.substring(0, 1) === fileName.substring(0, 1).toUpperCase();
    const reactComponentCheck = [".jsx", ".tsx", ".js"].some(reactExtension => reactExtension === fileExtension) && firstLetterIsUpperCase
        ? "react component"
        : false;
    return reactComponentCheck;
}
// TODO: refactor to make this easier to read and understand
function fileTypeCheck(fileExtension, fileTypeList) {
    const fileFormatSearch = (formatExtensionList, fileExtensionValue) => formatExtensionList.some(formatExtension => formatExtension === fileExtensionValue.toString());
    const fileFormatResult = fileTypeList.find(({ formatExtensions }) => fileFormatSearch(formatExtensions, fileExtension));
    return fileFormatResult ? fileFormatResult.type : false;
}
function isImported(fileArray) {
    return fileArray.map((item) => {
        item.importedBy = fileArray
            .filter((file) => file.imports.some((str) => RegExp(item.fileName, "gi").test(str)))
            .map((file) => file.fileName);
        return item;
    });
}
// used to flatten the nested array using reccursion
function flattenArrayDeep(nestedArray) {
    return nestedArray.reduce((prev, current) => Array.isArray(current)
        ? [...prev, ...flattenArrayDeep(current)]
        : [...prev, current], []);
}
// does this check to see if it is an array or does it create the array?
function createFileArray(dir) {
    const nestedArray = fs.readdirSync(dir).map(file => {
        const dirPath = path.join(dir, file);
        const { ext, base, name } = path.parse(dirPath);
        const result = fs.statSync(dirPath).isDirectory()
            ? createFileArray(dirPath)
            : {
                baseName: base,
                directory: dirPath,
                extension: ext,
                fileName: name,
                imports: listImports(dirPath),
                type: getFileType({
                    ext,
                    file
                }, fileTypes),
                uid: uuid()
            };
        return result;
    });
    return isImported(flattenArrayDeep(nestedArray));
}
function createJSONFile(startDirName) {
    fs.writeFile("./unused-file-report.json", JSON.stringify(createFileArray(startDirName), null, 2), err => {
        if (err) {
            throw err;
        }
        else {
            console.log(chalk_1.default.blue("The file has been saved!🎊🎊"));
            console.log(chalk_1.default.italic("Try copy and pasting the contents of unused-file-report.json into http://json2table.com/"));
        }
    });
}
// ! Begin the program: ??
const findUnusedImports = () => {
    const startDirName = path.basename(`${process.cwd()}/src`);
    const startPath = process.cwd();
    fs.readdirSync(startPath).some(item => item === "src")
        ? createJSONFile(startDirName)
        : console.log("😥ah looks like there is not a 'src' folder in here can you please point me in the right direction by running me in your main project directory where your 'src file is!");
};
exports.default = findUnusedImports;
