import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => login(data.username, data.password),
    onSuccess: () => {
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      setError(
        error.message.includes('401')
          ? 'Invalid username or password'
          : 'Login failed. Please try again.'
      );
    }
  });

  const onSubmit = (data: LoginFormData) => {
    setError(null);
    mutation.mutate(data);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        mt: 3,
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        '& .MuiTextField-root': {
          mb: 2,
        },
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Username"
        {...register('username')}
        error={!!errors.username}
        helperText={errors.username?.message}
        margin="normal"
        variant="outlined"
        autoComplete="username"
      />
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        margin="normal"
        variant="outlined"
        autoComplete="current-password"
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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mt: 2,
          mb: 2,
          py: 1.5,
          fontSize: '1rem',
        }}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? <CircularProgress size={24} /> : 'Login'}
      </Button>
      <Typography variant="body2" align="center" color="text.secondary">
        Don't have an account?{' '}
        <Link
          href="#"
          underline="hover"
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            // Handle contact admin action
          }}
        >
          Contact admin
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;