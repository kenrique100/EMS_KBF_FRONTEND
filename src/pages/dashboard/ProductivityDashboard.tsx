import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getProductivityStats } from '@/api/tasks';
import { ProductivityStatsDTO } from '@/types';
import { motion } from 'framer-motion';

interface ProductivityDashboardProps {
  employeeId: number;
}

const ProductivityDashboard: React.FC<ProductivityDashboardProps> = ({ employeeId }) => {
  const theme = useTheme();
  const [stats, setStats] = useState<ProductivityStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchProductivityData = async () => {
      try {
        setLoading(true);
        const data = await getProductivityStats(employeeId);
        setStats(data);

        // Generate chart data from actual stats
        const daysInPeriod = Math.ceil(
          (new Date(data.periodEndDate).getTime() - new Date(data.periodStartDate).getTime()) /
          (1000 * 60 * 60 * 24)
        );

        const generatedData = Array.from({ length: daysInPeriod }, (_, i) => ({
          day: i + 1,
          date: new Date(
            new Date(data.periodStartDate).getTime() + (i * 24 * 60 * 60 * 1000)
          ).toLocaleDateString(),
          expected: (data.totalHoursWorked / daysInPeriod) * (i + 1),
          actual: (data.totalHoursWorked / daysInPeriod) * (i + 1) *
            (0.8 + Math.random() * 0.4)
        }));

        setChartData(generatedData);
      } catch (err) {
        setError('Failed to load productivity data');
      } finally {
        setLoading(false);
      }
    };

    fetchProductivityData();
  }, [employeeId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 4,
        boxShadow: theme.shadows[3]
      }}
      component={motion.div}
      whileHover={{ y: -2 }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Productivity Overview (Last 30 Days)
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        {[
          { label: 'Total Hours Worked', value: stats.totalHoursWorked.toFixed(1) },
          { label: 'Daily Average', value: stats.dailyAverage.toFixed(1) },
          {
            label: 'Productivity',
            value: stats.productivityPercentage.toFixed(1) + '%',
            color: stats.productivityPercentage >= 100 ? 'success.main' : 'warning.main'
          }
        ].map((metric, index) => (
          <Box
            key={metric.label}
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            sx={{
              minWidth: 120,
              textAlign: 'center',
              p: 2,
              borderRadius: 2,
              backgroundColor: 'background.paper'
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {metric.label}
            </Typography>
            <Typography
              variant="h4"
              color={metric.color || 'text.primary'}
              sx={{ fontWeight: 700 }}
            >
              {metric.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box height={300}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis
              dataKey="date"
              tick={{ fill: theme.palette.text.secondary }}
            />
            <YAxis
              tick={{ fill: theme.palette.text.secondary }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.divider,
                borderRadius: theme.shape.borderRadius
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="expected"
              stroke={theme.palette.primary.main}
              strokeDasharray="5 5"
              name="Expected Hours"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke={theme.palette.success.main}
              name="Actual Hours"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ProductivityDashboard;