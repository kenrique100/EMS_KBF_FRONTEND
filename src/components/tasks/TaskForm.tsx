import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, TextField, MenuItem, Box } from '@mui/material';
import { TaskDTO } from '@/types';
import { taskSchema } from '@/validations/taskValidation';

interface TaskFormProps {
    initialValues?: TaskDTO;
    onSubmit: (data: TaskDTO) => void;
    isSubmitting: boolean;
    employees: { id: number; name: string }[];
}

const TaskForm: React.FC<TaskFormProps> = ({
                                               initialValues,
                                               onSubmit,
                                               isSubmitting,
                                               employees
                                           }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<TaskDTO>({
        resolver: yupResolver(taskSchema),
        defaultValues: initialValues,
    });

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
              <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    {...register('title')}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
              </Grid>
              <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    {...register('description')}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
              </Grid>
              <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Assigned Employee"
                    {...register('employeeId', { valueAsNumber: true })}
                    error={!!errors.employeeId}
                    helperText={errors.employeeId?.message}
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
                    label="Deadline"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register('deadline')}
                    error={!!errors.deadline}
                    helperText={errors.deadline?.message}
                  />
              </Grid>
              <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Expected Hours"
                    type="number"
                    {...register('expectedHours', { valueAsNumber: true })}
                    error={!!errors.expectedHours}
                    helperText={errors.expectedHours?.message}
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
                          {initialValues?.id ? 'Update Task' : 'Create Task'}
                      </Button>
                  </Box>
              </Grid>
          </Grid>
      </form>
    );
};

export default TaskForm;