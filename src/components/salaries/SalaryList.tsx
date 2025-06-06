import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from '@mui/material';
import { formatDate, formatCurrency } from '@/utils/formatters';

interface Salary {
    id: string;
    employeeId: string;
    amount: number;
    paymentDate: string;
    status: string;
    paymentReference: string;
}

interface SalaryListProps {
    salaries: Salary[];
    onViewDetails: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const SalaryList = ({
                        salaries,
                        onViewDetails,
                        onEdit,
                        onDelete,
                    }: SalaryListProps) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Payment Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Reference</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {salaries.map((salary: Salary) => (
                        <TableRow key={salary.id}>
                            <TableCell>{salary.employeeId}</TableCell>
                            <TableCell>{formatCurrency(salary.amount)}</TableCell>
                            <TableCell>{formatDate(salary.paymentDate)}</TableCell>
                            <TableCell>{salary.status}</TableCell>
                            <TableCell>{salary.paymentReference}</TableCell>
                            <TableCell align="right">
                                <Button
                                    size="small"
                                    onClick={() => onViewDetails(salary.id)}
                                    sx={{ mr: 1 }}
                                >
                                    View
                                </Button>
                                <Button
                                    size="small"
                                    color="secondary"
                                    onClick={() => onEdit(salary.id)}
                                    sx={{ mr: 1 }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => onDelete(salary.id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SalaryList;
