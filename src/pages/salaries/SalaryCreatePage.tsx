// SalaryCreatePage.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import SalaryForm from '../../components/salaries/SalaryForm';
import { notify } from '@/store/notificationService';
import PageHeader from '../../components/common/PageHeader';
import Loading from '../../components/common/Loading';
import { getEmployees } from '@/api/employees';
import { createSalaryPayment } from '@/api/salaries';
import { SalaryPaymentDTO, EmployeeDTO } from '@/types';

const SalaryCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });

  const handleSubmit = async (data: SalaryPaymentDTO) => {
    setIsSubmitting(true);
    try {
      await createSalaryPayment(data);
      notify('Salary payment created successfully', 'success');
      navigate('/salaries');
    } catch (error: any) {
      console.error('Failed to create salary payment:', error);

      let errorMessage = 'Failed to create salary payment. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid data provided. Please check all fields.';
      }

      notify(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  // Filter employees to ensure they have an ID and map with type safety
  const employeeOptions = (employees || [])
    .filter(
      (employee: EmployeeDTO): employee is EmployeeDTO & { id: number } =>
        employee.id !== undefined && employee.id !== null
    )
    .map((employee) => ({
      id: employee.id,
      name: employee.name,
    }));

  return (
    <Container maxWidth="md">
      <PageHeader
        title="Create Salary Payment"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Salaries', path: '/salaries' },
          { label: 'Create', path: '/salaries/create' },
        ]}
      />
      <SalaryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} employees={employeeOptions} />
    </Container>
  );
};

export default SalaryCreatePage;
