// src/utils/fileUtils.ts
export const getProfilePictureUrl = (employeeId: number, isThumbnail = false): string => {
  return `/api/profile-pictures/${employeeId}${isThumbnail ? '/thumbnail' : ''}`;
};

export const getProfilePictureDownloadUrl = (employeeId: number): string => {
  return `/api/profile-pictures/${employeeId}?download=true`;
};

export const validateProfilePicture = (file: File): void => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  if (!ALLOWED_TYPES.includes(file.type) && !(fileExtension === 'jpg' && ALLOWED_TYPES.includes('image/jpeg'))) {
    throw new Error(`Invalid image file type. Allowed: ${ALLOWED_TYPES.join(', ')}`);
  }

  if (file.name.includes('..')) {
    throw new Error('Filename contains invalid path sequence');
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};