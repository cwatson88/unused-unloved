interface InterfaceFileType {
  formatExtensions: string[];
  type: string;
}

interface InterfaceForFileCheck {
  fileName: string;
  fileExtension: string;
  fileTypeList: InterfaceFileType[];
}

type StringOrBool = string | boolean;

type CheckFunction = (InterfaceForFileCheck) => StringOrBool;

// take a single file and check against the list of file types to find out which type it it

/*
 * how?
 * -  if the file is jsx or tsx it's react but also if the name is pascal case and js
 * -  if it ends in scss, less, sass, or css then they are css / style files
 * -  if they are MD then they are markdown files
 * -  if they have the word .test in them then they are test files
 * -  if they have any image extensions e.g. png, svg, jpg then they are images
 * -  anything else and they are other files (eventually check for TS / Vue files)
 */

const isTestFile = ({ fileName }: InterfaceForFileCheck): StringOrBool =>
  /\.test/gi.test(fileName) ? "test" : false;

const isReactComponent = ({
  fileName,
  fileExtension
}: InterfaceForFileCheck): StringOrBool => {
  const firstLetterIsUpperCase =
    fileName.substring(0, 1) === fileName.substring(0, 1).toUpperCase();

  const reactComponentCheck: StringOrBool =
    [".jsx", ".tsx", ".js"].some(
      reactExtension => reactExtension === fileExtension
    ) && firstLetterIsUpperCase
      ? "react component"
      : false;

  return reactComponentCheck;
};

const genralFileCheck = ({
  fileExtension,
  fileTypeList
}: InterfaceForFileCheck): StringOrBool =>
  fileTypeList.find(({ formatExtensions }: { formatExtensions: string[] }) =>
    formatExtensions.some(
      (extension: string) => extension === fileExtension.toString()
    )
  ).type || false;

const findFileType = (
  fileName: string,
  fileExtension: string,
  fileTypeList: InterfaceFileType[]
): any => {
  const fileCheckFunctions = [isTestFile, isReactComponent, genralFileCheck];
  for (const check of fileCheckFunctions) {
    const res: StringOrBool = check({ fileName, fileExtension, fileTypeList });
    if (res) {
      return res;
    }
  }
  return "other";
};

export { findFileType };
