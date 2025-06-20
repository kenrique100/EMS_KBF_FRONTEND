import React, { useEffect, useState } from 'react';
import { Button, Container } from '@mui/material';
import SalaryList from '../../components/salaries/SalaryList';
import PageHeader from '../../components/common/PageHeader';
import { useAuthStore } from '@/store/authStore';
import { SalaryPayment } from '@/types';
import Loading from '../../components/common/Loading';
import { useNavigate } from 'react-router-dom';
import { getSalaryPayments, deleteSalaryPayment } from '@/api/salaries';

const SalariesPage: React.FC = () => {
  const [salaries, setSalaries] = useState<SalaryPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hasAdminRole = useAuthStore(state => state.hasRole('ROLE_ADMIN'));

  const fetchSalaries = async () => {
    try {
      const data = await getSalaryPayments();
      setSalaries(data);
    } catch (error) {
      console.error('Failed to fetch salaries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const handleCreate = () => {
    navigate('/salaries/create');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this salary payment?')) {
      try {
        await deleteSalaryPayment(id);
        await fetchSalaries(); // Refresh the list after deletion
      } catch (error) {
        console.error('Failed to delete salary payment:', error);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Salary Payments"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Salaries', path: '/salaries' }
        ]}
        action={
          hasAdminRole && (
            <Button variant="contained" color="primary" onClick={handleCreate}>
              Add New Payment
            </Button>
          )
        }
      />

      <SalaryList
        salaries={salaries}
        onViewDetails={(id) => navigate(`/salaries/${id}`)}
        onEdit={hasAdminRole ? (id) => navigate(`/salaries/${id}/edit`) : undefined}
        onDelete={hasAdminRole ? handleDelete : undefined}
      />
    </Container>
  );
};

export default SalariesPage;