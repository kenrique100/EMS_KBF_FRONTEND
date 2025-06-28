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
    useMediaQuery,
    useTheme,
    Box,
} from '@mui/material';
import { motion } from 'framer-motion';
import { formatDate } from '@/utils/formatters';
import type { Task, TaskStatus } from '@/types';
import { useAuthStore } from '@/store/authStore';

interface TaskListProps {
    tasks: Task[];
    onViewDetails?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onValidate?: (id: string) => void;
}

const getStatusColor = (status: TaskStatus) => {
    switch (status) {
        case 'COMPLETED': return 'success';
        case 'IN_PROGRESS': return 'primary';
        case 'PENDING': return 'default';
        case 'STOPPED': return 'warning';
        case 'INCOMPLETED': return 'warning';
        case 'CANCELLED': return 'error';
        default: return 'default';
    }
};

const TaskList: React.FC<TaskListProps> = ({
                                               tasks,
                                               onViewDetails,
                                               onEdit,
                                               onDelete,
                                               onValidate,
                                           }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { hasRole } = useAuthStore();

    if (tasks.length === 0) {
        return (
          <Typography variant="body1" align="center" sx={{ py: 4 }}>
              No tasks found
          </Typography>
        );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table size={isMobile ? 'small' : 'medium'}>
                  <TableHead>
                      <TableRow>
                          <TableCell>Title</TableCell>
                          {!isMobile && <TableCell>Employee</TableCell>}
                          <TableCell>Deadline</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Actions</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {tasks.map((task) => (
                        <motion.tr
                          key={task.id}
                          whileHover={{ scale: 1.01 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <TableCell>{task.title}</TableCell>
                            {!isMobile && <TableCell>{task.employeeName || task.employeeId}</TableCell>}
                            <TableCell>{formatDate(task.deadline)}</TableCell>
                            <TableCell>
                                <Chip
                                  label={task.status}
                                  color={getStatusColor(task.status)}
                                  size="small"
                                  variant="outlined"
                                />
                            </TableCell>
                            <TableCell align="right">
                                <Box display="flex" flexWrap="wrap" gap={1} justifyContent="flex-end">
                                    {onViewDetails && (
                                      <Button size="small" onClick={() => onViewDetails(String(task.id))}>
                                          View
                                      </Button>
                                    )}
                                    {hasRole('ROLE_ADMIN') && onEdit && (
                                      <Button size="small" color="secondary" onClick={() => onEdit(String(task.id))}>
                                          Edit
                                      </Button>
                                    )}
                                    {hasRole('ROLE_ADMIN') && onDelete && (
                                      <Button size="small" color="error" onClick={() => onDelete(String(task.id))}>
                                          Delete
                                      </Button>
                                    )}
                                    {hasRole('ROLE_ADMIN') && task.status === 'COMPLETED' && !task.isValidated && onValidate && (
                                      <Button
                                        size="small"
                                        color="success"
                                        onClick={() => onValidate(String(task.id))}
                                      >
                                          Validate
                                      </Button>
                                    )}
                                </Box>
                            </TableCell>
                        </motion.tr>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
      </motion.div>
    );
};

export default TaskList;