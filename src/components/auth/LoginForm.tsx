import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/useNotification';
import { TextField, Button, Box, Typography, Link } from '@mui/material';

const LoginForm = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(formData.username, formData.password);
            showNotification('Login successful', 'success');
            navigate('/');
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const err = error as { response?: { data?: { message?: string } } };
                showNotification(err.response?.data?.message || 'Login failed', 'error');
            } else {
                showNotification('Login failed', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <Typography variant="body2" align="center">
                Don't have an account?{' '}
                <Link href="#" underline="hover">
                    Contact admin
                </Link>
            </Typography>
        </Box>
    );
};

export default LoginForm;
