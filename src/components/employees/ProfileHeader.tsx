// src/components/employees/ProfileHeader.tsx
import { Box, Typography, Chip, Button, Skeleton, useTheme, useMediaQuery } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import EditableAvatar from '@/components/common/EditableAvatar';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  name?: string;
  department?: string;
  status?: string;
  profileUrl?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusUpdate?: () => void;
  onProfilePictureUpdate: (file: File) => Promise<void>;
  loading?: boolean;
}

const MotionBox = motion(Box);

const ProfileHeader = ({
                         name = '',
                         department = '',
                         status = '',
                         profileUrl,
                         onEdit = () => {},
                         onDelete = () => {},
                         onStatusUpdate = () => {},
                         onProfilePictureUpdate,
                         loading = false
                       }: ProfileHeaderProps) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const getStatusColor = () => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'ON_LEAVE': return 'warning';
      case 'TERMINATED': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          py: 4,
          px: 2,
        }}
      >
        <Skeleton variant="circular" width={isSmall ? 80 : 120} height={isSmall ? 80 : 120} />
        <Skeleton width={isSmall ? 140 : 220} height={isSmall ? 28 : 40} />
        <Skeleton width={isSmall ? 100 : 160} height={isSmall ? 20 : 32} />
      </Box>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 4,
        px: 2,
      }}
    >
      <EditableAvatar
        src={profileUrl}
        alt={name}
        onChange={onProfilePictureUpdate}
        size={isSmall ? 80 : 120}
        sx={{
          mb: 2,
          border: `3px solid ${theme.palette.background.paper}`,
          boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      />

      <Typography
        variant={isSmall ? 'h6' : 'h4'}
        sx={{ fontWeight: 600, mb: 0.5, textAlign: 'center' }}
      >
        {name}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 1.5, textAlign: 'center' }}
      >
        {department}
      </Typography>

      <Chip
        label={status}
        color={getStatusColor()}
        sx={{
          mb: 3,
          fontWeight: 500,
          fontSize: isSmall ? '0.7rem' : '0.85rem',
          px: 2,
          py: 0.5,
          borderRadius: 1.5,
          letterSpacing: 0.5,
        }}
      />

      <Box
        sx={{
          display: 'flex',
          gap: isSmall ? 1 : 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 360,
        }}
      >
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={onEdit}
          size={isSmall ? 'small' : 'medium'}
          fullWidth={isSmall}
          sx={{ flexGrow: isSmall ? 1 : 'unset' }}
        >
          Edit
        </Button>

        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onDelete}
          size={isSmall ? 'small' : 'medium'}
          fullWidth={isSmall}
          sx={{ flexGrow: isSmall ? 1 : 'unset' }}
        >
          Delete
        </Button>
      </Box>

      <Button
        variant="outlined"
        color="secondary"
        onClick={onStatusUpdate}
        sx={{ mt: 3, width: isSmall ? '100%' : 'auto' }}
        size={isSmall ? 'small' : 'medium'}
      >
        Update Status
      </Button>
    </MotionBox>
  );
};

export default ProfileHeader;
