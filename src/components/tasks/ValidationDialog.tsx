import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ValidationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (approve: boolean) => void;
}

const ValidationDialog: React.FC<ValidationDialogProps> = ({
                                                             open,
                                                             onClose,
                                                             onConfirm,
                                                           }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Validate Task</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you approve this task completion?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => onConfirm(false)}
          color="error"
        >
          Reject
        </Button>
        <Button
          onClick={() => onConfirm(true)}
          color="success"
          autoFocus
        >
          Approve
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ValidationDialog;