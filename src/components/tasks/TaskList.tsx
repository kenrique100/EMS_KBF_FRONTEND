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
    IconButton,
    Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import { formatDate } from '@/utils/formatters';
import type { Task, TaskStatus } from '@/types';
import { useAuthStore } from '@/store/authStore';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

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
        case 'UNCOMPLETED': return 'warning';
        case 'CANCELLED': return 'error';
        default: return 'default';
    }
};

const MotionTableRow = motion(TableRow);

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 5 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: theme.shadows[3],
            }}
          >
              <Table size={isMobile ? 'small' : 'medium'}>
                  <TableHead>
                      <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                          <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                          {!isMobile && <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>}
                          <TableCell sx={{ fontWeight: 600 }}>Deadline</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {tasks.map((task, index) => (
                        <MotionTableRow
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{
                              scale: 1.005,
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                          }}
                          sx={{
                              transition: 'all 0.2s ease-in-out',
                              cursor: 'pointer',
                              '&:hover': {
                                  backgroundColor: theme.palette.action.hover,
                              },
                          }}
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
                                      isMobile ? (
                                        <Tooltip title="View">
                                            <IconButton size="small" onClick={() => onViewDetails(String(task.id))}>
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                      ) : (
                                        <Button size="small" onClick={() => onViewDetails(String(task.id))}>
                                            View
                                        </Button>
                                      )
                                    )}
                                    {hasRole('ROLE_ADMIN') && onEdit && (
                                      isMobile ? (
                                        <Tooltip title="Edit">
                                            <IconButton size="small" color="secondary" onClick={() => onEdit(String(task.id))}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                      ) : (
                                        <Button size="small" color="secondary" onClick={() => onEdit(String(task.id))}>
                                            Edit
                                        </Button>
                                      )
                                    )}
                                    {hasRole('ROLE_ADMIN') && onDelete && (
                                      isMobile ? (
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => onDelete(String(task.id))}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                      ) : (
                                        <Button size="small" color="error" onClick={() => onDelete(String(task.id))}>
                                            Delete
                                        </Button>
                                      )
                                    )}
                                    {hasRole('ROLE_ADMIN') && task.status === 'COMPLETED' && !task.isValidated && onValidate && (
                                      isMobile ? (
                                        <Tooltip title="Validate">
                                            <IconButton size="small" color="success" onClick={() => onValidate(String(task.id))}>
                                                <CheckCircleOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                      ) : (
                                        <Button size="small" color="success" onClick={() => onValidate(String(task.id))}>
                                            Validate
                                        </Button>
                                      )
                                    )}
                                </Box>
                            </TableCell>
                        </MotionTableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
      </motion.div>
    );
};

export default TaskList;
