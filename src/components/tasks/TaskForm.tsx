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
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { CreateTaskDTO, TaskStatus } from '@/types';

interface EmployeeOption {
    id: number;
    name: string;
}

interface TaskFormProps {
    employees: EmployeeOption[];
    onSubmit: (data: CreateTaskDTO) => void;
    isSubmitting: boolean;
    submitButtonText?: string;
    initialData?: Partial<CreateTaskDTO>;
}

const TaskForm: React.FC<TaskFormProps> = ({
                                               employees,
                                               onSubmit,
                                               isSubmitting,
                                               submitButtonText = 'Save',
                                               initialData
                                           }) => {
    const [formData, setFormData] = useState<CreateTaskDTO>({
        title: '',
        description: '',
        deadline: new Date().toISOString(),
        employeeId: 0,
        status: TaskStatus.PENDING,
        expectedHours: undefined,
        actualHours: undefined,
        startTime: undefined,
        stopTime: undefined,
        ...initialData
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData
            }));
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'expectedHours' || name === 'actualHours'
              ? (value ? Number(value) : undefined)
              : value
        }));
    };

    const handleSelectChange = (e: { target: { name?: string; value: unknown } }) => {
        const { name, value } = e.target;
        if (name) {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setFormData(prev => ({
                ...prev,
                deadline: date.toISOString()
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Convert deadline string to Date object for the DateTimePicker
    const deadlineDate = formData.deadline
      ? new Date(formData.deadline)
      : new Date();

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
                    value={deadlineDate}
                    onChange={handleDateChange}
                    minDateTime={new Date()}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            required: true
                        }
                    }}
                  />
              </Grid>
              <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                      <InputLabel>Employee</InputLabel>
                      <Select
                        name="employeeId"
                        value={formData.employeeId}
                        label="Employee"
                        onChange={handleSelectChange}
                      >
                          {employees.map(employee => (
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
                    value={formData.expectedHours || ''}
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