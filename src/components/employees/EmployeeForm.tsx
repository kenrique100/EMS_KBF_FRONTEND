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
import FileActions from '../common/FileActions';
import { validateEmployee } from '@/utils/validators';
import { EmployeeFormData, EmployeeStatus, Department, FileUploadResponse } from '@/types';
import { getFileUrl } from '@/api/files';

const departmentOptions = [
  { value: 'FISHERY', label: 'Fishery' },
  { value: 'POULTRY', label: 'Poultry' },
  { value: 'RABBITRY', label: 'Rabbitry' },
  { value: 'CONSTRUCTION', label: 'Construction' },
  { value: 'CROPS', label: 'Crops' },
  { value: 'LIVESTOCK', label: 'Livestock' },
  { value: 'DAIRY', label: 'Dairy' },
  { value: 'AGRO_FORESTRY', label: 'Agro Forestry' },
  { value: 'IRRIGATION', label: 'Irrigation' },
  { value: 'FARM_MANAGEMENT', label: 'Farm Management' },
  { value: 'AGRICULTURAL_ENGINEERING', label: 'Agricultural Engineering' },
  { value: 'FOOD_PROCESSING', label: 'Food Processing' },
];

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
    email: '',
    phoneNumber: '',
    department: 'FARM_MANAGEMENT',
    password: '',
    dateOfEmployment: null,
    status: 'ACTIVE',
    profilePicturePath: null,
    documentPath: null,
    profilePictureFile: null,
    documentFile: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        dateOfEmployment: employee.dateOfEmployment ? new Date(employee.dateOfEmployment) : null,
        profilePicturePath: employee.profilePicturePath ?? null,
        documentPath: employee.documentPath ?? null,
        profilePictureFile: null,
        documentFile: null,
      });
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

  const handleDepartmentChange = (e: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      department: e.target.value as Department,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, dateOfEmployment: date }));
  };

  const handleProfilePictureUpload = (response: FileUploadResponse) => {
    setFormData((prev) => ({
      ...prev,
      profilePicturePath: response.filename,
      profilePictureFile: null,
    }));
  };

  const handleDocumentUpload = (response: FileUploadResponse) => {
    setFormData((prev) => ({
      ...prev,
      documentPath: response.filename,
      documentFile: null,
    }));
  };

  const handleProfilePictureDelete = () => {
    setFormData((prev) => ({
      ...prev,
      profilePicturePath: null,
      profilePictureFile: null,
    }));
  };

  const handleDocumentDelete = () => {
    setFormData((prev) => ({
      ...prev,
      documentPath: null,
      documentFile: null,
    }));
  };

  const getProfilePictureUrl = () => {
    if (formData.profilePicturePath) {
      return getFileUrl(formData.profilePicturePath, 'profiles');
    }
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateEmployee(formData, !employee);
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
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal" error={!!errors.department}>
            <InputLabel>Department</InputLabel>
            <Select
              value={formData.department}
              label="Department"
              onChange={handleDepartmentChange}
            >
              {departmentOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.department && (
              <Typography variant="caption" color="error">
                {errors.department}
              </Typography>
            )}
          </FormControl>
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
            required={!employee}
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
            <Select value={formData.status} label="Status" onChange={handleStatusChange}>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
              <MenuItem value="ON_LEAVE">On Leave</MenuItem>
              <MenuItem value="TERMINATED">Terminated</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Profile Picture
          </Typography>
          {formData.profilePicturePath ? (
            <Box>
              <Box mb={2}>
                <img
                  src={getProfilePictureUrl()}
                  alt="Profile"
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
              </Box>
              <FileActions
                filename={formData.profilePicturePath}
                subDirectory="profiles"
                onDeleteSuccess={handleProfilePictureDelete}
                disabled={isSubmitting}
              />
            </Box>
          ) : (
            <FileUpload
              label="Upload Profile Picture"
              subDirectory="profiles"
              accept="image/*"
              onUploadSuccess={handleProfilePictureUpload}
              disabled={isSubmitting}
            />
          )}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Document
          </Typography>
          {formData.documentPath ? (
            <FileActions
              filename={formData.documentPath}
              subDirectory="documents"
              onDeleteSuccess={handleDocumentDelete}
              disabled={isSubmitting}
            />
          ) : (
            <FileUpload
              label="Upload Document"
              subDirectory="documents"
              accept=".pdf,.doc,.docx"
              onUploadSuccess={handleDocumentUpload}
              disabled={isSubmitting}
            />
          )}
        </Grid>
      </Grid>
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          type="submit"
          variant="contained"
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