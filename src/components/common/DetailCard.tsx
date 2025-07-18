// src/components/employees/DetailCard.tsx
import { Card, CardContent, Typography, Box, Divider, Skeleton } from '@mui/material';
import { ReactNode } from 'react';

interface DetailCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  loading?: boolean;
}

const DetailCard = ({ title, icon, children, loading = false }: DetailCardProps) => {
  return (
    <Card sx={{
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={100} />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default DetailCard;