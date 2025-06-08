// src/components/tasks/TaskStatusButton.tsx
import { Button, Menu, MenuItem } from '@mui/material';
import React, { useState, MouseEvent } from 'react';
import { Task, TaskStatus } from '@/utils/types';

interface TaskStatusButtonProps {
  task: Task;
  onStatusChange: (action: 'START' | 'STOP' | 'COMPLETE') => void;
  disabled?: boolean;
}

const TaskStatusButton: React.FC<TaskStatusButtonProps> = ({
                                                             task,
                                                             onStatusChange,
                                                             disabled = false
                                                           }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (action: 'START' | 'STOP' | 'COMPLETE') => {
    onStatusChange(action);
    handleClose();
  };

  const getButtonProps = () => {
    switch (task.status) {
      case TaskStatus.PENDING:
        return { color: 'primary', variant: 'contained', label: 'Start Task' };
      case TaskStatus.IN_PROGRESS:
        return { color: 'warning', variant: 'contained', label: 'Stop Task' };
      case TaskStatus.COMPLETED:
      case TaskStatus.UNCOMPLETED:
      case TaskStatus.CANCELLED:
        return {
          color: 'success',
          variant: 'outlined',
          label: 'Completed',
          disabled: true
        };
      default:
        return { color: 'primary', variant: 'contained', label: 'Update Status' };
    }
  };

  const buttonProps = getButtonProps();

  return (
    <>
      <Button
        aria-controls={open ? 'status-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color={buttonProps.color as any}
        variant={buttonProps.variant as any}
        disabled={disabled || buttonProps.disabled}
      >
        {buttonProps.label}
      </Button>
      <Menu
        id="status-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'status-button',
        }}
      >
        {task.status === TaskStatus.PENDING && (
          <MenuItem onClick={() => handleStatusChange('START')}>Start Task</MenuItem>
        )}
        {task.status === TaskStatus.IN_PROGRESS && (
          <>
            <MenuItem onClick={() => handleStatusChange('STOP')}>Stop Task</MenuItem>
            <MenuItem onClick={() => handleStatusChange('COMPLETE')}>Mark Complete</MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default TaskStatusButton;