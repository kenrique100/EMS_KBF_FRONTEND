// src/pages/salaries/EmployeeSalariesPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useSalariesByEmployee } from '@/api/salaries';
import { useEmployeeById } from '@/api/employees';
import SalaryList from '@/components/salaries/SalaryList';
import PageHeader from '@/components/common/PageHeader';
import { Container, Button, Box, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuthStore } from '@/store/authStore';

const EmployeeSalariesPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: salaries, isLoading: isSalariesLoading } = useSalariesByEmployee(id!);
  const { data: employee, isLoading: isEmployeeLoading } = useEmployeeById(id!);
  const { isAdmin } = useAuthStore();
  const navigate = useNavigate();

  const handleViewDetails = (salaryId: string) => {
    navigate(`/salaries/${salaryId}`);
  };

  if (isSalariesLoading || isEmployeeLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={`Salary Payments for ${employee?.name}`}
        action={
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(`/employees/${id}`)}
              sx={{ mr: 1 }}
            >
              Back to Employee
            </Button>
            {isAdmin && (
              <Button
                startIcon={<AddIcon />}
                onClick={() => navigate(`/salaries/new?employeeId=${id}`)}
                variant="contained"
              >
                Add Payment
              </Button>
            )}
          </Box>
        }
      />
      <SalaryList
        salaries={salaries || []}
        onViewDetails={handleViewDetails}
      />
    </Container>
  );
};

export default EmployeeSalariesPage;