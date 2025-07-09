import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { notify } from '@/store/notificationService';
import PageHeader from '@/components/common/PageHeader';
import { getEmployeeById, updateEmployee } from '@/api/employees';
import { EmployeeDTO } from '@/types';
import Loading from '@/components/common/Loading';

const EmployeeEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeDTO | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;

      try {
        const data = await getEmployeeById(Number(id));
        setEmployee(data);
      } catch (error) {
        notify('Failed to fetch employee details', 'error');
        navigate('/employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  const handleSubmit = async (employeeData: EmployeeDTO) => {
    if (!id || !employee || isSubmitting) return;

    setIsSubmitting(true);
    try {
      console.log('Preparing update payload...');
      const updatePayload = {
        username: employeeData.username,
        name: employeeData.name,
        email: employeeData.email,
        phoneNumber: employeeData.phoneNumber,
        nationalId: employeeData.nationalId,
        department: employeeData.department,
        dateOfEmployment: employeeData.dateOfEmployment,
        ...(employeeData.password && { password: employeeData.password })
      };

      console.log('Sending update request with payload:', updatePayload);
      const updatedEmployee = await updateEmployee(Number(id), updatePayload);
      console.log('Update successful:', updatedEmployee);

      notify('Employee updated successfully', 'success');
      navigate(`/employees/${id}`);
    } catch (error) {
      console.error('Update failed:', error);
      notify('Failed to update employee. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (!employee) return <div>Employee not found</div>;

  return (
    <Container maxWidth="md">
      <PageHeader
        title="Edit Employee"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Employees', path: '/employees' },
          { label: employee.name, path: `/employees/${id}` },
          { label: 'Edit', path: `/employees/${id}/edit` }
        ]}
      />
      <EmployeeForm
        initialValues={employee}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </Container>
  );
};

export default EmployeeEditPage;