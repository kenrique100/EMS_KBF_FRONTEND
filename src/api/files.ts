

export const getFileUrl = (filename: string, subDirectory: string): string => {
  return `/api/employees/files/${subDirectory}/${filename}`;
};