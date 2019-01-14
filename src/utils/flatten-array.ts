// used to flatten the nested array using reccursion
const flattenArrayDeep = (nestedArray: any[]): any[] =>
  nestedArray.reduce(
    (prev, current) =>
      Array.isArray(current)
        ? [...prev, ...flattenArrayDeep(current)]
        : [...prev, current],
    []
  );

export { flattenArrayDeep };
