import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Grid,
  TextField,
  MenuItem,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { EmployeeDTO } from '@/types';
import { employeeSchema } from '@/validations/employeeValidation';
import { departmentOptions } from '@/utils/departmentUtils';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface EmployeeFormProps {
  initialValues?: EmployeeDTO;
  onSubmit: (data: EmployeeDTO) => Promise<void>;
  isSubmitting: boolean;
  title?: string;
}

// FIX: Use motion.create instead of motion()
const MotionGrid = motion.create(Grid);
const MotionCard = motion.create(Card);

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting,
  title = initialValues?.id ? 'Edit Employee' : 'Create Employee',
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EmployeeDTO>({
    resolver: yupResolver(employeeSchema),
    defaultValues: initialValues || {
      username: '',
      name: '',
      gender: 'MALE',
      dateOfBirth: '',
      email: '',
      phoneNumber: '',
      nationalId: '',
      department: 'ADMINISTRATION',
      dateOfEmployment: '',
      password: '',
    },
  });

  // Watch password to show strength indicator
  const passwordValue = watch('password');

  useEffect(() => {
    if (initialValues) {
      // Format dates for display (YYYY-MM-DD)
      const formattedValues = {
        ...initialValues,
        dateOfBirth: initialValues.dateOfBirth ? initialValues.dateOfBirth.split('T')[0] : '',
        dateOfEmployment: initialValues.dateOfEmployment
          ? initialValues.dateOfEmployment.split('T')[0]
          : '',
      };
      reset(formattedValues);
    }
  }, [initialValues, reset]);

  const submitHandler = async (data: EmployeeDTO) => {
    // Format dates to ensure they're in YYYY-MM-DD format
    const formattedData = {
      ...data,
      dateOfBirth: formatDate(data.dateOfBirth),
      dateOfEmployment: formatDate(data.dateOfEmployment),
    };

    console.log('Formatted data for submission:', formattedData);

    try {
      await onSubmit(formattedData);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';

    // If already in YYYY-MM-DD format, return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '' };

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[@#$%^&+=!]/.test(password)) strength += 10;

    let label = '';
    if (strength < 50) label = 'Weak';
    else if (strength < 75) label = 'Fair';
    else if (strength < 90) label = 'Good';
    else label = 'Strong';

    return { strength, label };
  };

  const passwordStrength = getPasswordStrength(passwordValue || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Card
        elevation={3}
        sx={{
          mt: 4,
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          boxShadow: theme.shadows[4],
        }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {title}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit(submitHandler)} noValidate>
            <Grid container spacing={3}>
              <MotionGrid item xs={12} md={6} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <TextField
                  fullWidth
                  label="Username *"
                  {...register('username')}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  required
                />
              </MotionGrid>

              <MotionGrid
                item
                xs={12}
                md={6}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                <TextField
                  fullWidth
                  label="Full Name *"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  required
                />
              </MotionGrid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number *"
                  {...register('phoneNumber')}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="National ID *"
                  {...register('nationalId')}
                  error={!!errors.nationalId}
                  helperText={errors.nationalId?.message}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Gender *"
                  {...register('gender')}
                  error={!!errors.gender}
                  helperText={errors.gender?.message}
                  required
                >
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date of Birth *"
                  InputLabelProps={{ shrink: true }}
                  {...register('dateOfBirth')}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth?.message}
                  required
                  inputProps={{
                    max: new Date().toISOString().split('T')[0],
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date of Employment *"
                  InputLabelProps={{ shrink: true }}
                  {...register('dateOfEmployment')}
                  error={!!errors.dateOfEmployment}
                  helperText={errors.dateOfEmployment?.message}
                  required
                  inputProps={{
                    max: new Date().toISOString().split('T')[0],
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Department *"
                  {...register('department')}
                  error={!!errors.department}
                  helperText={errors.department?.message}
                  required
                >
                  {departmentOptions.map((dept) => (
                    <MenuItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {!initialValues?.id && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Password *"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      error={!!errors.password}
                      helperText={
                        errors.password?.message ||
                        `Strength: ${passwordStrength.label} (${passwordStrength.strength}%)`
                      }
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Password strength indicator */}
                  {passwordValue && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          width: '100%',
                          height: 8,
                          bgcolor: 'grey.200',
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${passwordStrength.strength}%`,
                            height: '100%',
                            bgcolor:
                              passwordStrength.strength < 50
                                ? 'error.main'
                                : passwordStrength.strength < 75
                                  ? 'warning.main'
                                  : passwordStrength.strength < 90
                                    ? 'info.main'
                                    : 'success.main',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </Box>
                    </Grid>
                  )}
                </>
              )}

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/employees')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    sx={{ minWidth: 180, py: 1.2, fontWeight: 600 }}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={20} color="inherit" />
                        <Box ml={1}>Processing...</Box>
                      </>
                    ) : initialValues?.id ? (
                      'Update Employee'
                    ) : (
                      'Create Employee'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmployeeForm;
