// src/components/employees/EmployeeProfile.tsx
import React from 'react';
import { Box, Typography, Avatar, Card, CardContent, Grid, Divider } from '@mui/material';
import { Employee } from '@/types';
import { formatDate } from '@/utils/formatters';

interface EmployeeProfileProps {
    employee: Employee;
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee }) => {
    return (
      <Card>
          <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                  {employee.profilePicturePath && (
                    <Avatar
                      src={employee.profilePicturePath}
                      sx={{ width: 120, height: 120, mb: 2 }}
                    />
                  )}
                  <Typography variant="h4" gutterBottom>
                      {employee.name}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                      {employee.username}
                  </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                          Personal Information
                      </Typography>
                      <Box mb={2}>
                          <Typography variant="subtitle2">Email</Typography>
                          <Typography>{employee.email}</Typography>
                      </Box>
                      <Box mb={2}>
                          <Typography variant="subtitle2">Phone</Typography>
                          <Typography>{employee.phoneNumber || 'N/A'}</Typography>
                      </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                          Employment Details
                      </Typography>
                      <Box mb={2}>
                          <Typography variant="subtitle2">Department</Typography>
                          <Typography>{employee.department.displayName}</Typography>
                      </Box>
                      <Box mb={2}>
                          <Typography variant="subtitle2">Date of Employment</Typography>
                          <Typography>
                              {formatDate(employee.dateOfEmployment)}
                          </Typography>
                      </Box>
                      <Box mb={2}>
                          <Typography variant="subtitle2">Status</Typography>
                          <Typography>{employee.status}</Typography>
                      </Box>
                  </Grid>
              </Grid>
          </CardContent>
      </Card>
    );
};

export default EmployeeProfile;