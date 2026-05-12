import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton
} from '@mui/material';
import { 
  Assessment, 
  Description,
  People,
  TrendingUp
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { dashboardApi } from '../api';

const categoryColors: Record<string, string> = {
  'feeding/health': '#10B981',
  'drrm': '#F59E0B',
  'test result': '#3B82F6',
  'lac/inset': '#8B5CF6',
  'gulayan sa paaralan': '#22C55E',
  'aral': '#06B6D4',
  'literacy report': '#EC4899',
  'guidance report': '#F97316',
  'LR report': '#6366F1',
  'YES-o': '#14B8A6',
  'SSLG': '#A855F7',
  'BKD': '#EAB308',
  'research report': '#0EA5E9',
  'brigada': '#F43F5E',
  'OITSP': '#84CC16',
  'SBM': '#64748B',
  'SGC': '#D946EF',
  'Boys/girls scout': '#F59E0B',
  'LIS/BEIS report': '#0D9488',
  'PRAES': '#7C3AED',
  'STE': '#2563EB',
  'sp-ict': '#06B6D4',
  'sports': '#EF4444'
};

interface SummaryData {
  documentsPerUser: Array<{
    userName: string;
    userEmail: string;
    userRole: string;
    count: number;
  }>;
  categoryDistribution: Array<{
    _id: string;
    count: number;
  }>;
  monthlyTrend: Array<{
    _id: { year: number; month: number };
    count: number;
  }>;
}

export default function ReportsPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        const response = await dashboardApi.getSummary();
        setSummary(response.data);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);






  const totalDocuments = summary?.categoryDistribution.reduce((sum, cat) => sum + cat.count, 0) || 0;

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.02em' }}>
          Reports & Analytics
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Comprehensive summary of document uploads and system activity.
        </Typography>
      </motion.div>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[0, 1, 2, 3].map((i) => {
          const icons = [<Description />, <Assessment />, <People />, <TrendingUp />];
          const gradients = [
            'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
            'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
          ];
          const labels = ['Total Documents', 'Active Categories', 'Active Users', 'This Month'];
          const counts = [
            totalDocuments,
            summary?.categoryDistribution.length || 0,
            summary?.documentsPerUser.length || 0,
            summary?.monthlyTrend.slice(-1)[0]?.count || 0
          ];

          return (
            <Grid key={i} size={{ xs: 12, sm: 6, lg: 3 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: gradients[i],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {React.cloneElement(icons[i] as any, { sx: { color: 'white' } })}
                      </Box>
                      <Box>
                        {isLoading ? (
                          <Skeleton width={60} height={40} />
                        ) : (
                          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
                            {counts[i]}
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {labels[i]}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      {/* Category Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800, mb: 3, letterSpacing: '-0.01em' }}>
              Documents by Category
            </Typography>
            <Grid container spacing={2}>
              {isLoading ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <Grid key={i} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                    <Skeleton variant="rounded" height={80} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))
              ) : (
                summary?.categoryDistribution.map((cat) => (
                  <Grid key={cat._id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'action.hover',
                        border: '1px solid',
                        borderColor: 'divider',
                        textAlign: 'center'
                      }}
                    >
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700, 
                          color: categoryColors[cat._id] || '#3B82F6' 
                        }}
                      >
                        {cat.count}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {cat._id.split(' ')[0]}
                      </Typography>
                    </Box>
                  </Grid>
                ))
              )}
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Documents per User */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800, mb: 3, letterSpacing: '-0.01em' }}>
              Documents per User
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>User</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Documents</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton width={150} /></TableCell>
                        <TableCell><Skeleton width={80} /></TableCell>
                        <TableCell><Skeleton width={40} /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    summary?.documentsPerUser.map((user) => (
                      <TableRow key={user.userEmail}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                              {user.userName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {user.userEmail}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.userRole}
                            size="small"
                            sx={{ 
                              bgcolor: 'primary.light',
                              color: 'primary.main',
                              fontWeight: 600,
                              textTransform: 'capitalize'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>
                          {user.count}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
