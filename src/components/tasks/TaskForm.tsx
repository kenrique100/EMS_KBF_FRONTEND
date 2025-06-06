import { useState, useEffect } from 'react';
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
import {validateTask} from "../../utils/validators";

const TaskForm = ({ task, employees, onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: null,
        employeeId: '',
        expectedHours: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                deadline: task.deadline || null,
                employeeId: task.employeeId || '',
                expectedHours: task.expectedHours || '',
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, deadline: date });
    };

    const handleSubmit = (e) => {
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
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                margin="normal"
                                error={!!errors.deadline}
                                helperText={errors.deadline}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Employee</InputLabel>
                        <Select
                            name="employeeId"
                            value={formData.employeeId}
                            label="Employee"
                            onChange={handleChange}
                            error={!!errors.employeeId}
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
                        value={formData.expectedHours}
                        onChange={handleChange}
                        margin="normal"
                        InputProps={{
                            inputProps: { min: 0 },
                        }}
                    />
                </Grid>
            </Grid>
            <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
            </Box>
        </Box>
    );
};

export default TaskForm;