// src/components/employees/EmployeeProfile.tsx
import { Card, CardContent, Typography, Avatar, Box, Divider, Chip, Grid } from '@mui/material';
import { formatDate } from '@/utils/formatters';
import React from 'react';
import { Employee } from '@/utils/types';

interface EmployeeProfileProps {
    employee: Employee;
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee }) => {
    const getProfilePictureUrl = () => {
        if (typeof employee.profilePicture === 'string') {
            return employee.profilePicture.startsWith('http')
              ? employee.profilePicture
              : `/api/employees/files/profiles/${employee.profilePicture}`;
        }
        return undefined;
    };

    return (
      <Card>
          <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                  <Avatar
                    src={getProfilePictureUrl()}
                    sx={{ width: 100, height: 100, mr: 3 }}
                  />
                  <Box>
                      <Typography variant="h4">{employee.name}</Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                          @{employee.username}
                      </Typography>
                      <Chip
                        label={employee.status}
                        color={
                            employee.status === 'ACTIVE' ? 'success' :
                              employee.status === 'INACTIVE' ? 'error' :
                                employee.status === 'ON_LEAVE' ? 'warning' : 'default'
                        }
                        sx={{ mt: 1 }}
                      />
                  </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                      <Typography variant="body1" gutterBottom>
                          <strong>Email:</strong> {employee.email || 'N/A'}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                          <strong>Phone:</strong> {employee.phoneNumber || 'N/A'}
                      </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                      <Typography variant="body1" gutterBottom>
                          <strong>Department:</strong> {employee.department || 'N/A'}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                          <strong>Date of Employment:</strong> {formatDate(employee.dateOfEmployment)}
                      </Typography>
                  </Grid>
              </Grid>

              {employee.createdAt && (
                <Typography variant="body2" color="text.secondary" mt={2}>
                    Created: {formatDate(employee.createdAt)}
                </Typography>
              )}
              {employee.updatedAt && (
                <Typography variant="body2" color="text.secondary">
                    Last Updated: {formatDate(employee.updatedAt)}
                </Typography>
              )}
          </CardContent>
      </Card>
    );
};

export default EmployeeProfile;