// src/components/common/FileUpload.tsx
import React, { ChangeEvent, useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FileUploadProps {
  label: string;
  name: string;
  accept?: string;
  onFileChange: (file: File) => void;
  error?: boolean;
  helperText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
                                                 label,
                                                 name,
                                                 accept,
                                                 onFileChange,
                                                 error = false,
                                                 helperText = '',
                                               }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    }
  };

  return (
    <Box mb={2}>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id={`file-upload-${name}`}
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor={`file-upload-${name}`}>
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
          color={error ? 'error' : 'primary'}
        >
          {label}
        </Button>
      </label>
      {fileName && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Selected file: {fileName}
        </Typography>
      )}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;