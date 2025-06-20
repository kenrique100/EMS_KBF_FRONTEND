import React, { useState } from 'react';
import { Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployee, toEmployeeDTO } from '@/hooks/useEmployee';
import PageHeader from '@/components/common/PageHeader';
import Loading from '@/components/common/Loading';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { EmployeeDTO } from '@/types';
import { updateEmployee } from '@/api/employees';
import { notify } from '@/store/notificationService';

const EmployeeEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { employee, loading } = useEmployee(id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: EmployeeDTO) => {
    setIsSubmitting(true);
    try {
      if (!id) return;
      await updateEmployee(Number(id), data);
      notify('Employee updated successfully', 'success');
      navigate(`/employees/${id}`);
    } catch (error) {
      notify('Failed to update employee', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <Container maxWidth="md">
      <PageHeader
        title="Edit Employee"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Employees', path: '/employees' },
          { label: employee?.name ?? 'Employee', path: `/employees/${id}` },
          { label: 'Edit', path: `/employees/${id}/edit` }
        ]}
      />
      {employee && (
        <EmployeeForm
          initialValues={toEmployeeDTO(employee)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </Container>
  );
};

export default EmployeeEditPage;