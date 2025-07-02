import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

interface ValidationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (approve: boolean) => void;
}

const ValidationDialog: React.FC<ValidationDialogProps> = ({
                                                             open,
                                                             onClose,
                                                             onConfirm
                                                           }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Task Validation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you approve this task completion?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={() => onConfirm(false)} color="error" variant="outlined">
          Reject
        </Button>
        <Button onClick={() => onConfirm(true)} color="success" variant="contained" autoFocus>
          Approve
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ValidationDialog;
