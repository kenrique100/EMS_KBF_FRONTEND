import { useSalaries } from '@/api/salaries';
import SalaryList from '@/components/salaries/SalaryList';
import PageHeader from '@/components/common/PageHeader';
import { Container, Button, Box, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const SalariesPage = () => {
  const { data: salaries, isLoading } = useSalaries();
  const hasAdminRole = useAuthStore(state => state.hasRole('ROLE_ADMIN'));
  const navigate = useNavigate();

  const handleViewDetails = (id: string) => {
    navigate(`/salaries/${id}`);
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
        salaries={salaries || []}
        onViewDetails={handleViewDetails}
      />
    </Container>
  );
};

export default SalariesPage;