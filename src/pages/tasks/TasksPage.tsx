import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../../components/common/PageHeader.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.js';
import useAuth from "@/hooks/useAuth";
import {getTasks} from "@/api/tasks";

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks();
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'IN_PROGRESS':
                return 'primary';
            case 'PENDING':
                return 'default';
            case 'UNCOMPLETED':
                return 'warning';
            case 'CANCELLED':
                return 'error';
            default:
                return 'default';
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/tasks/${id}`);
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <Container maxWidth="lg">
            <PageHeader
                title="Tasks"
                action={
                    isAdmin && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/tasks/new')}
                        >
                            Add Task
                        </Button>
                    )
                }
            />
            <Paper sx={{ mt: 3 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Employee</TableCell>
                                <TableCell>Deadline</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>{task.title}</TableCell>
                                        <TableCell>{task.employeeId}</TableCell>
                                        <TableCell>{formatDate(task.deadline)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={task.status}
                                                color={getStatusColor(task.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleViewDetails(task.id)}
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body1">No tasks found</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default TasksPage;