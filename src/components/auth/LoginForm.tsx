// src/components/auth/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login as loginService } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  CircularProgress,
} from '@mui/material';

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
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => loginService(data.username, data.password),
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
      navigate('/');
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        mt: 3,
        '& .MuiTextField-root': {
          mb: 2,
        },
      }}
    >
      <TextField
        fullWidth
        label="Username"
        {...register('username')}
        error={!!errors.username}
        helperText={errors.username?.message}
        margin="normal"
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        margin="normal"
        variant="outlined"
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