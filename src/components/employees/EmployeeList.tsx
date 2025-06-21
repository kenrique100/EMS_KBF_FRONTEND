// src/components/employees/EmployeeList.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
  Chip
} from '@mui/material';
import { Employee } from '@/types';
import { formatDate } from '@/utils/formatters';
import { getDepartmentDisplayName } from '@/utils/departmentUtils';

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
                                                     onDelete
                                                   }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Date of Employment</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.username}</TableCell>
              <TableCell>
                {getDepartmentDisplayName(employee.department)}
              </TableCell>
              <TableCell>{formatDate(employee.dateOfEmployment)}</TableCell>
              <TableCell>
                <Chip
                  label={employee.status}
                  color={
                    employee.status === 'ACTIVE' ? 'success' :
                      employee.status === 'ON_LEAVE' ? 'warning' : 'error'
                  }
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  onClick={() => onViewDetails(employee.id)}
                  sx={{ mr: 1 }}
                >
                  View
                </Button>
                {onEdit && (
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => onEdit(employee.id)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() => onDelete(employee.id)}
                  >
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeList;