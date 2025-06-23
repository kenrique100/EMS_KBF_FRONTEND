import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Grid
} from '@mui/material';
import { EmployeeStatus, EmployeeStatusUpdateDTO } from '@/types';
import { notify } from '@/store/notificationService';

interface StatusUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeStatusUpdateDTO) => void;
  currentStatus: EmployeeStatus;
}

const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({
                                                                 open,
                                                                 onClose,
                                                                 onSubmit,
                                                                 currentStatus
                                                               }) => {
  const [status, setStatus] = useState<EmployeeStatus>(currentStatus);
  const [leaveStartDate, setLeaveStartDate] = useState<string>('');
  const [leaveEndDate, setLeaveEndDate] = useState<string>('');
  const [suspensionDuration, setSuspensionDuration] = useState<string>('');

  const handleSubmit = () => {
    const updateData: EmployeeStatusUpdateDTO = { status };

    if (status === 'ON_LEAVE') {
      if (!leaveStartDate || !leaveEndDate) {
        notify('Both start and end dates are required for leave', 'error');
        return;
      }
      updateData.leaveStartDate = leaveStartDate;
      updateData.expectedReturnDate = leaveEndDate;
    } else if (status === 'SUSPENDED') {
      if (!suspensionDuration) {
        notify('Suspension duration is required', 'error');
        return;
      }
      updateData.suspensionDuration = `PT${suspensionDuration}H`;
    }

    onSubmit(updateData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Employee Status</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="New Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
            >
              {['ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {status === 'ON_LEAVE' && (
            <>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Leave Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={leaveStartDate}
                  onChange={(e) => setLeaveStartDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expected Return Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={leaveEndDate}
                  onChange={(e) => setLeaveEndDate(e.target.value)}
                />
              </Grid>
            </>
          )}

          {status === 'SUSPENDED' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Suspension Duration (hours)"
                type="number"
                value={suspensionDuration}
                onChange={(e) => setSuspensionDuration(e.target.value)}
                inputProps={{ min: 1, max: 720 }} // 1 hour to 30 days
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusUpdateDialog;