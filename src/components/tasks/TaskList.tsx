// src/components/tasks/TaskList.tsx
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
} from '@mui/material';
import { Task, TaskStatus } from '@/utils/types';
import { formatDate } from '@/utils/formatters';
import React from 'react';

interface TaskListProps {
    tasks: Task[];
    onViewDetails: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onViewDetails, onEdit, onDelete }) => {
    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.COMPLETED:
                return 'success';
            case TaskStatus.IN_PROGRESS:
                return 'primary';
            case TaskStatus.PENDING:
                return 'default';
            case TaskStatus.UNCOMPLETED:
                return 'warning';
            case TaskStatus.CANCELLED:
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
                            <Button size="small" onClick={() => onViewDetails(task.id)} sx={{ mr: 1 }}>
                                View
                            </Button>
                            {onEdit && (
                              <Button size="small" color="secondary" onClick={() => onEdit(task.id)} sx={{ mr: 1 }}>
                                  Edit
                              </Button>
                            )}
                            {onDelete && (
                              <Button size="small" color="error" onClick={() => onDelete(task.id)}>
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