import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskStatusButton from '../../components/tasks/TaskStatusButton.js';
import PageHeader from '../../components/common/PageHeader.js';
import { Container, Button, Box, Typography, CircularProgress, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../../contexts/AuthContext.js';

const TaskDetailsPage = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const { showNotification, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const data = await getTaskById(id);
                setTask(data);
            } catch (error) {
                showNotification('Failed to load task data', 'error');
                navigate('/tasks');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTask();
    }, [id, navigate, showNotification]);

    const handleStatusChange = async (action) => {
        setIsUpdating(true);
        try {
            const updatedTask = await updateTaskStatus({ taskId: id, action });
            setTask(updatedTask);
            showNotification('Task status updated successfully', 'success');
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(id);
                showNotification('Task deleted successfully', 'success');
                navigate('/tasks');
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
                title="Task Details"
                action={
                    <Box>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/tasks')}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        {isAdmin && (
                            <>
                                <Button
                                    startIcon={<EditIcon />}
                                    onClick={() => navigate(`/tasks/${id}/edit`)}
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
                                    sx={{ mr: 1 }}
                                >
                                    Delete
                                </Button>
                            </>
                        )}
                        <TaskStatusButton
                            task={task}
                            onStatusChange={handleStatusChange}
                            disabled={isUpdating}
                        />
                    </Box>
                }
            />
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {task.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Assigned to Employee ID: {task.employeeId}
                </Typography>
                <Box my={2}>
                    <Typography variant="body1">{task.description}</Typography>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={3} mt={3}>
                    <Box>
                        <Typography variant="subtitle2">Status</Typography>
                        <Typography variant="body1">{task.status}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle2">Deadline</Typography>
                        <Typography variant="body1">{formatDate(task.deadline)}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle2">Expected Hours</Typography>
                        <Typography variant="body1">{task.expectedHours || 'N/A'}</Typography>
                    </Box>
                    {task.startTime && (
                        <Box>
                            <Typography variant="subtitle2">Started At</Typography>
                            <Typography variant="body1">{formatDate(task.startTime)}</Typography>
                        </Box>
                    )}
                    {task.stopTime && (
                        <Box>
                            <Typography variant="subtitle2">Stopped At</Typography>
                            <Typography variant="body1">{formatDate(task.stopTime)}</Typography>
                        </Box>
                    )}
                    {task.actualHours && (
                        <Box>
                            <Typography variant="subtitle2">Actual Hours</Typography>
                            <Typography variant="body1">{task.actualHours.toFixed(2)}</Typography>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default TaskDetailsPage;