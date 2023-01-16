export const formatError = (string: string) => {
  const removeSlashAndHyphen = string
    .substring(string.lastIndexOf("/") + 1)
    .replace(/-/g, " ")
    .replace(/[)]/g, "");
  const error =
    removeSlashAndHyphen.charAt(0).toUpperCase() +
    removeSlashAndHyphen.slice(1);
  return error;
};
