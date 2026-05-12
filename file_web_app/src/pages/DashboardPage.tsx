import React, { useEffect, cloneElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,

  IconButton,
  Button,
  Tooltip,
  Skeleton,
  Avatar
} from '@mui/material';
import {
  Description,
  Upload,
  Schedule,
  People,
  TrendingUp,

  Add,
  CalendarToday,

} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useDashboardStore, useDocumentStore, useReminderStore } from '../store/appStore';
import { CATEGORIES, type Document, type Reminder as ReminderType } from '../types';

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

const categoryIcons: Record<string, React.ReactNode> = {
  'feeding/health': <Description />,
  'drrm': <Description />,
  'test result': <Description />,
  'lac/inset': <Description />,
  'gulayan sa paaralan': <Description />,
  'aral': <Description />,
  'literacy report': <Description />,
  'guidance report': <Description />,
  'LR report': <Description />,
  'YES-o': <Description />,
  'SSLG': <Description />,
  'BKD': <Description />,
  'research report': <Description />,
  'brigada': <Description />,
  'OITSP': <Description />,
  'SBM': <Description />,
  'SGC': <Description />,
  'Boys/girls scout': <Description />,
  'LIS/BEIS report': <Description />,
  'PRAES': <Description />,
  'STE': <Description />,
  'sp-ict': <Description />,
  'sports': <Description />,
};



function StatCard({ title, value, icon, color, delay }: { title: string; value: string | number; icon: React.ReactNode; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          height: '100%',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: 'primary.light',
            boxShadow: theme => `0 12px 24px -10px ${color}40`
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                {title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
                {value}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
                border: '1px solid',
                borderColor: `${color}20`
              }}
            >
              {cloneElement(icon as React.ReactElement<any>, { sx: { fontSize: 20 } })}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RecentUploadCard({ doc, delay }: { doc: Document; delay: number }) {
  // const _navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'action.hover',
            borderColor: 'primary.light',
            transform: 'translateX(4px)'
          }
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: 'primary.light',
                color: 'primary.main'
              }}
            >
              <Description fontSize="small" />
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {doc.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                  {doc.category}
                </Typography>
                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'divider' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatSize(doc.fileSize)}
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 500 }}>
              {formatDate(doc.createdAt)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ReminderCard({ reminder, delay }: { reminder: ReminderType; delay: number }) {
  const { completeReminder, snoozeReminder } = useReminderStore();
  const isOverdue = new Date(reminder.dueDate) < new Date();

  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'action.hover',
          border: '1px solid',
          borderColor: 'divider',
          mb: 1.5,
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: isOverdue ? 'error.light' : 'secondary.light',
            transform: 'translateX(4px)'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {reminder.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <CalendarToday sx={{ fontSize: 14, color: isOverdue ? 'error.main' : 'secondary.main' }} />
              <Typography variant="caption" sx={{ color: isOverdue ? 'error.main' : 'secondary.main', fontWeight: 600 }}>
                {formatDueDate(reminder.dueDate)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Snooze">
              <IconButton
                size="small"
                onClick={() => snoozeReminder(reminder._id, 1)}
                sx={{ color: 'warning.main' }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Complete">
              <IconButton
                size="small"
                onClick={() => completeReminder(reminder._id)}
                sx={{ color: 'success.main' }}
              >
                <TrendingUp fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

function CategoryTile({ category, count, delay }: { category: string; count: number; delay: number }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card
        onClick={() => navigate(`/documents?category=${encodeURIComponent(category)}`)}
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          height: '100%',
          '&:hover': {
            bgcolor: 'action.hover',
            borderColor: 'primary.main',
            transform: 'translateY(-4px)',
            boxShadow: theme => `0 10px 20px -5px ${theme.palette.primary.main}20`
          }
        }}
      >
        <CardContent sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Box sx={{
            mb: 1.5,
            color: 'primary.main',
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {cloneElement((categoryIcons[category] || <Description />) as React.ReactElement<any>, { sx: { fontSize: 20 } })}
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: 'text.primary',
              fontWeight: 800,
              fontSize: '0.7rem',
              lineHeight: 1.2,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              mb: 0.5
            }}
          >
            {category.replace(/[-/]/g, ' ')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {count} Files
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { stats, isLoading, fetchStats } = useDashboardStore();
  const { recentUploads, fetchRecentUploads } = useDocumentStore();
  const { upcomingReminders, fetchReminders } = useReminderStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchRecentUploads(5);
    fetchReminders(false);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.02em' }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B' }}>
            Here's what's happening with your documents today.
          </Typography>
        </motion.div>
      </Box>

      {/* Stats Grid - Bento Style */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Documents"
            value={stats?.totalDocuments || 0}
            icon={<Description />}
            color="#3B82F6"
            delay={0}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="This Month"
            value={stats?.thisMonthUploads || 0}
            icon={<Upload />}
            color="#10B981"
            delay={0.1}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Upcoming Reminders"
            value={stats?.upcomingReminders?.length || 0}
            icon={<Schedule />}
            color="#F59E0B"
            delay={0.2}
          />
        </Grid>
        {isAdmin && (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Active Users"
              value={stats?.activeUsers || 0}
              icon={<People />}
              color="#8B5CF6"
              delay={0.3}
            />
          </Grid>
        )}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Uploads */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Recent Uploads
              </Typography>
              <Button
                size="small"
                onClick={() => navigate('/documents')}
                sx={{ color: 'primary.main', fontWeight: 700 }}
              >
                View All
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={64} sx={{ borderRadius: 2 }} />
                ))
              ) : recentUploads.length > 0 ? (
                recentUploads.map((doc, index) => (
                  <RecentUploadCard key={doc._id} doc={doc} delay={0.4 + index * 0.05} />
                ))
              ) : (
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    bgcolor: '#1E293B',
                    borderRadius: 2,
                    border: '1px dashed rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Upload sx={{ fontSize: 48, color: '#64748B', mb: 2 }} />
                  <Typography variant="body1" sx={{ color: '#64748B' }}>
                    No documents uploaded yet
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/upload')}
                    sx={{ mt: 2, borderRadius: 2 }}
                  >
                    Upload First Document
                  </Button>
                </Box>
              )}
            </Box>
          </motion.div>
        </Grid>

        {/* Reminders */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Upcoming Reminders
              </Typography>
              <Button
                size="small"
                onClick={() => navigate('/reminders')}
                sx={{ color: 'secondary.main', fontWeight: 700 }}
              >
                View All
              </Button>
            </Box>
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                minHeight: 200
              }}
            >
              {upcomingReminders.length > 0 ? (
                upcomingReminders.slice(0, 4).map((reminder, index) => (
                  <ReminderCard key={reminder._id} reminder={reminder} delay={0.5 + index * 0.05} />
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Schedule sx={{ fontSize: 48, color: '#64748B', mb: 2 }} />
                  <Typography variant="body2" sx={{ color: '#64748B' }}>
                    No upcoming reminders
                  </Typography>
                </Box>
              )}
            </Box>
          </motion.div>
        </Grid>

        {/* Categories Grid */}
        <Grid size={{ xs: 12 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Quick Access by Category
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {CATEGORIES.map((category, index) => (
                <Grid key={category} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                  <CategoryTile
                    category={category}
                    count={stats?.documentsByCategory?.[category] || 0}
                    delay={0.6 + index * 0.02}
                  />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
