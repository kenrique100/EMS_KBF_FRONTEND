// src/components/common/FileUpload.tsx
import React, { ChangeEvent, useState } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadFile } from '@/api/files';
import { useNotification } from '@/contexts/NotificationContext';
import { FileUploadResponse } from '@/utils/types';

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
      // Reset the input to allow uploading the same file again
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