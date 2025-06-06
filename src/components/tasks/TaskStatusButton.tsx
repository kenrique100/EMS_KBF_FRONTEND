import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

const TaskStatusButton = ({ task, onStatusChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleStatusChange = (action) => {
        onStatusChange(action);
        handleClose();
    };

    const getButtonProps = () => {
        switch (task.status) {
            case 'PENDING':
                return {
                    color: 'primary',
                    variant: 'contained',
                    label: 'Start Task',
                };
            case 'IN_PROGRESS':
                return {
                    color: 'warning',
                    variant: 'contained',
                    label: 'Stop Task',
                };
            case 'COMPLETED':
            case 'UNCOMPLETED':
            case 'CANCELLED':
                return {
                    color: 'success',
                    variant: 'outlined',
                    label: 'Completed',
                    disabled: true,
                };
            default:
                return {
                    color: 'primary',
                    variant: 'contained',
                    label: 'Update Status',
                };
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
                color={buttonProps.color}
                variant={buttonProps.variant}
                disabled={buttonProps.disabled}
            >
                {buttonProps.label}
            </Button>
            <Menu
                id="status-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {task.status === 'PENDING' && (
                    <MenuItem onClick={() => handleStatusChange('START')}>Start Task</MenuItem>
                )}
                {task.status === 'IN_PROGRESS' && (
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