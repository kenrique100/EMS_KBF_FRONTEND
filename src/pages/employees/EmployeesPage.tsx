// src/pages/employees/EmployeesPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { getEmployees } from "@/api/employees";
import EmployeeList from '../../components/employees/EmployeeList';
import { Employee } from '@/utils/types'; // ✅ make sure Employee type is imported

const EmployeesPage = () => {
    const [employees, setEmployees] = useState<Employee[]>([]); // ✅ FIXED
    const [isLoading, setIsLoading] = useState(true);
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await getEmployees();
                setEmployees(data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleViewDetails = (id: string) => {
        navigate(`/employees/${id}`);
    };

    const handleEdit = (id: string) => {
        navigate(`/employees/${id}/edit`);
    };

    const handleDelete = (id: string) => {
        navigate(`/employees/${id}/delete`);
    };

    if (isLoading) return <LoadingSpinner />;

    return (
      <Container maxWidth="lg">
          <PageHeader
            title="Employees"
            action={
              isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/employees/new')}
                >
                    Add Employee
                </Button>
              )
            }
          />
          <Paper sx={{ mt: 3 }}>
              <EmployeeList
                employees={employees}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
          </Paper>
      </Container>
    );
};

export default EmployeesPage;
