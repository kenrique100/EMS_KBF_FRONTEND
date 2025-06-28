// src/components/common/EditableAvatar.tsx
import React, { useState } from 'react';
import { Avatar, Box, IconButton, SxProps, Theme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';

interface EditableAvatarProps {
  src?: string;
  alt: string;
  onChange: (file: File) => Promise<void>;
  size: number;
  sx?: SxProps<Theme>;
}

const Input = styled('input')({
  display: 'none',
});

const EditableAvatar: React.FC<EditableAvatarProps> = ({
                                                         src,
                                                         alt,
                                                         onChange,
                                                         size,
                                                         sx
                                                       }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      try {
        await onChange(e.target.files[0]);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        ...sx,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar
        src={src}
        alt={alt}
        sx={{
          width: '100%',
          height: '100%',
          transition: 'opacity 0.3s',
          opacity: isHovered ? 0.7 : 1,
        }}
      >
        {alt.charAt(0)}
      </Avatar>

      {isHovered && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <label htmlFor="avatar-upload">
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <IconButton
              color="primary"
              component="span"
              disabled={isUploading}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <EditIcon />
            </IconButton>
          </label>
        </Box>
      )}
    </Box>
  );
};

export default EditableAvatar;