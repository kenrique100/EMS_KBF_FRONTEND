import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PageHeader from '@/components/common/PageHeader';
import Loading from '@/components/common/Loading';
import { getSalaryPaymentById } from '@/api/salaries';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { useAuthStore } from '@/store/authStore';
import { PaymentStatus, SalaryPayment } from '@/types';
import { useNotification } from '@/contexts/NotificationContext';

const getStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case 'PAID':
      return 'success.main';
    case 'PROCESSED':
      return 'info.main';
    case 'FAILED':
    case 'CANCELLED':
      return 'error.main';
    case 'PENDING':
    default:
      return 'warning.main';
  }
};

const SalaryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [salary, setSalary] = useState<SalaryPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const hasAdminRole = useAuthStore(state => state.hasRole('ROLE_ADMIN'));

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const data = await getSalaryPaymentById(Number(id));
        setSalary(data);
      } catch (error) {
        showNotification('Failed to fetch salary details', 'error');
        navigate('/salaries');
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, [id, navigate, showNotification]);

  if (loading) {
    return <Loading />;
  }

  if (!salary) {
    return (
      <Container maxWidth="md">
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="error" gutterBottom>
            Salary payment not found
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/salaries')}
            variant="outlined"
          >
            Back to Salaries
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <PageHeader
        title="Salary Payment Details"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Salaries', path: '/salaries' },
          { label: `Payment #${id}`, path: `/salaries/${id}` }
        ]}
        action={
          <Box display="flex" gap={2}>
            <IconButton
              onClick={() => navigate('/salaries')}
              aria-label="go back"
            >
              <ArrowBackIcon />
            </IconButton>
            {hasAdminRole && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/salaries/${id}/edit`)}
              >
                Edit
              </Button>
            )}
          </Box>
        }
      />

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Payment Information
              </Typography>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Amount
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(salary.amount)}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Payment Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(salary.paymentDate)}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                <Typography
                  variant="body1"
                  color={getStatusColor(salary.status)}
                >
                  {salary.status}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Created At
                </Typography>
                <Typography variant="body1">
                  {formatDate(salary.createdAt)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Employee Information
              </Typography>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Employee Name
                </Typography>
                <Typography variant="body1">
                  {salary.employeeName}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Employee ID
                </Typography>
                <Typography variant="body1">
                  {salary.employeeId}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Payment Reference
                </Typography>
                <Typography variant="body1">
                  {salary.paymentReference || 'N/A'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SalaryDetailPage;