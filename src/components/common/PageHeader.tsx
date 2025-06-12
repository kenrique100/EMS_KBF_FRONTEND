import React from 'react';
import { Box, Typography, Breadcrumbs as MUIBreadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface PageHeaderProps {
  title: string;
  breadcrumbs?: { label: string; path: string }[];
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs = [], action }) => {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Box>
        {breadcrumbs.length > 0 && (
          <MUIBreadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            {breadcrumbs.map((crumb, index) => (
              <Link
                key={index}
                color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
                onClick={() => crumb.path && navigate(crumb.path)}
                underline="hover"
                sx={{ cursor: crumb.path ? 'pointer' : 'default' }}
              >
                {crumb.label}
              </Link>
            ))}
          </MUIBreadcrumbs>
        )}
        <Typography variant="h5" component="h1">
          {title}
        </Typography>
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
};

export default PageHeader;
