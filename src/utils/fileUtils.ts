// src/utils/fileUtils.ts
export const getFileUrl = (filePath: string, download = false): string => {
  if (!filePath) return '';
  const base = `${import.meta.env.VITE_API_BASE_URL}/api/employees/files`;
  const encodedPath = encodeURIComponent(filePath);
  return download
    ? `${base}/${encodedPath}?type=download`
    : `${base}/${encodedPath}`;
};