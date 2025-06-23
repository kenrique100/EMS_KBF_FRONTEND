// src/utils/fileUtils.ts
export const getFileUrl = (filePath: string | undefined, isDownload = false): string => {
  if (!filePath) return '';
  const encodedPath = encodeURIComponent(filePath);
  return isDownload
    ? `/api/employees/files/${encodedPath}?type=download`
    : `/api/employees/files/${encodedPath}`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const validateFile = (file: File, fileType: 'image' | 'document'): void => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  const ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  const allowedTypes = fileType === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_DOCUMENT_TYPES;
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  if (!allowedTypes.includes(file.type) && !(
    fileExtension === 'jpg' && allowedTypes.includes('image/jpeg') ||
    fileExtension === 'docx' && allowedTypes.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  )) {
    throw new Error(`Invalid ${fileType} file type. Allowed: ${allowedTypes.join(', ')}`);
  }

  if (file.name.includes('..')) {
    throw new Error('Filename contains invalid path sequence');
  }
};