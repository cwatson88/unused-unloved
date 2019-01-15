import { flattenArrayDeep } from "../utils/flattenArray";

describe("test to ensure the nested array is being correctly converted to flat map array!", () => {
  it("should flatten a simple array of arrays", () => {
    expect(flattenArrayDeep([[1], [2], [3], [4]])).toEqual([1, 2, 3, 4]);
    expect(flattenArrayDeep([[1], [2], [3], [4]])).not.toEqual([
      [1],
      [2],
      [3],
      [4]
    ]);
  });
  it("should flatten a simple array of object", () => {
    expect(
      flattenArrayDeep([
        [{ number: 1 }, { number: 2 }],
        [{ number: 3 }, { number: 4 }]
      ])
    ).toEqual([{ number: 1 }, { number: 2 }, { number: 3 }, { number: 4 }]);
    expect(
      flattenArrayDeep([
        [{ number: 1 }, { number: 2 }],
        [{ number: 3 }, { number: 4 }]
      ])
    ).not.toEqual([
      [{ number: 1 }, { number: 2 }],
      [{ number: 3 }, { number: 4 }]
    ]);
  });
  it("should flatten a complex array of arrays", () => {
    expect(
      flattenArrayDeep([
        [1, [1.2, 1.2]],
        [2, [2.1, 2.2]],
        [3, [3.1, 3.2]],
        [4, [4.1, 4.2]]
      ])
    ).toEqual([1, 1.2, 1.2, 2, 2.1, 2.2, 3, 3.1, 3.2, 4, 4.1, 4.2]);
    expect(
      flattenArrayDeep([
        [1, [1.2, 1.2]],
        [2, [2.1, 2.2]],
        [3, [3.1, 3.2]],
        [4, [4.1, 4.2]]
      ])
    ).not.toEqual([
      [1, [1.2, 1.2]],
      [2, [2.1, 2.2]],
      [3, [3.1, 3.2]],
      [4, [4.1, 4.2]]
    ]);
  });
});
