import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import FileUpload from '../common/FileUpload';
import { validateEmployee } from '@/utils/validators';

interface Employee {
    id?: string;
    username: string;
    name: string;
    dateOfEmployment: string | Date | null;
    status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
}

interface EmployeeFormProps {
    employee?: Employee;
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
}

interface FormData {
    username: string;
    name: string;
    password: string;
    dateOfEmployment: Date | null;
    status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
}

interface ValidationErrors {
    [key: string]: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        name: '',
        password: '',
        dateOfEmployment: null,
        status: 'ACTIVE',
    });

    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [document, setDocument] = useState<File | null>(null);
    const [errors, setErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        if (employee) {
            setFormData({
                username: employee.username || '',
                name: employee.name || '',
                password: '',
                dateOfEmployment: employee.dateOfEmployment
                    ? typeof employee.dateOfEmployment === 'string'
                        ? new Date(employee.dateOfEmployment)
                        : employee.dateOfEmployment
                    : null,
                status: employee.status || 'ACTIVE',
            });
        }
    }, [employee]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDateChange = (date: Date | null) => {
        setFormData({ ...formData, dateOfEmployment: date });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validateEmployee(formData, !employee);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        onSubmit({
            ...formData,
            profilePicture,
            document,
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        error={!!errors.username}
                        helperText={errors.username}
                        margin="normal"
                        disabled={!!employee}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <DatePicker
                        label="Date of Employment"
                        value={formData.dateOfEmployment}
                        onChange={handleDateChange}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                margin: 'normal',
                                error: !!errors.dateOfEmployment,
                                helperText: errors.dateOfEmployment,
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={formData.status}
                            label="Status"
                            onChange={handleChange}
                        >
                            <MenuItem value="ACTIVE">Active</MenuItem>
                            <MenuItem value="INACTIVE">Inactive</MenuItem>
                            <MenuItem value="ON_LEAVE">On Leave</MenuItem>
                            <MenuItem value="TERMINATED">Terminated</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FileUpload
                        label="Profile Picture"
                        name="profilePicture"
                        accept="image/*"
                        onFileChange={setProfilePicture}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FileUpload
                        label="Document"
                        name="document"
                        accept=".pdf,.doc,.docx"
                        onFileChange={setDocument}
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

export default EmployeeForm;
