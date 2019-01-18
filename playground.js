const fs = require('fs')

try {
  const data = fs.readFileSync(`./src/__tests__/createFileArray.test.ts`, 'utf8')
  const findEm = quoteType => {
    const matchImports = new RegExp(`(\t|^)(import[^]*?${quoteType}[^]*?${quoteType}\s?)`,`mig`)
    const matchRequires = new RegExp(`\b(require\(${quoteType}[^]*?${quoteType}\)\s?)`,`gm`)
    return matchImports
  }
  console.log(data.match(findEm(`"`)))
} catch (err) {
  console.error(err)
}