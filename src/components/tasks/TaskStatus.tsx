import React from 'react';
import { Button, ButtonGroup, Typography, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Task } from '@/types';

interface TaskStatusProps {
  task: Task;
  onStatusChange: (action: string) => void;
  isSubmitting: boolean;
}

const MotionBox = motion(Box);

const TaskStatus: React.FC<TaskStatusProps> = ({ task, onStatusChange, isSubmitting }) => {
  const theme = useTheme();

  const getAvailableActions = () => {
    switch (task.status) {
      case 'PENDING':
        return ['START'];
      case 'IN_PROGRESS':
        return ['STOP', 'COMPLETE'];
      default:
        return [];
    }
  };

  const availableActions = getAvailableActions();

  return (
    <MotionBox
      mb={3}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 12 }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
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
    </MotionBox>
  );
};

export default TaskStatus;
