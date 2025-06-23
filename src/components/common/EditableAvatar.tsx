// src/components/common/EditableAvatar.tsx
import React, { useState, useRef } from 'react';
import { Avatar, IconButton, CircularProgress, Box, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { validateFile } from '@/utils/fileUtils';

interface EditableAvatarProps {
  src?: string;
  alt: string;
  onChange: (file: File) => Promise<void>;
  size?: number;
  disabled?: boolean;
}

const EditableAvatar: React.FC<EditableAvatarProps> = ({
                                                         src,
                                                         alt,
                                                         onChange,
                                                         size = 120,
                                                         disabled = false
                                                       }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInitial = alt.charAt(0).toUpperCase();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validate the file before upload
      validateFile(file, 'image');
      setError(null);
      setLoading(true);
      await onChange(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid file');
      console.error('Error uploading profile picture:', err);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Box sx={{
      position: 'relative',
      width: size,
      height: size,
      margin: '0 auto'
    }}>
      {loading ? (
        <CircularProgress
          size={size}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      ) : (
        <Avatar
          src={src}
          alt={alt}
          sx={{
            width: '100%',
            height: '100%',
            fontSize: size * 0.5,
            cursor: disabled ? 'default' : 'pointer',
            border: error ? '2px solid #f44336' : '2px solid #e0e0e0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          {!src && nameInitial}
        </Avatar>
      )}

      {!disabled && (
        <>
          <Tooltip title="Change profile picture">
            <IconButton
              color="primary"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' },
                boxShadow: 1
              }}
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/gif, image/webp"
            style={{ display: 'none' }}
            disabled={loading || disabled}
          />
        </>
      )}

      {error && (
        <Typography
          color="error"
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 1
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default EditableAvatar;