import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSalariesByEmployee } from '@/api/salaries';
import { getEmployeeById } from '@/api/employees';
import SalaryList from '../../components/salaries/SalaryList';
import PageHeader from '../../components/common/PageHeader';
import { Container, Button, Box, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from "@/contexts/NotificationContext";
import { Employee, Salary } from '@/utils/types';

const EmployeeSalariesPage = () => {
  const { id } = useParams<{ id: string }>();
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salariesData, employeeData] = await Promise.all([
          getSalariesByEmployee(id!),
          getEmployeeById(id!),
        ]);
        setSalaries(salariesData);
        setEmployee(employeeData);
      } catch (error: any) {
        showNotification('Failed to load data', 'error');
        navigate('/employees');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, showNotification]);

  const handleViewDetails = (salaryId: string) => {
    navigate(`/salaries/${salaryId}`);
  };

  return isLoading ? (
    <Box display="flex" justifyContent="center" my={4}>
      <CircularProgress />
    </Box>
  ) : (
    <Container maxWidth="lg">
      <PageHeader
        title={`Salaries for ${employee?.name}`}
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
                Add Salary
              </Button>
            )}
          </Box>
        }
      />
      <SalaryList
        salaries={salaries}
        onViewDetails={handleViewDetails}
      />
    </Container>
  );
};

export default EmployeeSalariesPage;