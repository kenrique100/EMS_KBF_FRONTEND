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
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
  Box
} from '@mui/material';
import { motion } from 'framer-motion';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { SalaryPayment } from '@/types';
import { useAuthStore } from '@/store/authStore';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { downloadSalaryReceipt } from '@/api/salaries';

interface SalaryListProps {
  salaries: SalaryPayment[];
  onViewDetails?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  isProfileView?: boolean;
}

const MotionTableRow = motion(TableRow);

const SalaryList: React.FC<SalaryListProps> = ({
                                                 salaries,
                                                 onViewDetails,
                                                 onEdit,
                                                 onDelete,
                                                 isProfileView = false
                                               }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        borderRadius: 3,
        boxShadow: theme.shadows[3],
        overflow: 'hidden'
      }}
    >
      <Table size={isMobile ? 'small' : 'medium'}>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
            {!isProfileView && <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>}
            <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Payment Date</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Reference</TableCell>
            {isAdmin && <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>}
            {(isAdmin || isProfileView) && <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {salaries.map((salary, index) => (
            <MotionTableRow
              key={salary.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{
                scale: 1.005,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
              }}
              sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              {!isProfileView && <TableCell>{salary.employeeName}</TableCell>}
              <TableCell>{formatCurrency(salary.amount)}</TableCell>
              <TableCell>{formatDate(salary.paymentDate)}</TableCell>
              <TableCell>{salary.status}</TableCell>
              <TableCell>{salary.paymentReference || 'N/A'}</TableCell>
              {isAdmin && <TableCell>{formatDate(salary.createdAt)}</TableCell>}
              {(isAdmin || isProfileView) && (
                <TableCell align="right">
                  <Box display="flex" gap={1} flexWrap="wrap" justifyContent="flex-end">
                    {onViewDetails && (
                      isMobile ? (
                        <Tooltip title="View">
                          <IconButton size="small" onClick={() => onViewDetails(salary.id)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Button size="small" onClick={() => onViewDetails(salary.id)}>
                          View
                        </Button>
                      )
                    )}
                    <Tooltip title="Download Receipt">
                      <IconButton size="small" onClick={() => downloadSalaryReceipt(salary.id)}>
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {isAdmin && onEdit && (
                      isMobile ? (
                        <Tooltip title="Edit">
                          <IconButton size="small" color="secondary" onClick={() => onEdit(salary.id)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Button size="small" color="secondary" onClick={() => onEdit(salary.id)}>
                          Edit
                        </Button>
                      )
                    )}
                    {isAdmin && onDelete && (
                      isMobile ? (
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => onDelete(salary.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Button size="small" color="error" onClick={() => onDelete(salary.id)}>
                          Delete
                        </Button>
                      )
                    )}
                  </Box>
                </TableCell>
              )}
            </MotionTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SalaryList;
