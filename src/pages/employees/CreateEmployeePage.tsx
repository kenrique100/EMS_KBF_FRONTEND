import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/hooks/useNotification';
import { createEmployee } from '@/api/employees.ts';
import EmployeeForm from '../../components/employees/EmployeeForm.js';
import PageHeader from '../../components/common/PageHeader.js';
import { Container } from '@mui/material';

const CreateEmployeePage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const handleSubmit = async (employeeData) => {
        setIsSubmitting(true);
        try {
            await createEmployee(
                employeeData,
                employeeData.profilePicture,
                employeeData.document
            );
            showNotification('Employee created successfully', 'success');
            navigate('/employees');
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <PageHeader title="Create New Employee" />
            <EmployeeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </Container>
    );
};

export default CreateEmployeePage;