// src/pages/employees/EmployeesPage.tsx
import React from 'react';
import { Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import EmployeeList from '@/components/employees/EmployeeList';
import PageHeader from '@/components/common/PageHeader';
import Loading from '@/components/common/Loading';

import { useAuthStore } from '@/store/authStore';
import { notify } from '@/store/notificationService';

import { getEmployees, deleteEmployee } from '@/api/employees';
import { Employee, EmployeeDTO } from '@/types';

const mapDTOToEmployee = (dto: EmployeeDTO): Employee | null => {
  const missing: string[] = [];

  if (dto.id === undefined) missing.push('id');
  if (!dto.createdAt) missing.push('createdAt');
  if (!dto.updatedAt) missing.push('updatedAt');

  if (missing.length > 0) {
    console.warn(`Skipped EmployeeDTO (missing: ${missing.join(', ')}):`, dto);
    return null;
  }

  return {
    id: dto.id,
    username: dto.username,
    name: dto.name,
    email: dto.email,
    phoneNumber: dto.phoneNumber,
    department: dto.department,
    dateOfEmployment: dto.dateOfEmployment,
    status: dto.status ?? 'ACTIVE',
    profilePicturePath: dto.profilePicturePath,
    documentPath: dto.documentPath,
    statusChangeTimestamp: undefined,
    totalHoursWorkedLast30Days: 0,
    statusExpiration: dto.statusExpiration,
    suspensionDuration: undefined,
    terminationTimestamp: undefined,
    statusHistory: [],
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
};

const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: employeeDTOs = [],
    isLoading,
  } = useQuery<EmployeeDTO[]>({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });

  const employees: Employee[] = employeeDTOs
    .map(mapDTOToEmployee)
    .filter((e): e is Employee => e !== null);

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['employees'] }),
        queryClient.invalidateQueries({ queryKey: ['employeeSalaries'] }),
        queryClient.invalidateQueries({ queryKey: ['employeeTasks'] }),
        queryClient.invalidateQueries({ queryKey: ['salaries'] }),
        queryClient.invalidateQueries({ queryKey: ['tasks'] }),
      ]);
      notify('Employee deleted successfully', 'success');
    },
    onError: (error) => {
      console.error('Failed to delete employee:', error);
      notify('Failed to delete employee', 'error');
    },
  });

  const handleCreate = () => navigate('/employees/create');
  const handleViewDetails = (id: number) => navigate(`/employees/${id}`);
  const handleEdit = (id: number) => navigate(`/employees/${id}/edit`);
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this employee and all associated files?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Employee Management"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Employees', path: '/employees' },
        ]}
        action={
          hasRole('ROLE_ADMIN') && (
            <Button variant="contained" color="primary" onClick={handleCreate}>
              Add New Employee
            </Button>
          )
        }
      />

      <EmployeeList
        employees={employees}
        onViewDetails={handleViewDetails}
        onEdit={hasRole('ROLE_ADMIN') ? handleEdit : undefined}
        onDelete={hasRole('ROLE_ADMIN') ? handleDelete : undefined}
      />
    </Container>
  );
};

export default EmployeesPage;
