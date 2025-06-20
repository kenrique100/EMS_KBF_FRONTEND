// src/components/employees/EmployeeProfile.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { formatDate } from '@/utils/formatters';
import { Employee } from '@/types';

interface EmployeeProfileProps {
  employee: Employee;
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee }) => {
  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            sx={{ width: 100, height: 100, mr: 3 }}
            src={employee.profilePicturePath || '/default-avatar.png'}
          />
          <Box>
            <Typography variant="h5" component="div">
              {employee.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {employee.username} • {employee.email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {employee.department.displayName}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" flexWrap="wrap" mt={3}>
          <Box width="50%" mb={2}>
            <Typography variant="subtitle2" color="textSecondary">
              Status
            </Typography>
            <Typography>{employee.status}</Typography>
          </Box>
          <Box width="50%" mb={2}>
            <Typography variant="subtitle2" color="textSecondary">
              Phone Number
            </Typography>
            <Typography>{employee.phoneNumber || 'N/A'}</Typography>
          </Box>
          <Box width="50%" mb={2}>
            <Typography variant="subtitle2" color="textSecondary">
              Date of Employment
            </Typography>
            <Typography>{formatDate(employee.dateOfEmployment)}</Typography>
          </Box>
          <Box width="50%" mb={2}>
            <Typography variant="subtitle2" color="textSecondary">
              Account Created
            </Typography>
            <Typography>{formatDate(employee.createdAt)}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmployeeProfile;