import React, { useEffect, useState } from 'react';
import { Button, Container } from '@mui/material';
import EmployeeList from '@/components/employees/EmployeeList';
import PageHeader from '@/components/common/PageHeader';
import { useAuthStore } from '@/store/authStore';
import { Employee } from '@/types';
import Loading from '@/components/common/Loading';
import { useNavigate } from 'react-router-dom';
import { deleteEmployee, getEmployees } from '@/api/employees';
import { notify } from '@/store/notificationService';

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { hasRole } = useAuthStore();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        notify('Failed to load employees', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleCreate = () => {
    navigate('/employees/create');
  };

  const handleViewDetails = (id: number) => {
    navigate(`/employees/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/employees/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      setEmployees(employees.filter(emp => emp.id !== id));
      notify('Employee deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete employee:', error);
      notify('Failed to delete employee', 'error');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Employee Management"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Employees', path: '/employees' }
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