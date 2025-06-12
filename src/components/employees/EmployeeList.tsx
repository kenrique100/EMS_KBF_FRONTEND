// src/components/employees/EmployeeList.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { formatDate } from '@/utils/formatters';
import React from 'react';
import { Employee } from '@/types';

interface EmployeeListProps {
  employees: Employee[];
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
                                                     employees,
                                                     onViewDetails,
                                                     onEdit,
                                                     onDelete
                                                   }) => {
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
              <TableCell>{employee.department}</TableCell>
              <TableCell>{formatDate(employee.dateOfEmployment)}</TableCell>
              <TableCell>{employee.status}</TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  onClick={() => onViewDetails(employee.id)}
                  sx={{ mr: 1 }}
                >
                  View
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => onEdit(employee.id)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => onDelete(employee.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeList;