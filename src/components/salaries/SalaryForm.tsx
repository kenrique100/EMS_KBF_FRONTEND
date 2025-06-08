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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { validateSalary } from '@/utils/validators';
import { SalaryFormData, ValidationErrors, Employee } from '@/utils/types';

interface SalaryFormProps {
    salary?: SalaryFormData;
    employees: Employee[];
    onSubmit: (data: SalaryFormData) => void;
    isSubmitting: boolean;
}

const SalaryForm = ({ salary, employees, onSubmit, isSubmitting }: SalaryFormProps) => {
    const [formData, setFormData] = useState<SalaryFormData>({
        amount: '',
        paymentDate: null,
        employeeId: '',
        paymentReference: '',
    });

    const [errors, setErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        if (salary) {
            setFormData({
                amount: salary.amount || '',
                paymentDate: salary.paymentDate || null,
                employeeId: salary.employeeId || '',
                paymentReference: salary.paymentReference || '',
            });
        }
    }, [salary]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: Date | null) => {
        setFormData((prev) => ({ ...prev, paymentDate: date }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
                        inputProps: { min: 0, step: 0.01 },
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
                  </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
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
              >
                  {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
          </Box>
      </Box>
    );
};

export default SalaryForm;
