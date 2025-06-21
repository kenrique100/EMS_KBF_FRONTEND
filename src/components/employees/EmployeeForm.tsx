import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button, Grid, TextField, MenuItem, Box,
  FormControl, InputLabel, FormHelperText, Alert
} from '@mui/material';
import { EmployeeDTO } from '@/types';
import { employeeSchema } from '@/validations/employeeValidation';
import { departments } from '@/utils/departmentUtils';
import { getFileUrl } from '@/utils/fileUtils';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface EmployeeFormProps {
  initialValues?: EmployeeDTO;
  onSubmit: (data: EmployeeDTO, profilePicture?: File, document?: File) => void;
  isSubmitting: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
                                                     initialValues,
                                                     onSubmit,
                                                     isSubmitting
                                                   }) => {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EmployeeDTO>({
    resolver: yupResolver(employeeSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
      if (initialValues.profilePicturePath) {
        setProfilePreview(getFileUrl(initialValues.profilePicturePath));
      }
    }
  }, [initialValues, reset]);

  const validateFile = (file: File, type: 'image' | 'document'): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      setFileError(`File size exceeds maximum limit of 5MB`);
      return false;
    }

    const allowedTypes = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_DOCUMENT_TYPES;

    if (!allowedTypes.includes(file.type)) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const extensionMap: Record<string, string> = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      };

      if (!extension || !extensionMap[extension] || !allowedTypes.includes(extensionMap[extension])) {
        setFileError(
          `Invalid ${type} file type. Allowed: ${allowedTypes.join(', ')}`
        );
        return false;
      }
    }

    setFileError(null);
    return true;
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file, 'image')) {
        setProfilePicture(file);
        setProfilePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file, 'document')) {
        setDocumentFile(file);
      }
    }
  };

  const submitHandler = (data: EmployeeDTO) => {
    if (fileError) return;
    onSubmit(data, profilePicture || undefined, documentFile || undefined);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Username"
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone Number"
            {...register('phoneNumber')}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="Department"
            {...register('department')}
            error={!!errors.department}
            helperText={errors.department?.message}
          >
            {departments.map((dept) => (
              <MenuItem key={dept.name} value={dept.name}>
                {dept.displayName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Employment"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register('dateOfEmployment')}
            error={!!errors.dateOfEmployment}
            helperText={errors.dateOfEmployment?.message}
          />
        </Grid>

        {/* Profile Picture Upload */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!fileError}>
            <InputLabel shrink>Profile Picture</InputLabel>
            <Box mt={2}>
              <input
                type="file"
                accept="image/jpeg, image/jpg, image/png, image/gif, image/webp"
                onChange={handleProfileChange}
                style={{ display: 'block' }}
              />
              <FormHelperText>
                Optional, max 5MB (JPG, PNG, GIF, WEBP)
              </FormHelperText>
            </Box>
          </FormControl>
          {profilePreview && (
            <Box mt={2}>
              <img
                src={profilePreview}
                alt="Profile Preview"
                style={{ maxWidth: '100%', maxHeight: 200 }}
              />
            </Box>
          )}
        </Grid>

        {/* Document Upload */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!fileError}>
            <InputLabel shrink>Document</InputLabel>
            <Box mt={2}>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleDocumentChange}
                style={{ display: 'block' }}
              />
              <FormHelperText>
                Optional, max 5MB (PDF, DOC, DOCX)
              </FormHelperText>
            </Box>
          </FormControl>
        </Grid>

        {fileError && (
          <Grid item xs={12}>
            <Alert severity="error">{fileError}</Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || !!fileError}
            >
              {initialValues?.id ? 'Update Employee' : 'Create Employee'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default EmployeeForm;