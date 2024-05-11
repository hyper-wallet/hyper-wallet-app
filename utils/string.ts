export const capitalized = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const middleEllipsis = (str: string, charCount = 5) => {
  return (
    str.slice(0, charCount) +
    "..." +
    str.slice(str.length - charCount, str.length - 1)
  );
};
