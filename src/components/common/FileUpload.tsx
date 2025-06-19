import React, { ChangeEvent, useState } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadFile } from '@/api/files';
import { useNotification } from '@/contexts/NotificationContext';
import { FileUploadResponse } from '@/types';

interface FileUploadProps {
  label: string;
  subDirectory: string;
  onUploadSuccess: (response: FileUploadResponse) => void;
  accept?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
                                                 label,
                                                 subDirectory,
                                                 onUploadSuccess,
                                                 accept,
                                                 disabled = false,
                                               }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const { showNotification } = useNotification();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const fileType = file.type;

      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return `.${fileExtension}` === type;
        }
        return fileType.match(type.replace('*', '.*'));
      });

      if (!isValidType) {
        showNotification(`Invalid file type. Accepted types: ${accept}`, 'error');
        return;
      }
    }

    // Validate file size
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      showNotification('File size exceeds 5MB limit', 'error');
      return;
    }

    setFileName(file.name);
    setIsUploading(true);

    try {
      const response = await uploadFile(file, subDirectory);
      onUploadSuccess(response);
      showNotification('File uploaded successfully', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'File upload failed';
      showNotification(errorMessage, 'error');
      setFileName('');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <Box mb={2}>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id={`file-upload-${subDirectory}`}
        type="file"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
      <label htmlFor={`file-upload-${subDirectory}`}>
        <Button
          variant="outlined"
          component="span"
          startIcon={isUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          disabled={disabled || isUploading}
        >
          {label}
        </Button>
      </label>
      {fileName && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {isUploading ? 'Uploading...' : `Selected file: ${fileName}`}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;