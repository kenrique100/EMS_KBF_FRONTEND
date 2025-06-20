import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, TextField, MenuItem, Box } from '@mui/material';
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
                                                   employees
                                               }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SalaryPaymentDTO>({
        resolver: yupResolver(salarySchema as any),
        defaultValues: initialValues,
    });

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Employee"
                    {...register('employeeId')}
                    error={!!errors.employeeId}
                    helperText={errors.employeeId?.message}
                    disabled={isSubmitting}
                  >
                      {employees.map((employee) => (
                        <MenuItem key={employee.id} value={employee.id}>
                            {employee.name}
                        </MenuItem>
                      ))}
                  </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    inputProps={{ step: "0.01" }}
                    {...register('amount')}
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    disabled={isSubmitting}
                  />
              </Grid>
              <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Payment Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register('paymentDate')}
                    error={!!errors.paymentDate}
                    helperText={errors.paymentDate?.message}
                    disabled={isSubmitting}
                  />
              </Grid>
              <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Payment Reference (Optional)"
                    {...register('paymentReference')}
                    error={!!errors.paymentReference}
                    helperText={errors.paymentReference?.message}
                    disabled={isSubmitting}
                  />
              </Grid>
              <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                      >
                          {initialValues?.id ? 'Update Salary' : 'Create Salary'}
                      </Button>
                  </Box>
              </Grid>
          </Grid>
      </form>
    );
};

export default SalaryForm;