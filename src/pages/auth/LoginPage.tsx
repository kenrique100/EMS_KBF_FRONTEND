import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import LoginForm from '../../components/auth/LoginForm.js';
import { Box, Typography, Paper } from '@mui/material';

const LoginPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Employee Management System
                </Typography>
                <Typography variant="subtitle1">
                    Please sign in to continue
                </Typography>
            </Box>
            <LoginForm />
        </Paper>
    );
};

export default LoginPage;