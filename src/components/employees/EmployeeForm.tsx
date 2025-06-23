import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Grid,
  TextField,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  FormHelperText,
  Alert,
  Avatar,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
} from '@mui/material';
import { EmployeeDTO } from '@/types';
import { employeeSchema } from '@/validations/employeeValidation';
import { departments } from '@/utils/departmentUtils';
import { validateFile, getFileUrl } from '@/utils/fileUtils';

interface EmployeeFormProps {
  initialValues?: EmployeeDTO;
  onSubmit: (data: EmployeeDTO, profilePicture?: File, document?: File) => Promise<void>;
  isSubmitting: boolean;
  title?: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
                                                     initialValues,
                                                     onSubmit,
                                                     isSubmitting,
                                                     title = initialValues?.id ? 'Edit Employee' : 'Create Employee',
                                                   }) => {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      try {
        validateFile(file, 'image');
        setProfilePicture(file);
        setProfilePreview(URL.createObjectURL(file));
        setFileError(null);
      } catch (error) {
        setFileError(error instanceof Error ? error.message : 'Invalid image file');
      }
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      try {
        validateFile(file, 'document');
        setDocumentFile(file);
        setFileError(null);
      } catch (error) {
        setFileError(error instanceof Error ? error.message : 'Invalid document file');
      }
    }
  };

  const submitHandler = async (data: EmployeeDTO) => {
    if (fileError) return;
    try {
      await onSubmit(data, profilePicture || undefined, documentFile || undefined);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <Card sx={{ mt: 3, p: { xs: 2, md: 3 } }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit(submitHandler)} noValidate>
          <Grid container spacing={3}>
            {/* Row 1: Username + Full Name */}
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

            {/* Row 2: Email + Phone */}
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

            {/* Row 3: Department + Employment Date */}
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
                type="date"
                label="Date of Employment"
                InputLabelProps={{ shrink: true }}
                {...register('dateOfEmployment')}
                error={!!errors.dateOfEmployment}
                helperText={errors.dateOfEmployment?.message}
              />
            </Grid>

            {/* Row 4: Password (Only on Create) */}
            {!initialValues?.id && (
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
            )}

            {/* Row 5: File Uploads */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!fileError}>
                <InputLabel shrink>Profile Picture</InputLabel>
                <Box mt={1}>
                  <input
                    accept="image/*"
                    type="file"
                    onChange={handleProfileChange}
                    style={{ display: 'block' }}
                  />
                  <FormHelperText>JPEG, PNG, GIF (Max 5MB)</FormHelperText>
                </Box>
              </FormControl>
              {profilePreview && (
                <Box mt={2} display="flex" justifyContent="center">
                  <Avatar src={profilePreview} sx={{ width: 100, height: 100 }} />
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!fileError}>
                <InputLabel shrink>Document</InputLabel>
                <Box mt={1}>
                  <input
                    accept=".pdf,.doc,.docx"
                    type="file"
                    onChange={handleDocumentChange}
                    style={{ display: 'block' }}
                  />
                  <FormHelperText>PDF, DOC, DOCX (Max 5MB)</FormHelperText>
                </Box>
              </FormControl>
            </Grid>

            {fileError && (
              <Grid item xs={12}>
                <Alert severity="error">{fileError}</Alert>
              </Grid>
            )}

            {/* Submit */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  sx={{ minWidth: 160 }}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={20} color="inherit" />
                      <Box ml={1}>Processing...</Box>
                    </>
                  ) : initialValues?.id ? 'Update Employee' : 'Create Employee'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;
