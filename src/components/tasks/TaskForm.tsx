import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Grid,
  TextField,
  MenuItem,
  Box,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { TaskDTO } from '@/types';
import { taskSchema } from '@/validations/taskValidation';

interface TaskFormProps {
  initialValues?: Partial<TaskDTO>;
  onSubmit: SubmitHandler<TaskDTO>;
  isSubmitting: boolean;
  employees: { id: number; name: string }[];
}

const TaskForm: React.FC<TaskFormProps> = ({
                                             initialValues,
                                             onSubmit,
                                             isSubmitting,
                                             employees
                                           }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Prepare default values with proper type handling
  const defaultValues: Partial<TaskDTO> = {
    title: '',
    description: '',
    employeeId: undefined, // Start with undefined
    deadline: '',
    expectedHours: 0,
    ...initialValues
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<TaskDTO>({
    resolver: yupResolver(taskSchema),
    defaultValues
  });

  const employeeId = watch('employeeId');

  React.useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        employeeId: initialValues.employeeId
      });
    }
  }, [initialValues, reset]);

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {initialValues?.id ? 'Edit Task' : 'Create Task'}
        </Typography>
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
              multiline
              rows={4}
              label="Description"
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
              value={employeeId ?? ''}
              {...register('employeeId', {
                setValueAs: (v) => v === '' ? undefined : Number(v)
              })}
              error={!!errors.employeeId}
              helperText={errors.employeeId?.message}
            >
              <MenuItem value="">None</MenuItem>
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.name}
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
            <Box display="flex" justifyContent={isMobile ? 'center' : 'flex-end'}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {initialValues?.id ? 'Update Task' : 'Create Task'}
                </Button>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </motion.form>
  );
};

export default TaskForm;