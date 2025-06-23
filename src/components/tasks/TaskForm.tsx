import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Button,
    Grid,
    TextField,
    MenuItem,
    Box,
    Paper,
    Typography,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
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
                                               employees,
                                           }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskDTO>({
        resolver: yupResolver(taskSchema),
        defaultValues: initialValues,
    });

    return (
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
          <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, borderRadius: 3 }}>
              <Typography variant="h6" mb={2}>
                  {initialValues ? 'Edit Task' : 'Create Task'}
              </Typography>
              <Grid container spacing={2}>
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
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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