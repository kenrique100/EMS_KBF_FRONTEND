// src/components/employees/EmployeeProfile.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Card, CardContent, Grid, Divider, Link, Tabs, Tab } from '@mui/material';
import { EmployeeProfileDTO, ProductivityStatsDTO } from '@/types';
import { formatDate } from '@/utils/formatters';
import EmployeeStatusHistory from './EmployeeStatusHistory';
import ProductivityDashboard from '@/pages/dashboard/ProductivityDashboard';
import { getProductivityStats } from '@/api/employees';

interface EmployeeProfileProps {
    employee: EmployeeProfileDTO;
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [productivityStats, setProductivityStats] = useState<ProductivityStatsDTO | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    const profileUrl = employee.profilePicturePath
      ? `${import.meta.env.VITE_API_BASE_URL}${employee.profilePicturePath}`
      : null;

    const documentUrl = employee.documentPath
      ? `${import.meta.env.VITE_API_BASE_URL}${employee.documentPath}`
      : null;

    useEffect(() => {
        const fetchProductivityStats = async () => {
            try {
                setLoadingStats(true);
                const stats = await getProductivityStats(employee.id);
                setProductivityStats(stats);
            } catch (error) {
                console.error('Failed to fetch productivity stats:', error);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchProductivityStats();
    }, [employee.id]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
      <Card>
          <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                  {profileUrl ? (
                    <Avatar
                      src={profileUrl}
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
                      {employee.department}
                  </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Productivity Dashboard */}
              {!loadingStats && productivityStats && (
                <ProductivityDashboard employeeId={employee.id} />
              )}

              <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                  <Tab label="Profile Details" />
                  <Tab label="Status History" />
                  {documentUrl && <Tab label="Documents" />}
              </Tabs>

              {activeTab === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Personal Information
                        </Typography>
                        <Box mb={2}>
                            <Typography variant="subtitle2">Status</Typography>
                            <Typography>{employee.status}</Typography>
                        </Box>
                        {employee.statusExpiration && (
                          <Box mb={2}>
                              <Typography variant="subtitle2">Status Expiration</Typography>
                              <Typography>{formatDate(employee.statusExpiration)}</Typography>
                          </Box>
                        )}
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
                        <Box mb={2}>
                            <Typography variant="subtitle2">Last Updated</Typography>
                            <Typography>{formatDate(employee.updatedAt)}</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2">Productivity (Last 30 days)</Typography>
                            <Typography>
                                {employee.totalHoursWorkedLast30Days?.toFixed(1) || 0} hours
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
              )}

              {activeTab === 1 && (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Status History
                    </Typography>
                    <EmployeeStatusHistory history={employee.statusHistory} />
                </Box>
              )}

              {activeTab === 2 && documentUrl && (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Documents
                    </Typography>
                    <Link
                      href={documentUrl}
                      target="_blank"
                      download
                    >
                        Download Document
                    </Link>
                </Box>
              )}
          </CardContent>
      </Card>
    );
};

export default EmployeeProfile;