import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSalariesByEmployee } from '@/api/salaries.ts';
import { getEmployeeById } from '@/api/employees.ts';
import SalaryList from '../../components/salaries/SalaryList.js';
import PageHeader from '../../components/common/PageHeader.js';
import { Container, Button, Box, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useAuth from "@/hooks/useAuth.ts";

const EmployeeSalariesPage = () => {
    const { id } = useParams();
    const [salaries, setSalaries] = useState([]);
    const [employee, setEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { showNotification, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [salariesData, employeeData] = await Promise.all([
                    getSalariesByEmployee(id),
                    getEmployeeById(id),
                ]);
                setSalaries(salariesData);
                setEmployee(employeeData);
            } catch (error) {
                showNotification('Failed to load data', 'error');
                navigate('/employees');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, navigate, showNotification]);

    const handleViewDetails = (salaryId) => {
        navigate(`/salaries/${salaryId}`);
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