// src/components/employees/EmployeeProfile.tsx
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import { Employee } from '@/utils/types';
import { formatDate } from '@/utils/formatters';

interface EmployeeProfileProps {
    employee: Employee;
}

const EmployeeProfile = ({ employee }: EmployeeProfileProps) => {
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
                      <Typography variant="body1">
                          Status: {employee.status}
                      </Typography>
                  </Box>
              </Box>

              <Typography variant="body1">
                  Date of Employment: {formatDate(employee.dateOfEmployment)}
              </Typography>
              {employee.createdAt && (
                <Typography variant="body1">
                    Created: {formatDate(employee.createdAt)}
                </Typography>
              )}
              {employee.updatedAt && (
                <Typography variant="body1">
                    Last Updated: {formatDate(employee.updatedAt)}
                </Typography>
              )}
          </CardContent>
      </Card>
    );
};

export default EmployeeProfile;