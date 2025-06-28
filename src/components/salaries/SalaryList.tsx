import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  IconButton
} from '@mui/material';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { SalaryPayment } from '@/types';
import { useAuthStore } from '@/store/authStore';
import DownloadIcon from '@mui/icons-material/Download';
import { downloadSalaryReceipt } from '@/api/salaries';

interface SalaryListProps {
  salaries: SalaryPayment[];
  onViewDetails?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  isProfileView?: boolean;
}

const SalaryList: React.FC<SalaryListProps> = ({
                                                 salaries,
                                                 onViewDetails,
                                                 onEdit,
                                                 onDelete,
                                                 isProfileView = false
                                               }) => {
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole('ROLE_ADMIN');

  if (salaries.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ py: 4 }}>
        No salary payments found
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {!isProfileView && <TableCell>Employee</TableCell>}
            <TableCell>Amount</TableCell>
            <TableCell>Payment Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Reference</TableCell>
            {isAdmin && <TableCell>Created At</TableCell>}
            {(isAdmin || isProfileView) && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {salaries.map((salary) => (
            <TableRow key={salary.id}>
              {!isProfileView && <TableCell>{salary.employeeName}</TableCell>}
              <TableCell>{formatCurrency(salary.amount)}</TableCell>
              <TableCell>{formatDate(salary.paymentDate)}</TableCell>
              <TableCell>{salary.status}</TableCell>
              <TableCell>{salary.paymentReference || 'N/A'}</TableCell>
              {isAdmin && <TableCell>{formatDate(salary.createdAt)}</TableCell>}
              {(isAdmin || isProfileView) && (
                <TableCell align="right">
                  {onViewDetails && (
                    <Button
                      size="small"
                      onClick={() => onViewDetails(salary.id)}
                      sx={{ mr: 1 }}
                    >
                      View
                    </Button>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => downloadSalaryReceipt(salary.id)}
                    sx={{ mr: 1 }}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                  {isAdmin && onEdit && (
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => onEdit(salary.id)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                  )}
                  {isAdmin && onDelete && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => onDelete(salary.id)}
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SalaryList;