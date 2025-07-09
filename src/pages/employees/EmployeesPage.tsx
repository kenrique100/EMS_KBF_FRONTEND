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
import { EmployeeDTO, Employee } from '@/types';

const mapToEmployee = (dto: EmployeeDTO): Employee => ({
  id: dto.id,
  username: dto.username,
  name: dto.name,
  email: dto.email,
  phoneNumber: dto.phoneNumber,
  department: dto.department,
  dateOfEmployment: dto.dateOfEmployment,
  status: dto.status || 'ACTIVE',
  profilePicturePath: dto.profilePicturePath,
  documentPath: dto.documentPath,
  nationalId: dto.nationalId,
  createdAt: dto.createdAt || new Date().toISOString(),
  updatedAt: dto.updatedAt || new Date().toISOString(),
  totalHoursWorkedLast30Days: dto.totalHoursWorkedLast30Days || 0,
  statusExpiration: dto.statusExpiration,
  suspensionDuration: dto.suspensionDuration,
  workingDaysCount: 0,
  currentPeriodStartDate: new Date().toISOString(),
  totalProductiveDays: 0,
  statusChangeTimestamp: undefined,
  terminationTimestamp: undefined,
  lastProductivityResetDate: undefined,
  lastProductivityUpdate: undefined,
  profilePictureThumbnailPath: undefined,
  statusHistory: [],
});

const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hasRole } = useAuthStore();

  const { data: employees = [], isLoading } = useQuery<EmployeeDTO[]>({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employees'] }); // ✅ Await added
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
    if (window.confirm('Are you sure you want to delete this employee?')) {
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
        employees={employees.map(mapToEmployee)}
        onViewDetails={handleViewDetails}
        onEdit={hasRole('ROLE_ADMIN') ? handleEdit : undefined}
        onDelete={hasRole('ROLE_ADMIN') ? handleDelete : undefined}
      />
    </Container>
  );
};

export default EmployeesPage;
