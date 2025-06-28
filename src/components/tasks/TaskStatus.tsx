import React from 'react';
import { Button, ButtonGroup, Typography, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { TaskDTO } from '@/types';

interface TaskStatusProps {
  task: TaskDTO;
  onStatusChange: (action: string) => void;
  isSubmitting: boolean;
}

const TaskStatus: React.FC<TaskStatusProps> = ({ task, onStatusChange, isSubmitting }) => {
  const theme = useTheme();

  const getAvailableActions = () => {
    switch (task.status) {
      case 'PENDING':
        return ['START'];
      case 'IN_PROGRESS':
        return task.stopTime ? ['CONTINUE', 'COMPLETE'] : ['STOP', 'COMPLETE'];
      case 'COMPLETED':
        return [];
      case 'INCOMPLETED':
        return ['START'];
      default:
        return [];
    }
  };

  const availableActions = getAvailableActions();

  return (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Task Status: <span style={{ color: theme.palette.primary.main }}>{task.status}</span>
      </Typography>

      {availableActions.length > 0 && (
        <ButtonGroup fullWidth orientation="horizontal" sx={{ mt: 2 }}>
          {availableActions.map((action) => (
            <motion.div
              key={action}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
            >
              <Button
                variant="contained"
                color={
                  action === 'COMPLETE' ? 'success' :
                    action === 'STOP' ? 'warning' : 'primary'
                }
                onClick={() => onStatusChange(action)}
                disabled={isSubmitting}
                sx={{ mx: 0.5 }}
              >
                {action}
              </Button>
            </motion.div>
          ))}
        </ButtonGroup>
      )}
    </Box>
  );
};

export default TaskStatus;