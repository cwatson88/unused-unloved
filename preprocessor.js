// This file is needed for jest to run typescript find out more at:
// http://jonathancreamer.com/testing-typescript-classes-with-jest-and-jest-mocks/
const tsc = require('typescript');  
const tsConfig = require('./tsconfig.json');

module.exports = {  
  process(src, path) {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      return tsc.transpile(
        src,
        tsConfig.compilerOptions,
        path,
        []
      );
    }
    return src;
  },
};