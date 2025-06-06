import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    action?: ReactNode;
}

const PageHeader = ({ title, action }: PageHeaderProps) => {
    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
                {title}
            </Typography>
            {action && <Box>{action}</Box>}
        </Box>
    );
};

export default PageHeader;
