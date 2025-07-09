// src/components/profile/ProfileHeader.tsx
import {
  Box,
  Typography,
  Chip,
  Button,
  Skeleton,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import EditableAvatar from '@/components/common/EditableAvatar';
import { motion } from 'framer-motion';
import { deleteProfilePicture, getProfilePictureUrl } from '@/api/profilePictures';
import { EmployeeStatus } from '@/types';

interface ProfileHeaderProps {
  name?: string;
  department?: string;
  status?: EmployeeStatus;
  profileUrl?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusUpdate?: () => void;
  onProfilePictureUpdate: (file: File) => Promise<void>;
  loading?: boolean;
  employeeId?: number;
  editable?: boolean;
}

const MotionBox = motion(Box);

const ProfileHeader = ({
                         name = '',
                         department = '',
                         status,
                         profileUrl,
                         onEdit = () => {},
                         onDelete = () => {},
                         onStatusUpdate = () => {},
                         onProfilePictureUpdate,
                         loading = false,
                         employeeId,
                         editable = false,
                       }: ProfileHeaderProps) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const getStatusColor = (status?: EmployeeStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'ON_LEAVE':
        return 'warning';
      case 'TERMINATED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status?: EmployeeStatus) => {
    if (!status) return 'UNKNOWN';
    return status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');
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

  const showAvatar = typeof employeeId === 'number';

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
      {showAvatar ? (
        <EditableAvatar
          employeeId={employeeId}
          profileUrl={profileUrl ? getProfilePictureUrl(employeeId) : undefined}
          onChange={onProfilePictureUpdate}
          onDelete={async () => {
            await deleteProfilePicture(employeeId);
            onProfilePictureUpdate?.(new File([], ''));
          }}
          size={isSmall ? 80 : 120}
          editable={editable}
          fallbackName={name}
          sx={{
            mb: 2,
            border: `3px solid ${theme.palette.background.paper}`,
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.05)' },
          }}
        />
      ) : (
        <Avatar
          sx={{
            width: isSmall ? 80 : 120,
            height: isSmall ? 80 : 120,
            mb: 2,
            fontSize: (isSmall ? 80 : 120) * 0.4,
            bgcolor: 'primary.main',
          }}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>
      )}

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
        label={getStatusLabel(status)}
        color={getStatusColor(status)}
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