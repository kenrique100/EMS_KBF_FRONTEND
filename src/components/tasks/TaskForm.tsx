// src/components/tasks/TaskForm.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
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
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Task, CreateTaskDTO, TaskStatus, ValidationErrors } from '@/utils/types';
import { validateTask } from '@/utils/validators';

interface EmployeeOption {
    id: string;
    name: string;
}

interface TaskFormProps {
    task?: Partial<Task>;
    employees: EmployeeOption[];
    onSubmit: (data: CreateTaskDTO) => void;
    isSubmitting: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, employees, onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState<CreateTaskDTO>({
        title: '',
        description: '',
        deadline: new Date(),
        employeeId: '',
        status: TaskStatus.PENDING,
    });

    const [errors, setErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                deadline: task.deadline ? new Date(task.deadline) : new Date(),
                employeeId: task.employeeId || '',
                status: task.status || TaskStatus.PENDING,
                expectedHours: task.expectedHours,
            });
        }
    }, [task]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'expectedHours' ? Number(value) : value,
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name as keyof CreateTaskDTO]: value,
        }));
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setFormData(prev => ({ ...prev, deadline: date }));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const validationErrors = validateTask(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onSubmit(formData);
    };

    return (
      <Box component="form" onSubmit={handleSubmit}>
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
                    margin="normal"
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
                    margin="normal"
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
                            margin: 'normal',
                            error: !!errors.deadline,
                            helperText: errors.deadline,
                            required: true,
                        },
                    }}
                  />
              </Grid>

              <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal" error={!!errors.employeeId} required>
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
                  </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Expected Hours"
                    name="expectedHours"
                    type="number"
                    value={formData.expectedHours ?? ''}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
              </Grid>
          </Grid>

          <Box mt={3} display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
          </Box>
      </Box>
    );
};

export default TaskForm;