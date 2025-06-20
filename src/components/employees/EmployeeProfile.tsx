import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    Box,
    Divider,
    Chip,
    Grid,
    Button,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material';
import {
    PictureAsPdf as PdfIcon,
    Description as DocIcon,
    Work as WorkIcon,
    Event as DateIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Delete as DeleteIcon,
    CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { formatDate } from '@/utils/formatters';
import { Employee } from '@/types';
import { getFileUrl } from '@/api/files';

interface EmployeeProfileProps {
    employee: Employee;
    onUploadProfilePicture?: (file: File) => Promise<void>;
    onDeleteProfilePicture?: () => Promise<void>;
    onUploadDocument?: (file: File) => Promise<void>;
    onDeleteDocument?: () => Promise<void>;
    allowEdit?: boolean;
    isCurrentUser?: boolean;
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({
                                                             employee,
                                                             onUploadProfilePicture,
                                                             onDeleteProfilePicture,
                                                             onUploadDocument,
                                                             onDeleteDocument,
                                                             allowEdit = false,
                                                             isCurrentUser = false
                                                         }) => {
    const getProfilePictureUrl = () => {
        if (!employee.profilePicturePath) return null;
        return getFileUrl(employee.profilePicturePath, 'profiles');
    };

    const getDocumentUrl = () => {
        if (!employee.documentPath) return null;
        return getFileUrl(employee.documentPath, 'documents');
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'document') => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            if (type === 'profile' && onUploadProfilePicture) {
                await onUploadProfilePicture(file);
            } else if (type === 'document' && onUploadDocument) {
                await onUploadDocument(file);
            }
        } finally {
            e.target.value = '';
        }
    };

    const getFileIcon = (filename: string) => {
        const extension = filename.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return <PdfIcon color="error" />;
            case 'doc':
            case 'docx':
                return <DocIcon color="primary" />;
            default:
                return <DocIcon />;
        }
    };

    const renderDocumentPreview = () => {
        if (!employee.documentPath) return null;

        const documentUrl = getDocumentUrl();
        const filename = employee.documentPath.split('/').pop() || 'document';

        return (
          <Box display="flex" alignItems="center" gap={2}>
              {getFileIcon(filename)}
              <Typography variant="body1">{filename}</Typography>
              <Button
                component="a"
                href={documentUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<DocIcon />}
              >
                  View
              </Button>
          </Box>
        );
    };

    const canEdit = allowEdit || isCurrentUser;

    return (
      <Card>
          <CardContent>
              <Box display="flex" alignItems="center" mb={3} flexWrap="wrap">
                  <Box position="relative" mr={3}>
                      <Avatar
                        src={getProfilePictureUrl() || undefined}
                        sx={{ width: 120, height: 120 }}
                      />
                      {canEdit && (
                        <Box position="absolute" bottom={0} right={0}>
                            <input
                              accept="image/*"
                              style={{ display: 'none' }}
                              id="profile-picture-upload"
                              type="file"
                              onChange={(e) => handleFileChange(e, 'profile')}
                            />
                            <label htmlFor="profile-picture-upload">
                                <Button
                                  variant="contained"
                                  component="span"
                                  size="small"
                                  color="primary"
                                >
                                    Change
                                </Button>
                            </label>
                            {employee.profilePicturePath && (
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                sx={{ ml: 1 }}
                                onClick={onDeleteProfilePicture}
                              >
                                  Delete
                              </Button>
                            )}
                        </Box>
                      )}
                  </Box>
                  <Box flex={1}>
                      <Typography variant="h4" component="h1">
                          {employee.name}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                          @{employee.username}
                      </Typography>
                      <Chip
                        label={employee.status}
                        color={
                            employee.status === 'ACTIVE'
                              ? 'success'
                              : employee.status === 'INACTIVE'
                                ? 'error'
                                : employee.status === 'ON_LEAVE'
                                  ? 'warning'
                                  : 'default'
                        }
                        sx={{ mt: 1 }}
                      />
                  </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 2 }}>
                          <Typography variant="h6" gutterBottom>
                              Personal Information
                          </Typography>
                          <List>
                              <ListItem>
                                  <ListItemIcon>
                                      <EmailIcon />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary="Email"
                                    secondary={employee.email || 'Not provided'}
                                  />
                              </ListItem>
                              <ListItem>
                                  <ListItemIcon>
                                      <PhoneIcon />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary="Phone"
                                    secondary={employee.phoneNumber || 'Not provided'}
                                  />
                              </ListItem>
                              <ListItem>
                                  <ListItemIcon>
                                      <WorkIcon />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary="Department"
                                    secondary={employee.department || 'Not assigned'}
                                  />
                              </ListItem>
                              <ListItem>
                                  <ListItemIcon>
                                      <DateIcon />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary="Date of Employment"
                                    secondary={formatDate(employee.dateOfEmployment)}
                                  />
                              </ListItem>
                          </List>
                      </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 2 }}>
                          <Typography variant="h6" gutterBottom>
                              Documents
                          </Typography>
                          {employee.documentPath ? (
                            <Box>
                                {renderDocumentPreview()}
                                {canEdit && (
                                  <Box mt={2}>
                                      <Button
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={onDeleteDocument}
                                      >
                                          Delete Document
                                      </Button>
                                  </Box>
                                )}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                                No documents uploaded
                            </Typography>
                          )}
                          {canEdit && (
                            <Box mt={2}>
                                <input
                                  accept=".pdf,.doc,.docx"
                                  style={{ display: 'none' }}
                                  id="document-upload"
                                  type="file"
                                  onChange={(e) => handleFileChange(e, 'document')}
                                />
                                <label htmlFor="document-upload">
                                    <Button
                                      variant="outlined"
                                      component="span"
                                      startIcon={<CloudUploadIcon />}
                                    >
                                        Upload Document
                                    </Button>
                                </label>
                            </Box>
                          )}
                      </Paper>
                  </Grid>
              </Grid>
          </CardContent>
      </Card>
    );
};

export default EmployeeProfile;