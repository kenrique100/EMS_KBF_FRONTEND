import React from 'react';
import { Button, Stack } from '@mui/material';
import { useNotification } from '@/contexts/NotificationContext';

interface FileActionsProps {
  fileUrl: string;
  filename: string;
  onDelete: () => void;
  disabled?: boolean;
}

const FileActions: React.FC<FileActionsProps> = ({
                                                   fileUrl,
                                                   filename,
                                                   onDelete,
                                                   disabled = false
                                                 }) => {
  const { showNotification } = useNotification();

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Download failed';
      showNotification(errorMessage, 'error');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        onDelete();
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