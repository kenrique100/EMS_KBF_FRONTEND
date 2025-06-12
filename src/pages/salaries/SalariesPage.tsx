// src/pages/salaries/SalariesPage.tsx
import { useSalaries } from '@/api/salaries';
import SalaryList from '@/components/salaries/SalaryList';
import PageHeader from '@/components/common/PageHeader';
import { Container, Button, Box, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SalariesPage = () => {
  const { data: salaries, isLoading } = useSalaries();
  const { isAdmin } = useAuth();
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
          isAdmin && (
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