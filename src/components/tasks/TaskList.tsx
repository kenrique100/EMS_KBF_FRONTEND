import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    Typography,
} from '@mui/material';
import { formatDate } from '@/utils/formatters';
import { Task, TaskStatus } from '@/types';

interface TaskListProps {
    tasks: Task[];
    onViewDetails: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onViewDetails, onEdit, onDelete }) => {
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

    if (tasks.length === 0) {
        return (
          <Typography variant="body1" align="center" sx={{ py: 4 }}>
              No tasks found
          </Typography>
        );
    }

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
                              size="small"
                              onClick={() => onViewDetails(String(task.id))}
                              sx={{ mr: 1 }}
                            >
                                View
                            </Button>
                            {onEdit && (
                              <Button
                                size="small"
                                color="secondary"
                                onClick={() => onEdit(String(task.id))}
                                sx={{ mr: 1 }}
                              >
                                  Edit
                              </Button>
                            )}
                            {onDelete && (
                              <Button
                                size="small"
                                color="error"
                                onClick={() => onDelete(String(task.id))}
                              >
                                  Delete
                              </Button>
                            )}
                        </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
          </Table>
      </TableContainer>
    );
};

export default TaskList;
