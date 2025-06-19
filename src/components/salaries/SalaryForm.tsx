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
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { validateSalary } from '@/utils/validators';
import { Employee, SalaryFormData, ValidationErrors, PaymentStatus } from '@/types';

interface SalaryFormProps {
    salary?: SalaryFormData;
    employees: Employee[];
    onSubmit: (data: SalaryFormData) => void;
    isSubmitting: boolean;
    submitButtonText?: string;
    initialValues?: Partial<SalaryFormData>;
}

const SalaryForm: React.FC<SalaryFormProps> = ({
                                                   salary,
                                                   employees,
                                                   onSubmit,
                                                   isSubmitting,
                                                   submitButtonText = 'Save',
                                                   initialValues
                                               }) => {
    const [formData, setFormData] = useState<SalaryFormData>({
        id: 0,
        amount: 0,
        paymentDate: null,
        employeeId: 0,
        paymentReference: '',
        status: PaymentStatus.PENDING,
    });

    const [errors, setErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        if (salary) {
            setFormData({
                id: salary.id,
                amount: salary.amount,
                paymentDate: salary.paymentDate,
                employeeId: salary.employeeId,
                paymentReference: salary.paymentReference || '',
                status: salary.status
            });
        } else if (initialValues) {
            setFormData(prev => ({
                ...prev,
                id: initialValues.id || 0,
                amount: initialValues.amount || 0,
                paymentDate: initialValues.paymentDate || null,
                employeeId: initialValues.employeeId || 0,
                paymentReference: initialValues.paymentReference || '',
                status: initialValues.status || PaymentStatus.PENDING
            }));
        }
    }, [salary, initialValues]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? Number(value) : value
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<number | PaymentStatus>) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name as keyof SalaryFormData]: value
        }));
    };

    const handleDateChange = (date: Date | null) => {
        setFormData(prev => ({ ...prev, paymentDate: date }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateSalary(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        onSubmit(formData);
    };

    return (
      <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    error={!!errors.amount}
                    helperText={errors.amount}
                    margin="normal"
                    InputProps={{
                        inputProps: {
                            min: 0,
                            step: 0.01
                        },
                    }}
                  />
              </Grid>
              <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Payment Date"
                    value={formData.paymentDate}
                    onChange={handleDateChange}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            margin: 'normal',
                            error: !!errors.paymentDate,
                            helperText: errors.paymentDate,
                        },
                    }}
                  />
              </Grid>
              <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal" error={!!errors.employeeId}>
                      <InputLabel id="employee-select-label">Employee</InputLabel>
                      <Select
                        labelId="employee-select-label"
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
                  <FormControl fullWidth margin="normal" error={!!errors.status}>
                      <InputLabel id="status-select-label">Status</InputLabel>
                      <Select
                        labelId="status-select-label"
                        name="status"
                        value={formData.status}
                        label="Status"
                        onChange={handleSelectChange}
                      >
                          {Object.values(PaymentStatus).map(status => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.status && (
                        <Typography variant="caption" color="error">
                            {errors.status}
                        </Typography>
                      )}
                  </FormControl>
              </Grid>
              <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Payment Reference"
                    name="paymentReference"
                    value={formData.paymentReference}
                    onChange={handleChange}
                    margin="normal"
                    disabled={!!salary}
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

export default SalaryForm;