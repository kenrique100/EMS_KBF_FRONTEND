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
import { formatDate } from '@/utils/formatters';

interface EmployeeStatusHistoryProps {
  history: EmployeeStatusHistoryDTO[];
}

const EmployeeStatusHistory: React.FC<EmployeeStatusHistoryProps> = ({ history }) => {
  // Filter out ACTIVE statuses
  const filteredHistory = history.filter(record => record.status !== 'ACTIVE');

  if (filteredHistory.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary" sx={{ p: 2 }}>
        No status history available
      </Typography>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ON_LEAVE': return 'warning';
      case 'SUSPENDED': return 'info';
      case 'TERMINATED': return 'error';
      default: return 'default';
    }
  };

  const formatDuration = (duration?: string) => {
    if (!duration) return 'N/A';

    try {
      // Convert ISO 8601 duration to hours
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return duration;

      const hours = parseInt(match[1] || '0');
      const minutes = parseInt(match[2] || '0');
      const seconds = parseInt(match[3] || '0');

      const totalHours = hours + (minutes / 60) + (seconds / 3600);
      return `${totalHours.toFixed(1)} hours`;
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
                  color={getStatusColor(record.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{formatDate(record.startTimestamp)}</TableCell>
              <TableCell>
                {record.endTimestamp ? formatDate(record.endTimestamp) : 'Current'}
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
                  ? formatDate(record.expectedEndTimestamp)
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