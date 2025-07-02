import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Card,
    CardContent,
    Grid,
    Divider,
    Tabs,
    Tab,
    useTheme,
    useMediaQuery,
    IconButton,
} from '@mui/material';
import { EmployeeProfileDTO } from '@/types';
import { formatDate } from '@/utils/formatters';
import EmployeeStatusHistory from './EmployeeStatusHistory';
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useRef } from 'react';

interface EmployeeProfileProps {
    employee: EmployeeProfileDTO;
    onProfilePictureUpdate?: (file: File) => Promise<void>;
}

const MotionBox = motion(Box);

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee, onProfilePictureUpdate }) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const [activeTab, setActiveTab] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && onProfilePictureUpdate) {
            await onProfilePictureUpdate(e.target.files[0]);
        }
    };

    return (
      <Card
        sx={{
            p: { xs: 2, md: 3 },
            maxWidth: 900,
            margin: 'auto',
            boxShadow: theme.shadows[4],
            borderRadius: 3,
        }}
        component={MotionBox}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
          <CardContent>
              <Box
                display="flex"
                flexDirection={isSmall ? 'column' : 'row'}
                alignItems="center"
                justifyContent="center"
                gap={3}
                mb={3}
              >
                  <Box position="relative">
                      <Avatar
                        src={employee.profilePictureUrl}
                        sx={{
                            width: isSmall ? 80 : 120,
                            height: isSmall ? 80 : 120,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                            bgcolor: employee.profilePictureUrl ? undefined : theme.palette.primary.main,
                            fontSize: isSmall ? 32 : 48,
                            fontWeight: 'bold',
                        }}
                      >
                          {!employee.profilePictureUrl && employee.name.charAt(0).toUpperCase()}
                      </Avatar>
                      {onProfilePictureUpdate && (
                        <>
                            <IconButton
                              onClick={() => fileInputRef.current?.click()}
                              size="small"
                              sx={{
                                  position: 'absolute',
                                  bottom: 0,
                                  right: 0,
                                  backgroundColor: 'white',
                                  boxShadow: 1,
                                  zIndex: 1,
                              }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              style={{ display: 'none' }}
                            />
                        </>
                      )}
                  </Box>

                  <Box textAlign={isSmall ? 'center' : 'left'}>
                      <Typography variant={isSmall ? 'h5' : 'h4'} fontWeight={700} gutterBottom>
                          {employee.name}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                          {employee.username} • {employee.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {employee.department}
                      </Typography>
                  </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant={isSmall ? 'scrollable' : 'standard'}
                scrollButtons
                allowScrollButtonsMobile
                sx={{ mb: 3 }}
              >
                  <Tab label="Profile Details" />
                  <Tab label="Status History" />
              </Tabs>

              {activeTab === 0 ? (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Personal Information
                        </Typography>
                        <Typography variant="subtitle2">Status</Typography>
                        <Typography>{employee.status}</Typography>
                        {employee.statusExpiration && (
                          <>
                              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                                  Status Expiration
                              </Typography>
                              <Typography>{formatDate(employee.statusExpiration)}</Typography>
                          </>
                        )}
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                            Phone Number
                        </Typography>
                        <Typography>{employee.phoneNumber || 'N/A'}</Typography>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                            National ID
                        </Typography>
                        <Typography>{employee.nationalId || 'N/A'}</Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Employment Details
                        </Typography>
                        <Typography variant="subtitle2">Date of Employment</Typography>
                        <Typography>{formatDate(employee.dateOfEmployment)}</Typography>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                            Account Created
                        </Typography>
                        <Typography>{formatDate(employee.createdAt)}</Typography>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                            Last Updated
                        </Typography>
                        <Typography>{formatDate(employee.updatedAt)}</Typography>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                            Productivity (Last 30 days)
                        </Typography>
                        <Typography>{employee.totalHoursWorkedLast30Days?.toFixed(1) || 0} hours</Typography>
                    </Grid>
                </Grid>
              ) : (
                <Box>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                        Status History
                    </Typography>
                    <EmployeeStatusHistory history={employee.statusHistory || []} />
                </Box>
              )}
          </CardContent>
      </Card>
    );
};

export default EmployeeProfile;