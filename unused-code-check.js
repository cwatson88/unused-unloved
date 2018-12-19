const fs = require("fs");
const path = require("path");
const uuid = require("uuid/v4");

const fileTypeList = [
  {
    type: "img",
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
    ]
  },
  {
    type: "font",
    formatExtensions: [".eot", ".ttf", ".woff"]
  },
  {
    type: "styles",
    formatExtensions: [".css", ".scss", ".less"]
  },
  {
    type: "javascript",
    formatExtensions: [".js"]
  },
  {
    type: "typescript",
    formatExtensions: [".ts"]
  },
  {
    type: "react",
    formatExtensions: [".jsx", ".tsx"]
  }
];

function fileArray(dir) {
  const nestedArray = fs.readdirSync(dir).map(file => {
    let dirPath = path.join(dir, file);
    const { ext, base, name } = path.parse(dirPath);

    const result = fs.statSync(dirPath).isDirectory()
      ? fileArray(dirPath)
      : {
          uid: uuid(),
          fileName: name,
          baseName: base,
          directory: dirPath,
          type: getFileType(
            {
              file,
              ext
            },
            fileTypeList
          ),
          extension: ext,
          imports: listImports(dirPath)
        };

    return result;
  });
  return isImported(flattenArrayDeep(nestedArray));
}

function listImports(filename) {
  //? What if the line just includes the word import, is there a way to tell that
  //? it is actually doing an import and not just a false positive?
  //? checking for the word from wouldn't help 😥

  if (!fs.statSync(filename).isDirectory()) {
    const lines = fs
      .readFileSync(filename, "utf-8")
      .split("\n")
      .filter(line => line.includes("import"))
      .map(line => {
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
  const fileTypeName =
    isReactComponent(fileName, fileExtension) ||
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
  const firstLetterIsUpperCase =
    fileName.substring(0, 1) === fileName.substring(0, 1).toUpperCase();

  const reactComponentCheck =
    [".jsx", ".tsx", ".js"].some(
      reactExtension => reactExtension === fileExtension
    ) && firstLetterIsUpperCase
      ? "react component"
      : false;

  return reactComponentCheck;
}

// TODO: refactor to make this easier to read and understand
function fileTypeCheck(fileExtension, fileTypeList) {
  const fileFormatSearch = (formatExtensionList, fileExtension) =>
    formatExtensionList.some(
      formatExtension => formatExtension === fileExtension.toString()
    );

  const fileFormatResult = fileTypeList.find(({ formatExtensions }) =>
    fileFormatSearch(formatExtensions, fileExtension)
  );

  return fileFormatResult ? fileFormatResult.type : false;
}

function isImported(fileArray) {
  return fileArray.map(item => {
    item.importedBy = fileArray
      .filter(file =>
        file.imports.some(str => RegExp(item.fileName, "gi").test(str))
      )
      .map(file => file.fileName);
    return item;
  });
}

// used to flatten the nested array using reccursion
function flattenArrayDeep(nestedArray) {
  return nestedArray.reduce(
    (prev, current) =>
      Array.isArray(current)
        ? [...prev, ...flattenArrayDeep(current)]
        : [...prev, current],
    []
  );
}

function createJSONFile(startDirName) {
  fs.writeFile(
    "./unusedcode.json",
    JSON.stringify(fileArray(startDirName), null, 2),
    err => {
      if (err) throw err;
      console.log("The file has been saved!🎊🎊");
    }
  );
}

//! Begin the program: 🎉
(() => {
  const startDirName = path.basename(`${process.cwd()}/src`);
  const startPath = process.cwd();

  fs.readdirSync(startPath).some(item => item === "src")
    ? createJSONFile(startDirName)
    : console.log(
        "😥ah looks like there is not a 'src' folder in here can you please point me in the right direction by running me in your main project directory where your 'src file is!"
      );
})();
