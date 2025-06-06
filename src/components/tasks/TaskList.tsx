import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip } from '@mui/material';
import { formatDate } from '@/utils/formatters';

const TaskList = ({ tasks, onViewDetails, onEdit, onDelete }) => {
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

    return (
        <TableContainer component={Paper}>
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
                    {tasks.map((task) => (
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
                                    size="small"
                                    onClick={() => onViewDetails(task.id)}
                                    sx={{ mr: 1 }}
                                >
                                    View
                                </Button>
                                <Button
                                    size="small"
                                    color="secondary"
                                    onClick={() => onEdit(task.id)}
                                    sx={{ mr: 1 }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => onDelete(task.id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TaskList;