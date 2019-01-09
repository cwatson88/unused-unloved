import * as fs from 'fs'
import * as path from 'path';
import * as uuid from 'uuid/v4'

interface InterfaceFileType {
  formatExtensions: string[],
  type: string
}


const fileTypes = [
  {
    formatExtensions: [
      '.ai',
      '.bmp',
      '.gif',
      '.ico',
      '.jpeg',
      '.png',
      '.ps',
      '.psd',
      '.svg',
      '.tif',
    ],
    type: 'img',
  },
  {
    formatExtensions: ['.eot', '.ttf', '.woff'],
    type: 'font',
  },
  {
    formatExtensions: ['.css', '.scss', '.less'],
    type: 'styles',
  },
  {
    formatExtensions: ['.js'],
    type: 'javascript',
  },
  {
    formatExtensions: ['.ts'],
    type: 'typescript',
  },
  {
    formatExtensions: ['.jsx', '.tsx'],
    type: 'react',
  },
];


function listImports(filename: string) {
  // ? What if the line just includes the word import, is there a way to tell that
  // ? it is actually doing an import and not just a false positive?
  // ? checking for the word from wouldn't help 😥

  if (!fs.statSync(filename).isDirectory()) {
    const lines = fs
      .readFileSync(filename, 'utf-8')
      .split('\n')
      .filter((line: string) => line.includes('import'))
      .map((line: string) => {
        const start = line.lastIndexOf('from') + 4;
        const end = line.lastIndexOf(';') || line.length - 1; // if the dev is not using semis
        const filePath = line
          .substring(start, end)
          .trim()
          .replace(/"/g, '');

        return path.normalize(filePath);
      });

    return lines;
  }
}

function getFileType({ file: fileName, ext: fileExtension }, fileTypeList) {
  // if js OR jsx / tsx then check to see if it is a component using Pascal Check
  const fileTypeName = isReactComponent(fileName, fileExtension)
    || isTestFile(fileName)
    || fileTypeCheck(fileExtension, fileTypeList)
    || 'other';

  return fileTypeName;
}

function isTestFile(fileName: string) {
  const isTest = /\.test/gi.test(fileName);
  return isTest ? 'test' : false;
}

function isReactComponent(fileName: string, fileExtension: string) {
  const firstLetterIsUpperCase = fileName
    .substring(0, 1) === fileName.substring(0, 1).toUpperCase();

  const reactComponentCheck = ['.jsx', '.tsx', '.js'].some(
    reactExtension => reactExtension === fileExtension,
  ) && firstLetterIsUpperCase
    ? 'react component'
    : false;

  return reactComponentCheck;
}

// TODO: refactor to make this easier to read and understand
function fileTypeCheck(fileExtension: string, fileTypeList: InterfaceFileType[]): string {

  const fileFormatSearch = (formatExtensionList: string[], fileExtensionValue) => formatExtensionList.some(
    formatExtension => formatExtension === fileExtensionValue.toString(),
  );

  const fileFormatResult: any = fileTypeList
    .find(({ formatExtensions }) => fileFormatSearch(formatExtensions, fileExtension));

  return fileFormatResult ? fileFormatResult.type : false;
}


function isImported(fileArray: string[]): object {
  return fileArray.map((item) => {
    item.importedBy = fileArray
      .filter(file => file.imports.some(str => RegExp(item.fileName, 'gi').test(str)))
      .map(file => file.fileName);
    return item;
  });
}
// used to flatten the nested array using reccursion
function flattenArrayDeep(nestedArray: string[]): any[] {
  return nestedArray.reduce(
    (prev, current) => (Array.isArray(current)
      ? [...prev, ...flattenArrayDeep(current)]
      : [...prev, current]),
    [],
  );
}

// does this check to see if it is an array or does it create the array?
function createFileArray(dir: string) {
  const nestedArray = fs.readdirSync(dir).map((file) => {
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
        type: getFileType(
          {
            ext,
            file,
          },
          fileTypes,
        ),
        uid: uuid(),
      };

    return result;
  });
  return isImported(flattenArrayDeep(nestedArray));
}


function createJSONFile(startDirName: string) {
  fs.writeFile(
    './unusedcode.json',
    JSON.stringify(createFileArray(startDirName), null, 2),
    (err) => {
      if (err) { throw err }
      else { console.log('The file has been saved!🎊🎊') }

    },
  );
}

// ! Begin the program: ??
(() => {
  const startDirName: string = path.basename(`${process.cwd()}/src`);
  const startPath: string = process.cwd();

  fs.readdirSync(startPath).some(item => item === 'src')
    ? createJSONFile(startDirName)
    : console.log(
      "😥ah looks like there is not a 'src' folder in here can you please point me in the right direction by running me in your main project directory where your 'src file is!",
    );
})();
