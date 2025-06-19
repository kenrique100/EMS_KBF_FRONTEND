import { useSalaries } from '@/api/salaries';
import SalaryList from '@/components/salaries/SalaryList';
import PageHeader from '@/components/common/PageHeader';
import { Container, Button, Box, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Salary } from '@/types';

const SalariesPage = () => {
  const { data: salaries, isLoading } = useSalaries();
  const hasAdminRole = useAuthStore(state => state.hasRole('ROLE_ADMIN'));
  const navigate = useNavigate();

  // Convert to required Salary type
  const formattedSalaries: Salary[] = (salaries || []).map(s => ({
    ...s,
    paymentReference: s.paymentReference || ''
  }));

  const handleViewDetails = (id: number) => {
    navigate(`/salaries/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/salaries/${id}/edit`);
  };

  const handleDelete = (id: number) => {
    // Delete logic would be implemented here
    console.log('Delete salary', id);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Salary Payments"
        action={
          hasAdminRole && (
            <Button
              startIcon={<AddIcon />}
              onClick={() => navigate('/salaries/new')}
              variant="contained"
            >
              Add Payment
            </Button>
          )
        }
      />
      <SalaryList
        salaries={formattedSalaries}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Container>
  );
};

export default SalariesPage;