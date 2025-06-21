import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { notify } from '@/store/notificationService';
import PageHeader from '@/components/common/PageHeader';
import { createEmployee } from '@/api/employees';
import { EmployeeDTO } from '@/types';

const EmployeeCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    employeeData: EmployeeDTO,
    profilePicture?: File,
    document?: File
  ) => {
    setIsSubmitting(true);
    try {
      await createEmployee(employeeData, profilePicture, document);
      notify('Employee created successfully', 'success');
      navigate('/employees');
    } catch (error) {
      console.error('Failed to create employee:', error);
      notify('Failed to create employee. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <PageHeader
        title="Create New Employee"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Employees', path: '/employees' },
          { label: 'Create', path: '/employees/create' }
        ]}
      />
      <EmployeeForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </Container>
  );
};

export default EmployeeCreatePage;