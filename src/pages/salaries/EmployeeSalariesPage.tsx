// src/pages/EmployeeSalariesPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useSalariesByEmployee } from '@/api/salaries';
import { useEmployeeById } from '@/api/employees';
import SalaryList from '@/components/salaries/SalaryList';
import PageHeader from '@/components/common/PageHeader';
import { Container, Button, Box, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuthStore } from '@/store/authStore';
import { Salary, SalaryPaymentDTO } from '@/types';

const mapDtoToSalary = (dto: SalaryPaymentDTO): Salary => ({
  id: dto.id,
  amount: dto.amount,
  paymentDate: dto.paymentDate,
  employeeId: dto.employeeId,
  employeeName: dto.employeeName,
  status: dto.status,
  paymentReference: dto.paymentReference ?? '',
  createdAt: dto.createdAt,
});

const EmployeeSalariesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hasAdminRole = useAuthStore((state) => state.hasRole('ROLE_ADMIN'));

  if (!id || isNaN(Number(id))) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        Invalid Employee ID
      </Box>
    );
  }

  const employeeId = parseInt(id, 10);

  const { data: salariesDto, isLoading: isSalariesLoading } = useSalariesByEmployee(employeeId);
  const { data: employee, isLoading: isEmployeeLoading } = useEmployeeById(employeeId);

  const handleViewDetails = (salaryId: number) => {
    navigate(`/salaries/${salaryId}`);
  };

  const handleEdit = (salaryId: number) => {
    navigate(`/salaries/${salaryId}/edit`);
  };

  const handleDelete = (salaryId: number) => {
    console.log('Delete salary', salaryId);
  };

  if (isSalariesLoading || isEmployeeLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  const salaries: Salary[] = (salariesDto ?? []).map(mapDtoToSalary);

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={`Salary Payments for ${employee?.name ?? 'Employee'}`}
        action={
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(`/employees/${id}`)}
              sx={{ mr: 1 }}
            >
              Back to Employee
            </Button>
            {hasAdminRole && (
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
        salaries={salaries}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Container>
  );
};

export default EmployeeSalariesPage;
