// src/components/tasks/TaskForm.tsx
import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Task, CreateTaskDTO, ValidationErrors } from '@/utils/types';
import { validateTask } from '@/utils/validators';

interface EmployeeOption {
    id: string;
    name: string;
}

interface TaskFormProps {
    task?: Task;
    employees: EmployeeOption[];
    onSubmit: (data: CreateTaskDTO) => void;
    isSubmitting: boolean;
    submitButtonText?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
                                               task,
                                               employees,
                                               onSubmit,
                                               isSubmitting,
                                               submitButtonText = 'Save',
                                           }) => {
    const [formData, setFormData] = useState<CreateTaskDTO>({
        title: '',
        description: '',
        deadline: new Date(),
        employeeId: '',
        expectedHours: undefined,
    });

    const [errors, setErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                deadline: new Date(task.deadline),
                employeeId: task.employeeId,
                expectedHours: task.expectedHours,
            });
        }
    }, [task]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'expectedHours' ? (value ? Number(value) : undefined) : value,
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setFormData((prev) => ({ ...prev, deadline: date }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateTask(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onSubmit(formData);
    };

    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
              <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    error={!!errors.title}
                    helperText={errors.title}
                    required
                  />
              </Grid>

              <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                  />
              </Grid>

              <Grid item xs={12} md={6}>
                  <DateTimePicker
                    label="Deadline"
                    value={formData.deadline}
                    onChange={handleDateChange}
                    minDateTime={new Date()}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            error: !!errors.deadline,
                            helperText: errors.deadline,
                            required: true,
                        },
                    }}
                  />
              </Grid>

              <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.employeeId} required>
                      <InputLabel>Employee</InputLabel>
                      <Select
                        name="employeeId"
                        value={formData.employeeId}
                        label="Employee"
                        onChange={handleSelectChange}
                      >
                          {employees.map((employee) => (
                            <MenuItem key={employee.id} value={employee.id}>
                                {employee.name}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.employeeId && (
                        <Typography variant="caption" color="error">
                            {errors.employeeId}
                        </Typography>
                      )}
                  </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Expected Hours (optional)"
                    name="expectedHours"
                    type="number"
                    value={formData.expectedHours ?? ''}
                    onChange={handleChange}
                    inputProps={{ min: 0 }}
                  />
              </Grid>
          </Grid>

          <Box mt={3} display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                size="large"
              >
                  {isSubmitting ? 'Saving...' : submitButtonText}
              </Button>
          </Box>
      </Box>
    );
};

export default TaskForm;