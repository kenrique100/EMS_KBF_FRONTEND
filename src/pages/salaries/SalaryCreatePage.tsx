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
import { SalaryPaymentDTO } from '@/types';

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
    } catch (error) {
      notify('Failed to create salary payment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="md">
      <PageHeader
        title="Create Salary Payment"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Salaries', path: '/salaries' },
          { label: 'Create', path: '/salaries/create' }
        ]}
      />
      <SalaryForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        employees={employees?.map(e => ({ id: e.id, name: e.name })) || []}
      />
    </Container>
  );
};

export default SalaryCreatePage;