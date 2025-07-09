import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Grid,
  TextField,
  MenuItem,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { EmployeeDTO } from '@/types';
import { employeeSchema } from '@/validations/employeeValidation';
import { departmentOptions } from '@/utils/departmentUtils';

interface EmployeeFormProps {
  initialValues?: EmployeeDTO;
  onSubmit: (data: EmployeeDTO) => Promise<void>;
  isSubmitting: boolean;
  title?: string;
}

const MotionGrid = motion(Grid);

const EmployeeForm: React.FC<EmployeeFormProps> = ({
                                                     initialValues,
                                                     onSubmit,
                                                     isSubmitting,
                                                     title = initialValues?.id ? 'Edit Employee' : 'Create Employee',
                                                   }) => {
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeDTO>({
    resolver: yupResolver(employeeSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        department: initialValues.department || ''
      });
    }
  }, [initialValues, reset]);

  const submitHandler = async (data: EmployeeDTO) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Card
        elevation={3}
        sx={{
          mt: 4,
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          boxShadow: theme.shadows[4],
        }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {title}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit(submitHandler)} noValidate>
            <Grid container spacing={3}>
              <MotionGrid item xs={12} md={6} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <TextField
                  fullWidth
                  label="Username"
                  {...register('username')}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
              </MotionGrid>

              <MotionGrid item xs={12} md={6} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </MotionGrid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  {...register('phoneNumber')}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="National ID"
                  {...register('nationalId')}
                  error={!!errors.nationalId}
                  helperText={errors.nationalId?.message}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Department"
                  {...register('department')}
                  error={!!errors.department}
                  helperText={errors.department?.message}
                  defaultValue={initialValues?.department || ''}
                >
                  {departmentOptions.map((dept) => (
                    <MenuItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date of Employment"
                  InputLabelProps={{ shrink: true }}
                  {...register('dateOfEmployment')}
                  error={!!errors.dateOfEmployment}
                  helperText={errors.dateOfEmployment?.message}
                />
              </Grid>

              {!initialValues?.id && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" mt={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    sx={{ minWidth: 180, py: 1.2, fontWeight: 600 }}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={20} color="inherit" />
                        <Box ml={1}>Processing...</Box>
                      </>
                    ) : initialValues?.id ? 'Update Employee' : 'Create Employee'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmployeeForm;