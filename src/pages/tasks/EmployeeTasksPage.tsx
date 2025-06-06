import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTasksByEmployee } from '@/api/tasks.ts';
import { getEmployeeById } from '@/api/employees.ts';
import TaskList from '../../components/tasks/TaskList.js';
import PageHeader from '../../components/common/PageHeader.js';
import { Container, Button, Box, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../../contexts/AuthContext.js';

const EmployeeTasksPage = () => {
    const { id } = useParams();
    const [tasks, setTasks] = useState([]);
    const [employee, setEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { showNotification, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tasksData, employeeData] = await Promise.all([
                    getTasksByEmployee(id),
                    getEmployeeById(id),
                ]);
                setTasks(tasksData);
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

    const handleViewDetails = (taskId) => {
        navigate(`/tasks/${taskId}`);
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
                title={`Tasks for ${employee?.name}`}
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
                                onClick={() => navigate(`/tasks/new?employeeId=${id}`)}
                                variant="contained"
                            >
                                Add Task
                            </Button>
                        )}
                    </Box>
                }
            />
            <TaskList
                tasks={tasks}
                onViewDetails={handleViewDetails}
            />
        </Container>
    );
};

export default EmployeeTasksPage;