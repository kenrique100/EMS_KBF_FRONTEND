import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSalaries } from '@/api/salaries.ts';
import SalaryList from '../../components/salaries/SalaryList.js';
import PageHeader from '../../components/common/PageHeader.js';
import { Container, Button, Box, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../contexts/AuthContext.js';

const SalariesPage = () => {
    const [salaries, setSalaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showNotification, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const data = await getSalaries();
                setSalaries(data);
            } catch (error) {
                showNotification('Failed to load salaries', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSalaries();
    }, [showNotification]);

    const handleViewDetails = (id) => {
        navigate(`/salaries/${id}`);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <PageHeader
                title="Salary Payments"
                action={
                    isAdmin && (
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/salaries/new')}
                            variant="contained"
                        >
                            Add Salary
                        </Button>
                    )
                }
            />
            <SalaryList
                salaries={salaries}
                onViewDetails={handleViewDetails}
            />
        </Container>
    );
};

export default SalariesPage;