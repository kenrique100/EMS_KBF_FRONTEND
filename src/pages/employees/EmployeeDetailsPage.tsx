import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById, deleteEmployee } from '@/api/employees.ts';
import EmployeeProfile from '../../components/employees/EmployeeProfile.js';
import PageHeader from '../../components/common/PageHeader.js';
import { Container, Button, Box, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useAuth from "@/hooks/useAuth.ts";

const EmployeeDetailsPage = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { showNotification, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const data = await getEmployeeById(id);
                setEmployee(data);
            } catch (error) {
                showNotification('Failed to load employee data', 'error');
                navigate('/employees');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployee();
    }, [id, navigate, showNotification]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await deleteEmployee(id);
                showNotification('Employee deleted successfully', 'success');
                navigate('/employees');
            } catch (error) {
                showNotification(error.message, 'error');
            }
        }
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
                title="Employee Details"
                action={
                    <Box>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/employees')}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        {isAdmin && (
                            <>
                                <Button
                                    startIcon={<EditIcon />}
                                    onClick={() => navigate(`/employees/${id}/edit`)}
                                    variant="contained"
                                    sx={{ mr: 1 }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    startIcon={<DeleteIcon />}
                                    onClick={handleDelete}
                                    variant="contained"
                                    color="error"
                                >
                                    Delete
                                </Button>
                            </>
                        )}
                    </Box>
                }
            />
            <EmployeeProfile employee={employee} />
        </Container>
    );
};

export default EmployeeDetailsPage;