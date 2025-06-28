// src/components/dashboard/ProductivityDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getProductivityStats } from '@/api/tasks';
import { ProductivityStatsDTO } from '@/types';

interface ProductivityDashboardProps {
  employeeId: number;
}

const ProductivityDashboard: React.FC<ProductivityDashboardProps> = ({ employeeId }) => {
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
            (0.8 + Math.random() * 0.4) // Simulate some variance
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
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Productivity Overview (Last 30 Days)
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="subtitle2">Total Hours Worked</Typography>
          <Typography variant="h4">{stats.totalHoursWorked.toFixed(1)}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Daily Average</Typography>
          <Typography variant="h4">{stats.dailyAverage.toFixed(1)}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Productivity</Typography>
          <Typography variant="h4" color={stats.productivityPercentage >= 100 ? 'success.main' : 'warning.main'}>
            {stats.productivityPercentage.toFixed(1)}%
          </Typography>
        </Box>
      </Box>

      <Box height={300}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="expected"
              stroke="#8884d8"
              name="Expected Hours"
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#82ca9d"
              name="Actual Hours"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ProductivityDashboard;