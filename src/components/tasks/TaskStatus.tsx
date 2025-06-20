import React from 'react';
import { Button, ButtonGroup, Typography, Box } from '@mui/material';
import { Task } from '@/types';

interface TaskStatusProps {
  task: Task;
  onStatusChange: (action: string) => void;
  isSubmitting: boolean;
}

const TaskStatus: React.FC<TaskStatusProps> = ({
                                                 task,
                                                 onStatusChange,
                                                 isSubmitting
                                               }) => {
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
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>
        Task Status: {task.status}
      </Typography>
      {availableActions.length > 0 && (
        <ButtonGroup>
          {availableActions.map((action) => (
            <Button
              key={action}
              variant="contained"
              color={
                action === 'COMPLETE' ? 'success' :
                  action === 'STOP' ? 'warning' : 'primary'
              }
              onClick={() => onStatusChange(action)}
              disabled={isSubmitting}
            >
              {action}
            </Button>
          ))}
        </ButtonGroup>
      )}
    </Box>
  );
};

export default TaskStatus;