var path = require('path');
var uuid = require('uuid/v4');
var fileTypeList = [
    {
        type: 'img',
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
    },
    {
        type: 'font',
        formatExtensions: ['.eot', '.ttf', '.woff'],
    },
    {
        type: 'styles',
        formatExtensions: ['.css', '.scss', '.less'],
    },
    {
        type: 'javascript',
        formatExtensions: ['.js'],
    },
    {
        type: 'typescript',
        formatExtensions: ['.ts'],
    },
    {
        type: 'react',
        formatExtensions: ['.jsx', '.tsx'],
    },
];
function listImports(filename) {
    // ? What if the line just includes the word import, is there a way to tell that
    // ? it is actually doing an import and not just a false positive?
    // ? checking for the word from wouldn't help 😥
    if (!fs.statSync(filename).isDirectory()) {
        var lines = fs
            .readFileSync(filename, 'utf-8')
            .split('\n')
            .filter(function (line) { return line.includes('import'); })
            .map(function (line) {
            var start = line.lastIndexOf('from') + 4;
            var end = line.lastIndexOf(';') || line.length - 1; // if the dev is not using semis
            var filePath = line
                .substring(start, end)
                .trim()
                .replace(/"/g, '');
            return path.normalize(filePath);
        });
        return lines;
    }
}
function getFileType(_a, fileTypeList) {
    var fileName = _a.file, fileExtension = _a.ext;
    // if js OR jsx / tsx then check to see if it is a component using Pascal Check
    var fileTypeName = isReactComponent(fileName, fileExtension)
        || isTestFile(fileName)
        || fileTypeCheck(fileExtension, fileTypeList)
        || 'other';
    return fileTypeName;
}
function isTestFile(fileName) {
    var isTest = /\.test/gi.test(fileName);
    return isTest ? 'test' : false;
}
function isReactComponent(fileName, fileExtension) {
    var firstLetterIsUpperCase = fileName
        .substring(0, 1) === fileName.substring(0, 1).toUpperCase();
    var reactComponentCheck = ['.jsx', '.tsx', '.js'].some(function (reactExtension) { return reactExtension === fileExtension; }) && firstLetterIsUpperCase
        ? 'react component'
        : false;
    return reactComponentCheck;
}
// TODO: refactor to make this easier to read and understand
function fileTypeCheck(fileExtension, fileTypeList) {
    var fileFormatSearch = function (formatExtensionList, fileExtension) { return formatExtensionList.some(function (formatExtension) { return formatExtension === fileExtension.toString(); }); };
    var fileFormatResult = fileTypeList
        .find(function (_a) {
        var formatExtensions = _a.formatExtensions;
        return fileFormatSearch(formatExtensions, fileExtension);
    });
    return fileFormatResult ? fileFormatResult.type : false;
}
function isImported(fileArray) {
    return fileArray.map(function (item) {
        item.importedBy = fileArray
            .filter(function (file) { return file.imports.some(function (str) { return RegExp(item.fileName, 'gi').test(str); }); })
            .map(function (file) { return file.fileName; });
        return item;
    });
}
// used to flatten the nested array using reccursion
function flattenArrayDeep(nestedArray) {
    return nestedArray.reduce(function (prev, current) { return (Array.isArray(current)
        ? prev.concat(flattenArrayDeep(current)) : prev.concat([current])); }, []);
}
function fileArray(dir) {
    var nestedArray = fs.readdirSync(dir).map(function (file) {
        var dirPath = path.join(dir, file);
        var _a = path.parse(dirPath), ext = _a.ext, base = _a.base, name = _a.name;
        var result = fs.statSync(dirPath).isDirectory()
            ? fileArray(dirPath)
            : {
                uid: uuid(),
                fileName: name,
                baseName: base,
                directory: dirPath,
                type: getFileType({
                    file: file,
                    ext: ext,
                }, fileTypeList),
                extension: ext,
                imports: listImports(dirPath),
            };
        return result;
    });
    return isImported(flattenArrayDeep(nestedArray));
}
function createJSONFile(startDirName) {
    fs.writeFile('./unusedcode.json', JSON.stringify(fileArray(startDirName), null, 2), function (err) {
        if (err)
            throw err;
        console.log('The file has been saved!🎊🎊');
    });
}
//! Begin the program: 🎉
(function () {
    var startDirName = path.basename(process.cwd() + "/src");
    var startPath = process.cwd();
    fs.readdirSync(startPath).some(function (item) { return item === 'src'; })
        ? createJSONFile(startDirName)
        : console.log("😥ah looks like there is not a 'src' folder in here can you please point me in the right direction by running me in your main project directory where your 'src file is!");
})();
