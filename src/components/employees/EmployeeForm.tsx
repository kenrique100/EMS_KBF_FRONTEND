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
    ButtonProps,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import FileUpload from '../common/FileUpload';
import { EmployeeFormData, EmployeeStatus, ValidationErrors } from '@/utils/types';
import { validateEmployee } from '@/utils/validators';
import { uploadFile } from '@/api/files';
import FileActions from '@/components/common/FileActions';

interface EmployeeFormProps {
    employee?: EmployeeFormData;
    onSubmit: (data: EmployeeFormData) => void;
    isSubmitting: boolean;
    submitButtonText?: string;
    submitButtonProps?: ButtonProps;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
                                                       employee,
                                                       onSubmit,
                                                       isSubmitting,
                                                       submitButtonText = 'Save',
                                                       submitButtonProps = {},
                                                   }) => {
    const [formData, setFormData] = useState<EmployeeFormData>({
        username: '',
        name: '',
        password: '',
        dateOfEmployment: null,
        status: 'ACTIVE',
        profilePicture: null,
        document: null,
    });

    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [document, setDocument] = useState<File | null>(null);
    const [errors, setErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        if (employee) {
            setFormData({
                username: employee.username,
                name: employee.name,
                password: '',
                dateOfEmployment: employee.dateOfEmployment
                  ? new Date(employee.dateOfEmployment)
                  : null,
                status: employee.status,
                profilePicture: employee.profilePicture ?? null,
                document: employee.document ?? null,
            });

            if (typeof employee.profilePicture !== 'string') {
                setProfilePicture(employee.profilePicture ?? null);
            }

            if (typeof employee.document !== 'string') {
                setDocument(employee.document ?? null);
            }
        }
    }, [employee]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (e: SelectChangeEvent) => {
        setFormData((prev) => ({
            ...prev,
            status: e.target.value as EmployeeStatus,
        }));
    };

    const handleDateChange = (date: Date | null) => {
        setFormData((prev) => ({ ...prev, dateOfEmployment: date }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateEmployee(formData, !employee);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            let profilePicturePath: string | undefined;
            let documentPath: string | undefined;

            if (profilePicture) {
                const response = await uploadFile(profilePicture, 'profilePictures');
                profilePicturePath = response.path;
            } else if (typeof formData.profilePicture === 'string') {
                profilePicturePath = formData.profilePicture;
            }

            if (document) {
                const response = await uploadFile(document, 'documents');
                documentPath = response.path;
            } else if (typeof formData.document === 'string') {
                documentPath = formData.document;
            }

            setErrors({});
            onSubmit({
                ...formData,
                profilePicture: profilePicturePath,
                document: documentPath,
            });
        } catch (error) {
            console.error('Upload failed:', error);
        }
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
                        value={formData.status}
                        label="Status"
                        onChange={handleStatusChange}
                      >
                          <MenuItem value="ACTIVE">Active</MenuItem>
                          <MenuItem value="INACTIVE">Inactive</MenuItem>
                          <MenuItem value="ON_LEAVE">On Leave</MenuItem>
                          <MenuItem value="TERMINATED">Terminated</MenuItem>
                      </Select>
                  </FormControl>
              </Grid>

              {/* Profile Picture Upload */}
              <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                      Profile Picture
                  </Typography>
                  {typeof formData.profilePicture === 'string' ? (
                    <FileActions filename={formData.profilePicture} subDirectory="profilePictures" />
                  ) : (
                    <FileUpload
                      label="Profile Picture"
                      name="profilePicture"
                      accept="image/*"
                      onFileChange={setProfilePicture}
                    />
                  )}
              </Grid>

              {/* Document Upload */}
              <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                      Document
                  </Typography>
                  {typeof formData.document === 'string' ? (
                    <FileActions filename={formData.document} subDirectory="documents" />
                  ) : (
                    <FileUpload
                      label="Document"
                      name="document"
                      accept=".pdf,.doc,.docx"
                      onFileChange={setDocument}
                    />
                  )}
              </Grid>
          </Grid>
          <Box mt={3} display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                color="primary"
                disabled={isSubmitting}
                {...submitButtonProps}
              >
                  {isSubmitting ? 'Saving...' : submitButtonText}
              </Button>
          </Box>
      </Box>
    );
};

export default EmployeeForm;
