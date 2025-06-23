import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
} from '@mui/material';
import { EmployeeStatusHistoryDTO } from '@/types';

interface EmployeeStatusHistoryProps {
  history: EmployeeStatusHistoryDTO[];
}

const EmployeeStatusHistory: React.FC<EmployeeStatusHistoryProps> = ({ history }) => {
  const filteredHistory = history.filter(record => record.status !== 'ACTIVE');

  if (!filteredHistory || filteredHistory.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary" sx={{ p: 2 }}>
        No status history available
      </Typography>
    );
  }

  const formatDateTime = (timestamp?: string): string => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDuration = (duration?: string): string => {
    if (!duration) return 'N/A';

    try {
      const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!matches) return duration;

      const hours = matches[1] ? parseInt(matches[1]) : 0;
      const minutes = matches[2] ? parseInt(matches[2]) : 0;
      const totalHours = hours + minutes / 60;

      if (totalHours >= 24) {
        const days = Math.floor(totalHours / 24);
        const remainingHours = Math.floor(totalHours % 24);
        return `${days}d ${remainingHours}h`;
      }
      return `${totalHours.toFixed(1)}h`;
    } catch {
      return duration;
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small" aria-label="Employee status history">
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Expected End</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredHistory.map((record, index) => (
            <TableRow key={`status-history-${index}`}>
              <TableCell>
                <Chip
                  label={record.status}
                  color={
                    record.status === 'ON_LEAVE' ? 'warning' :
                      record.status === 'SUSPENDED' ? 'info' :
                        record.status === 'TERMINATED' ? 'error' : 'default'
                  }
                  size="small"
                />
              </TableCell>
              <TableCell>{formatDateTime(record.startTimestamp)}</TableCell>
              <TableCell>
                {record.endTimestamp ? formatDateTime(record.endTimestamp) : 'Current'}
              </TableCell>
              <TableCell>
                {formatDuration(record.actualDuration)}
                {record.allocatedDuration && (
                  <Typography variant="caption" display="block" color="textSecondary">
                    (Allocated: {formatDuration(record.allocatedDuration)})
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {record.expectedEndTimestamp
                  ? formatDateTime(record.expectedEndTimestamp)
                  : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeStatusHistory;
