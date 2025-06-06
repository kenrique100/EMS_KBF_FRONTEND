import { Box, Typography, Avatar, Button, Chip, Divider, Grid } from '@mui/material';
import { formatDate } from '@/utils/formatters';
import React from "react";

interface Employee {
    id?: string;
    username: string;
    name: string;
    profilePicturePath?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
    dateOfEmployment: string | Date;
    createdAt: string | Date;
    updatedAt: string | Date;
    documentPath?: string;
}

interface EmployeeProfileProps {
    employee: Employee;
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee }) => {
    return (
        <Box>
            <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                    src={employee.profilePicturePath}
                    sx={{ width: 100, height: 100, mr: 3 }}
                />
                <Box>
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
                                    ? 'default'
                                    : 'error'
                        }
                        sx={{ mt: 1 }}
                    />
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Basic Information
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Date of Employment:</strong>{' '}
                        {formatDate(employee.dateOfEmployment)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Account Created:</strong>{' '}
                        {formatDate(employee.createdAt)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Last Updated:</strong>{' '}
                        {formatDate(employee.updatedAt)}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Documents
                    </Typography>
                    {employee.documentPath ? (
                        <Button
                            variant="outlined"
                            color="primary"
                            href={employee.documentPath}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Download Document
                        </Button>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No documents uploaded
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default EmployeeProfile;
