import React from 'react';
import { Button, Stack } from '@mui/material';
import { downloadFile, deleteFile } from '@/api/files';

interface FileActionsProps {
  filename: string;
  subDirectory: string;
}

const FileActions: React.FC<FileActionsProps> = ({ filename, subDirectory }) => {
  const handleDownload = async () => {
    try {
      const blob = await downloadFile(filename, subDirectory);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFile(filename, subDirectory);
      alert('File deleted!');
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" onClick={handleDownload}>
        Download
      </Button>
      <Button variant="outlined" color="error" onClick={handleDelete}>
        Delete
      </Button>
    </Stack>
  );
};

export default FileActions;
