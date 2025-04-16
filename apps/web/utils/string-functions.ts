export const pxToNumber = (value: string) => {
  if (value.endsWith('px')) {
    return parseFloat(value.slice(0, -2));
  }
  return parseFloat(value);
};
