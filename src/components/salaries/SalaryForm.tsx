// SalaryForm.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, TextField, MenuItem, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { SalaryPaymentDTO } from '@/types';
import { salarySchema } from '@/validations/salaryValidation';

interface SalaryFormProps {
  initialValues?: SalaryPaymentDTO;
  onSubmit: SubmitHandler<SalaryPaymentDTO>;
  isSubmitting: boolean;
  employees: { id: number; name: string }[];
}

const SalaryForm: React.FC<SalaryFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting,
  employees,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SalaryPaymentDTO>({
    resolver: yupResolver(salarySchema),
    defaultValues: initialValues || {
      amount: 0,
      paymentDate: new Date().toISOString().split('T')[0], // Default to today
      employeeId: undefined,
      paymentReference: '',
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ scale: 1.01 }}>
              <TextField
                select
                fullWidth
                label="Employee *"
                {...register('employeeId')}
                error={!!errors.employeeId}
                helperText={errors.employeeId?.message}
                disabled={isSubmitting}
                required
              >
                <MenuItem value="">
                  <em>Select an employee</em>
                </MenuItem>
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </MenuItem>
                ))}
              </TextField>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ scale: 1.01 }}>
              <TextField
                fullWidth
                label="Amount *"
                type="number"
                inputProps={{
                  step: '0.01',
                  min: '0',
                }}
                {...register('amount')}
                error={!!errors.amount}
                helperText={errors.amount?.message}
                disabled={isSubmitting}
                required
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ scale: 1.01 }}>
              <TextField
                fullWidth
                label="Payment Date *"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register('paymentDate')}
                error={!!errors.paymentDate}
                helperText={errors.paymentDate?.message}
                disabled={isSubmitting}
                required
                inputProps={{
                  max: new Date().toISOString().split('T')[0],
                }}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ scale: 1.01 }}>
              <TextField
                fullWidth
                label="Payment Reference"
                {...register('paymentReference')}
                error={!!errors.paymentReference}
                helperText={errors.paymentReference?.message}
                disabled={isSubmitting}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  sx={{
                    minWidth: 120,
                    height: 40,
                  }}
                >
                  {initialValues?.id ? 'Update Salary' : 'Create Salary'}
                </Button>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </form>
    </motion.div>
  );
};

export default SalaryForm;
