import React from 'react';
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
  useTheme,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { Employee } from '@/types';
import { formatDate } from '@/utils/formatters';
import { getDepartmentDisplayName } from '@/utils/departmentUtils';
import { motion } from 'framer-motion';

interface EmployeeListProps {
  employees: Employee[];
  loading?: boolean;
  onViewDetails: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
                                                     employees,
                                                     loading = false,
                                                     onViewDetails,
                                                     onEdit,
                                                     onDelete,
                                                   }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (employees.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <Typography variant="h6" color="text.secondary">
          No employees found.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {employees.map((employee, index) => (
        <Grid item xs={12} md={6} lg={4} key={employee.id}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.3 },
            }}
            transition={{
              delay: index * 0.05,
              duration: 0.4,
              type: 'spring',
            }}
          >
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                boxShadow: 1,
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    {employee.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {employee.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{employee.username}
                    </Typography>
                  </Box>
                </Box>

                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body1">
                    {getDepartmentDisplayName(employee.department)}
                  </Typography>
                </Box>

                <Box mt={1}>
                  <Typography variant="body2" color="text.secondary">
                    Employed Since
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(employee.dateOfEmployment)}
                  </Typography>
                </Box>

                <Box mt={2}>
                  <Chip
                    label={employee.status}
                    color={
                      employee.status === 'ACTIVE'
                        ? 'success'
                        : employee.status === 'ON_LEAVE'
                          ? 'warning'
                          : 'error'
                    }
                    size="small"
                  />
                </Box>

                <Box display="flex" justifyContent="flex-end" gap={1} mt={3}>
                  <IconButton color="primary" onClick={() => onViewDetails(employee.id)}>
                    <ViewIcon />
                  </IconButton>
                  {onEdit && (
                    <IconButton color="secondary" onClick={() => onEdit(employee.id)}>
                      <EditIcon />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton color="error" onClick={() => onDelete(employee.id)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default EmployeeList;
