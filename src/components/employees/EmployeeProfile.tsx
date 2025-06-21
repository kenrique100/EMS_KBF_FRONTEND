import React from 'react';
import { Box, Typography, Avatar, Card, CardContent, Grid, Divider, Link } from '@mui/material';
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
                  {employee.profilePicturePath ? (
                    <Avatar
                      src={`${import.meta.env.VITE_API_BASE_URL}/api/files/${employee.profilePicturePath}`}
                      sx={{ width: 120, height: 120, mb: 2 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 120, height: 120, mb: 2 }}>
                        {employee.name.charAt(0)}
                    </Avatar>
                  )}
                  <Typography variant="h4" component="div">
                      {employee.name}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                      {employee.username} • {employee.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                      {employee.department.displayName}
                  </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                          Personal Information
                      </Typography>
                      <Box mb={2}>
                          <Typography variant="subtitle2">Status</Typography>
                          <Typography>{employee.status}</Typography>
                      </Box>
                      <Box mb={2}>
                          <Typography variant="subtitle2">Phone Number</Typography>
                          <Typography>{employee.phoneNumber || 'N/A'}</Typography>
                      </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                          Employment Details
                      </Typography>
                      <Box mb={2}>
                          <Typography variant="subtitle2">Date of Employment</Typography>
                          <Typography>{formatDate(employee.dateOfEmployment)}</Typography>
                      </Box>
                      <Box mb={2}>
                          <Typography variant="subtitle2">Account Created</Typography>
                          <Typography>{formatDate(employee.createdAt)}</Typography>
                      </Box>
                  </Grid>
              </Grid>

              {employee.documentPath && (
                <>
                    <Divider sx={{ my: 3 }} />
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Documents
                        </Typography>
                        <Link
                          href={`${import.meta.env.VITE_API_BASE_URL}/api/files/${employee.documentPath}`}
                          target="_blank"
                          download
                        >
                            Download Document
                        </Link>
                    </Box>
                </>
              )}
          </CardContent>
      </Card>
    );
};

export default EmployeeProfile;