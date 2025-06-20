import React from 'react';
import { Container, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeProfile from '@/components/employees/EmployeeProfile';
import PageHeader from '@/components/common/PageHeader';
import Loading from '@/components/common/Loading';
import { useEmployee } from '@/hooks/useEmployee';

const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { employee, loading } = useEmployee(id);
  const navigate = useNavigate();

  if (loading) return <Loading />;

  return (
    <Container maxWidth="md">
      <PageHeader
        title="Employee Details"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Employees', path: '/employees' },
          { label: employee?.name || 'Employee', path: `/employees/${id}` }
        ]}
        action={
          <Button
            variant="contained"
            onClick={() => navigate(`/employees/${id}/edit`)}
          >
            Edit
          </Button>
        }
      />
      {employee && <EmployeeProfile employee={employee} />}
    </Container>
  );
};

export default EmployeeDetailPage;