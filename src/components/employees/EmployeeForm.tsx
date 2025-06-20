// src/components/employees/EmployeeForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, TextField, MenuItem, Box } from '@mui/material';
import { EmployeeDTO, Department } from '@/types';
import { employeeSchema } from '@/validations/employeeValidation';

interface EmployeeFormProps {
  initialValues?: EmployeeDTO;
  onSubmit: (data: EmployeeDTO) => void;
  isSubmitting: boolean;
}

const departments: Department[] = [
  { id: 1, name: 'FISHERY', displayName: 'Fishery' },
  { id: 2, name: 'POULTRY', displayName: 'Poultry' },
  { id: 3, name: 'RABBITRY', displayName: 'Rabbitry' },
  { id: 4, name: 'CONSTRUCTION', displayName: 'Construction' },
  { id: 5, name: 'CROPS', displayName: 'Crops' },
  { id: 6, name: 'LIVESTOCK', displayName: 'Livestock' },
  { id: 7, name: 'DAIRY', displayName: 'Dairy' },
  { id: 8, name: 'FARM_MANAGEMENT', displayName: 'Farm Management' },
];

const EmployeeForm: React.FC<EmployeeFormProps> = ({
                                                     initialValues,
                                                     onSubmit,
                                                     isSubmitting
                                                   }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EmployeeDTO>({
    resolver: yupResolver(employeeSchema),
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Username"
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>
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
            select
            fullWidth
            label="Department"
            {...register('department')}
            error={!!errors.department}
            helperText={errors.department?.message}
          >
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.name}>
                {dept.displayName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Employment"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register('dateOfEmployment')}
            error={!!errors.dateOfEmployment}
            helperText={errors.dateOfEmployment?.message}
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
              {initialValues?.id ? 'Update Employee' : 'Create Employee'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default EmployeeForm;