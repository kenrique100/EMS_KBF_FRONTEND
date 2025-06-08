// src/pages/tasks/TasksPage.tsx
import { useNavigate } from 'react-router-dom';
import { useTasks } from '@/api/tasks';
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
    CircularProgress,
    Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '@/components/common/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/utils/formatters';
import { TaskStatus } from '@/utils/types';

const TasksPage = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const { data: tasks, isLoading, isError } = useTasks();

    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.COMPLETED: return 'success';
            case TaskStatus.IN_PROGRESS: return 'primary';
            case TaskStatus.PENDING: return 'default';
            case TaskStatus.UNCOMPLETED: return 'warning';
            case TaskStatus.CANCELLED: return 'error';
            default: return 'default';
        }
    };

    const handleViewDetails = (id: string) => {
        navigate(`/tasks/${id}`);
    };

    if (isLoading) {
        return (
          <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
          </Box>
        );
    }

    if (isError) {
        return <div>Error loading tasks</div>;
    }

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
                          {tasks && tasks.length > 0 ? (
                            tasks.map((task) => (
                              <TableRow key={task.id}>
                                  <TableCell>{task.title}</TableCell>
                                  <TableCell>{task.employeeName || task.employeeId}</TableCell>
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