// src/components/common/EditableAvatar.tsx
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Skeleton,
  SxProps,
  Theme,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  uploadProfilePicture,
  deleteProfilePicture,
  getProfilePictureUrl,
} from '@/api/profilePictures';
import { useAuthStore } from '@/store/authStore';

export interface EditableAvatarProps {
  employeeId: number;
  size?: number;
  editable?: boolean;
  onUpdate?: () => void;
  fallbackName?: string;
  profileUrl?: string;
  onChange?: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
  sx?: SxProps<Theme>;
}

const EditableAvatar: React.FC<EditableAvatarProps> = ({
                                                         employeeId,
                                                         size = 120,
                                                         editable = false,
                                                         onUpdate,
                                                         fallbackName = 'U',
                                                         profileUrl,
                                                         onChange,
                                                         onDelete,
                                                         sx = {},
                                                       }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(profileUrl);
  const [isLoading, setIsLoading] = useState(!profileUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    if (profileUrl) {
      setImageUrl(profileUrl);
      setIsLoading(false);
      return;
    }

    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const loadImage = async () => {
      try {
        setIsLoading(true);
        if (imageUrl && !profileUrl) {
          URL.revokeObjectURL(imageUrl);
        }

        const url = getProfilePictureUrl(employeeId);
        setImageUrl(url);
      } catch (error) {
        console.error('Failed to load profile picture:', error);
        if (isMounted) {
          setImageUrl(undefined);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [employeeId, profileUrl, isAuthenticated]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setIsUploading(true);
    try {
      if (onChange) {
        await onChange(file);
      } else {
        await uploadProfilePicture(employeeId, file);
        const newUrl = getProfilePictureUrl(employeeId);
        setImageUrl(newUrl);
      }
      onUpdate?.();
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
    } finally {
      setIsUploading(false);
      setAnchorEl(null);
    }
  };

  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete();
      } else {
        await deleteProfilePicture(employeeId);
        setImageUrl(undefined);
      }
      onUpdate?.();
    } catch (error) {
      console.error('Failed to delete profile picture:', error);
    } finally {
      setAnchorEl(null);
    }
  };

  if (isLoading) {
    return <Skeleton variant="circular" width={size} height={size} />;
  }

  return (
    <Box sx={{ position: 'relative', width: size, height: size, ...sx }}>
      <Avatar
        src={imageUrl}
        alt={fallbackName}
        sx={{
          width: '100%',
          height: '100%',
          fontSize: size * 0.4,
          bgcolor: imageUrl ? 'transparent' : 'primary.main',
        }}
      >
        {!imageUrl && fallbackName.charAt(0).toUpperCase()}
      </Avatar>

      {editable && (
        <>
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'action.hover' },
            }}
            disabled={isUploading}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem component="label" disabled={isUploading}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Upload
              <input
                type="file"
                hidden
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
            </MenuItem>
            {imageUrl && (
              <MenuItem onClick={handleDelete} disabled={isUploading}>
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                Delete
              </MenuItem>
            )}
          </Menu>
        </>
      )}
    </Box>
  );
};

export default EditableAvatar;