import { fileTypes } from '../file-contents/fileTypes'
import { findFileType } from '../file-contents/findFileType'

describe("Find the file type for the file given", () => {
    test("when given a camel case file it should return react.", () => {
        expect(
            findFileType("FindFileType.js", ".js", fileTypes))
            .toBe("react component")
    })
    test("when given a jsx file it should return react.", () => {
        expect(
            findFileType("findFileType.jsx", ".jsx", fileTypes))
            .toBe("react")
    })
    test("when given a file type of test it should return test", () => {
        expect(
            findFileType("findFileType.test.js", ".js", fileTypes))
            .toBe("test")
    })
}

)