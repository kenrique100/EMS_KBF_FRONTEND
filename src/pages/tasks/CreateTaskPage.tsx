import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/hooks/useNotification';
import { createTask } from '@/api/tasks.ts';
import { getEmployees } from '@/api/employees.ts';
import TaskForm from '../../components/tasks/TaskForm.js';
import PageHeader from '../../components/common/PageHeader.js';
import { Container, CircularProgress, Box } from '@mui/material';

const CreateTaskPage = () => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await getEmployees();
                setEmployees(data);
            } catch (error) {
                showNotification('Failed to load employees', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployees();
    }, [showNotification]);

    const handleSubmit = async (taskData) => {
        setIsSubmitting(true);
        try {
            await createTask(taskData);
            showNotification('Task created successfully', 'success');
            navigate('/tasks');
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
            <PageHeader title="Create New Task" />
            <TaskForm
                employees={employees}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </Container>
    );
};

export default CreateTaskPage;