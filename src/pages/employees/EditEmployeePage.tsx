import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '@/hooks/useNotification';
import { getEmployeeById, updateEmployee } from '@/api/employees.ts';
import EmployeeForm from '../../components/employees/EmployeeForm.js';
import PageHeader from '../../components/common/PageHeader.js';
import { Container, CircularProgress, Box } from '@mui/material';

const EditEmployeePage = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showNotification } = useNotification();
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

    const handleSubmit = async (employeeData) => {
        setIsSubmitting(true);
        try {
            await updateEmployee(id, employeeData);
            showNotification('Employee updated successfully', 'success');
            navigate(`/employees/${id}`);
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setIsSubmitting(false);
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
            <PageHeader title="Edit Employee" />
            <EmployeeForm
                employee={employee}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </Container>
    );
};

export default EditEmployeePage;