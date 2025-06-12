// src/components/common/FileActions.tsx
import React from 'react';
import { Button, Stack } from '@mui/material';
import { downloadFile, deleteFile } from '@/api/files';
import { useNotification } from '@/contexts/NotificationContext';

interface FileActionsProps {
  filename: string;
  subDirectory: string;
  onDeleteSuccess?: () => void;
  disabled?: boolean;
}

const FileActions: React.FC<FileActionsProps> = ({
                                                   filename,
                                                   subDirectory,
                                                   onDeleteSuccess,
                                                   disabled = false
                                                 }) => {
  const { showNotification } = useNotification();

  const handleDownload = async () => {
    try {
      const blob = await downloadFile(filename, subDirectory);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Download failed';
      showNotification(errorMessage, 'error');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await deleteFile(filename, subDirectory);
        showNotification('File deleted successfully', 'success');
        onDeleteSuccess?.();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Delete failed';
        showNotification(errorMessage, 'error');
      }
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <Button
        variant="outlined"
        onClick={handleDownload}
        disabled={disabled}
      >
        Download
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={handleDelete}
        disabled={disabled}
      >
        Delete
      </Button>
    </Stack>
  );
};

export default FileActions;