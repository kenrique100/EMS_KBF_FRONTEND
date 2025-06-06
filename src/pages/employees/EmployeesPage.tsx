import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../../components/common/PageHeader.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.js';
import useAuth from "@/hooks/useAuth.ts";
import {getEmployees} from "@/api/employees.ts";

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await getEmployees();
                setEmployees(data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleViewDetails = (id) => {
        navigate(`/employees/${id}`);
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <Container maxWidth="lg">
            <PageHeader
                title="Employees"
                action={
                    isAdmin && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/employees/new')}
                        >
                            Add Employee
                        </Button>
                    )
                }
            />
            <Paper sx={{ mt: 3 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Date of Employment</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.length > 0 ? (
                                employees.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell>{employee.name}</TableCell>
                                        <TableCell>{employee.username}</TableCell>
                                        <TableCell>
                                            {new Date(employee.dateOfEmployment).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{employee.status}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleViewDetails(employee.id)}
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body1">No employees found</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default EmployeesPage;