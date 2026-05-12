import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  IconButton,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Skeleton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Description, 
  Group, 
  CheckCircle, 
  TrendingUp,
  Notifications,
  Person,
  Settings,
  Logout
} from '@mui/icons-material';
import { dashboardApi } from '../api';
import { CATEGORIES } from '../types';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/appStore';

interface AdminStats {
  totalDocuments: number;
  documentsByCategory: Record<string, number>;
  recentUploads: RecentUpload[];
  totalUsers: number;
  activeUsers: number;
  upcomingReminders: Reminder[];
  thisMonthUploads: number;
}

interface RecentUpload {
  _id: string;
  title: string;
  uploadedBy?: {
    name: string;
  };
}

interface Reminder {
  _id: string;
  title: string;
  dueDate: string;
}

const statCards = [
  { label: 'Total Documents', field: 'totalDocuments', color: 'primary.main', icon: <Description />, bgColor: 'primary.light' },
  { label: 'Total Users', field: 'totalUsers', color: 'success.main', icon: <Group />, bgColor: 'success.light' },
  { label: 'Active Users', field: 'activeUsers', color: 'info.main', icon: <CheckCircle />, bgColor: 'info.light' },
  { label: 'This Month Uploads', field: 'thisMonthUploads', color: 'warning.main', icon: <TrendingUp />, bgColor: 'warning.light' }
] as const;

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notiMenuAnchor, setNotiMenuAnchor] = useState<null | HTMLElement>(null);
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardApi.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    fetchNotifications();
  }, []);



  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%', 
      minHeight: '100vh', 
      bgcolor: 'background.default', 
      p: { xs: 2, sm: 3, md: 4 }, 
      m: 0 
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'center', md: 'flex-start' }, 
        mb: 4, 
        gap: 3,
        textAlign: { xs: 'center', md: 'left' }
      }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%' }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, 
            mb: 1, 
            color: 'text.primary', 
            letterSpacing: '-0.02em',
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}>
            Administrator Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            A clean overview of documents, users, and activity.
          </Typography>
        </motion.div>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          alignItems: 'center', 
          gap: { xs: 2, sm: 2 },
          width: { xs: '100%', md: 'auto' },
          justifyContent: { xs: 'center', md: 'flex-end' }
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            width: { xs: '100%', sm: 'auto' },
            justifyContent: 'center'
          }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/users')}
              sx={{ borderRadius: 2, fontWeight: 600, flex: { xs: 1, sm: 'none' }, whiteSpace: 'nowrap' }}
            >
              Users
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/reports')}
              sx={{ borderRadius: 2, fontWeight: 600, flex: { xs: 1, sm: 'none' }, whiteSpace: 'nowrap' }}
            >
              Reports
            </Button>
            <Button 
              variant="contained" 
              size="small"
              onClick={() => navigate('/documents')}
              sx={{ borderRadius: 2, fontWeight: 600, flex: { xs: 1, sm: 'none' }, whiteSpace: 'nowrap' }}
            >
              Browse
            </Button>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            justifyContent: 'center'
          }}>
          <Tooltip title="Notifications">
            <IconButton 
              sx={{ color: 'text.secondary' }}
              onClick={(e) => setNotiMenuAnchor(e.currentTarget)}
            >
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={notiMenuAnchor}
            open={Boolean(notiMenuAnchor)}
            onClose={() => setNotiMenuAnchor(null)}
            slotProps={{
              paper: {
                sx: {
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  mt: 1,
                  width: 320,
                  maxHeight: 400,
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                }
              }
            }}
          >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Notifications</Typography>
              {unreadCount > 0 && (
                <Button size="small" onClick={markAllAsRead} sx={{ fontSize: '0.7rem' }}>
                  Mark all as read
                </Button>
              )}
            </Box>
            <Divider />
            {notifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">No notifications yet</Typography>
              </Box>
            ) : (
              notifications.map((n) => (
                <MenuItem 
                  key={n._id} 
                  onClick={() => { markAsRead(n._id); setNotiMenuAnchor(null); }}
                  sx={{ 
                    py: 1.5, 
                    borderLeft: n.isRead ? 'none' : '4px solid',
                    borderLeftColor: 'primary.main',
                    bgcolor: n.isRead ? 'transparent' : 'action.hover'
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{n.title}</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary', whiteSpace: 'normal' }}>
                      {n.message}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5, display: 'block' }}>
                      {new Date(n.createdAt).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
          </Menu>

          <IconButton onClick={(e) => setUserMenuAnchor(e.currentTarget)} sx={{ p: 0.5 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontWeight: 700, fontSize: '0.9rem' }}>
              {user?.name?.charAt(0) || 'A'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={() => setUserMenuAnchor(null)}
            slotProps={{
              paper: {
                sx: {
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  mt: 1,
                  minWidth: 180,
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                }
              }
            }}
          >
            <MenuItem onClick={() => { navigate('/dashboard'); setUserMenuAnchor(null); }}>
              <ListItemIcon><TrendingUp fontSize="small" /></ListItemIcon>
              <ListItemText primary="User View" />
            </MenuItem>
            <MenuItem onClick={() => { navigate('/profile'); setUserMenuAnchor(null); }}>
              <ListItemIcon><Person fontSize="small" /></ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>
            <MenuItem onClick={() => { navigate('/settings'); setUserMenuAnchor(null); }}>
              <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><Logout fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
            </MenuItem>
          </Menu>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
          gap: 3,
        }}
      >
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, minHeight: 150 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                  <Box>
                    {isLoading ? (
                      <Skeleton width={60} height={40} />
                    ) : (
                      <Typography variant="h5" sx={{ fontWeight: 800, color: card.color, letterSpacing: '-0.01em' }}>
                        {stats?.[card.field] ?? 0}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                      {card.label}
                    </Typography>
                  </Box>
                  {isLoading ? (
                    <Skeleton variant="circular" width={48} height={48} />
                  ) : (
                    <Avatar sx={{ bgcolor: card.bgColor, width: 48, height: 48, fontSize: 18 }}>
                      {card.icon}
                    </Avatar>
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 3' } }}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.01em' }}>
                    Documents by Category
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Overview of uploads by category.
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={100} sx={{ borderRadius: 2 }} />
                  ))
                ) : (
                  CATEGORIES.map((category, index) => {
                    const colors = ['primary.main', 'secondary.main', 'success.main', 'info.main', 'warning.main'];
                    const color = colors[index % colors.length];
                    return (
                      <Card key={category} sx={{ bgcolor: 'background.paper', borderRadius: 2, minHeight: 100, border: `1px solid`, borderColor: 'divider' }}>
                        <CardContent>
                          <Typography variant="body2" sx={{ color: 'text.secondary', textTransform: 'capitalize', mb: 1, fontWeight: 500 }}>
                            {category.replace(/[-/]/g, ' ')}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color }}>
                            {stats?.documentsByCategory[category] ?? 0}
                          </Typography>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 1' } }}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mb: 2, letterSpacing: '-0.01em' }}>
                Upcoming Reminders
              </Typography>
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={60} sx={{ borderRadius: 2 }} />
                  ))
                ) : (
                  (stats?.upcomingReminders ?? []).slice(0, 5).map((reminder) => (
                    <Box
                      key={reminder._id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'action.hover',
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'secondary.light',
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 700 }}>
                        {reminder.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 600, mt: 0.5 }}>
                        Due: {new Date(reminder.dueDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
              {!isLoading && !stats?.upcomingReminders?.length && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  No upcoming reminders.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 2' } }}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mb: 3, letterSpacing: '-0.01em' }}>
                Recent Uploads
              </Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={80} sx={{ borderRadius: 2 }} />
                  ))
                ) : (
                  (stats?.recentUploads ?? []).slice(0, 5).map((doc) => (
                    <Card key={doc._id} sx={{
                      bgcolor: 'action.hover',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.light',
                        bgcolor: 'background.paper'
                      }
                    }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Avatar sx={{ 
                            bgcolor: 'primary.light', 
                            color: 'primary.main',
                            width: 40,
                            height: 40
                          }}>
                            <Description fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 700 }}>
                              {doc.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                              {doc.uploadedBy?.name || 'Unknown uploader'}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                )}
                {!isLoading && !stats?.recentUploads?.length && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No recent uploads yet.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>


      </Box>
    </Box>
  );
}