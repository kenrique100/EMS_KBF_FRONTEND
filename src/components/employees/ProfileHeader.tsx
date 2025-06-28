// src/components/employees/ProfileHeader.tsx
import { Box, Typography, Chip, Button, Skeleton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import EditableAvatar from '@/components/common/EditableAvatar';

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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Skeleton variant="circular" width={120} height={120} />
        <Skeleton width={200} height={40} sx={{ mt: 2 }} />
        <Skeleton width={100} height={32} sx={{ mt: 1 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
      <EditableAvatar
        src={profileUrl}
        alt={name}
        onChange={onProfilePictureUpdate}
        size={120}
        sx={{
          mb: 2,
          border: '3px solid #f5f5f5',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      />
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
        {name}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
        {department}
      </Typography>
      <Chip
        label={status}
        color={getStatusColor()}
        sx={{ mb: 2, fontWeight: 500, fontSize: '0.8rem' }}
      />
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={onEdit}
          size="small"
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onDelete}
          size="small"
        >
          Delete
        </Button>
      </Box>
      <Button
        variant="outlined"
        color="secondary"
        onClick={onStatusUpdate}
        sx={{ mt: 2 }}
        size="small"
      >
        Update Status
      </Button>
    </Box>
  );
};

export default ProfileHeader;