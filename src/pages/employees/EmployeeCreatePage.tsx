import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { notify } from '@/store/notificationService';
import PageHeader from '@/components/common/PageHeader';
import { createEmployee } from '@/api/employees';
import { EmployeeDTO, Department, Gender } from '@/types';

const EmployeeCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (employeeData: EmployeeDTO) => {
    setIsSubmitting(true);

    console.log('Submitting employee data:', employeeData);

    try {
      // Format dates before sending
      const formattedData = {
        ...employeeData,
        dateOfBirth: formatDateForBackend(employeeData.dateOfBirth),
        dateOfEmployment: formatDateForBackend(employeeData.dateOfEmployment),
      };

      await createEmployee(formattedData);
      notify('Employee created successfully', 'success');
      navigate('/employees');
    } catch (error: any) {
      console.error('Failed to create employee:', error);

      let errorMessage = 'Failed to create employee. Please try again.';

      if (error.response?.data) {
        const responseData = error.response.data;

        if (error.response.status === 400) {
          if (typeof responseData === 'object') {
            const messages = Object.values(responseData).flat();
            errorMessage = `Validation errors: ${messages.join(', ')}`;
          } else if (typeof responseData === 'string') {
            errorMessage = responseData;
          }
        } else if (error.response.status === 409) {
          errorMessage = responseData.message || 'Employee already exists';
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
      }

      notify(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to format dates
  const formatDateForBackend = (dateString: string): string => {
    if (!dateString) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return dateString;
    }
  };

  // Provide default values with a strong password
  const defaultValues: EmployeeDTO = {
    username: '',
    name: '',
    gender: 'MALE',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    nationalId: '',
    department: 'ADMINISTRATION',
    dateOfEmployment: new Date().toISOString().split('T')[0], // Today's date as default
    password: 'Employee@123', // Strong default password
  };

  return (
    <Container maxWidth="md">
      <PageHeader
        title="Create New Employee"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Employees', path: '/employees' },
          { label: 'Create', path: '/employees/create' },
        ]}
      />
      <EmployeeForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        initialValues={defaultValues}
        title="Create New Employee"
      />
    </Container>
  );
};

export default EmployeeCreatePage;
