import React, { useState, type FormEvent } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Tooltip,
  useMediaQuery,
  useTheme, Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search,
  Notifications,
  Dashboard,
  Folder,
  Upload,
  Schedule,
  People,
  Settings,
  Logout,
  School,
  ChevronLeft,
  Assessment,
  Person
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore.ts';
import { useNotificationStore } from '../store/appStore.ts';
import { CATEGORIES } from '../types';

const DRAWER_WIDTH = 280;

const categoryIcons: Record<string, React.ReactNode> = {
  'feeding/health': <Folder />,
  'drrm': <Folder />,
  'test result': <Folder />,
  'lac/inset': <Folder />,
  'gulayan sa paaralan': <Folder />,
  'aral': <Folder />,
  'literacy report': <Folder />,
  'guidance report': <Folder />,
  'LR report': <Folder />,
  'YES-o': <Folder />,
  'SSLG': <Folder />,
  'BKD': <Folder />,
  'research report': <Folder />,
  'brigada': <Folder />,
  'OITSP': <Folder />,
  'SBM': <Folder />,
  'SGC': <Folder />,
  'Boys/girls scout': <Folder />,
  'LIS/BEIS report': <Folder />,
  'PRAES': <Folder />,
  'STE': <Folder />,
  'sp-ict': <Folder />,
  'sports': <Folder />
};

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notiMenuAnchor, setNotiMenuAnchor] = useState<null | HTMLElement>(null);

  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  const isAdmin = user?.role === 'admin';
  const isAdminPage = location.pathname === '/admin';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useState(() => {
    fetchNotifications();
  });

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    ...(isAdmin && !isAdminPage ? [{ text: 'Admin Panel', icon: <Person />, path: '/admin' }] : []),
    { text: 'Documents', icon: <Folder />, path: '/documents' },
    { text: 'Upload', icon: <Upload />, path: '/upload' },
    { text: 'Reminders', icon: <Schedule />, path: '/reminders' },
    ...(isAdmin ? [{ text: 'Users', icon: <People />, path: '/users' }] : []),
    ...(isAdmin ? [{ text: 'Reports', icon: <Assessment />, path: '/reports' }] : [])
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}
          >
            <School sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary', lineHeight: 1, letterSpacing: '-0.02em', fontSize: '1.1rem' }}>
              JOLNHS
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              File Inventory
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#94A3B8' }}>
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      {/* Main Menu */}
      <List sx={{ px: 1.5, py: 2 }}>
      <List sx={{ px: 1.5, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  backgroundColor: isActive ? 'primary.light' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.light' : 'action.hover',
                    color: isActive ? 'primary.main' : 'text.primary',
                    '& .MuiListItemIcon-root': { color: isActive ? 'primary.main' : 'text.primary' }
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActive ? 'primary.main' : 'text.secondary',
                  minWidth: 38,
                  '& svg': { fontSize: 20 }
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  slotProps={{
                    primary: {
                      sx: { fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }
                    }
                  }}
                />
                {isActive && (
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 8,
                      width: 4,
                      height: 16,
                      borderRadius: 2,
                      backgroundColor: 'primary.main'
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      </List>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mx: 2 }} />

      {/* Categories Section */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 1.5, py: 2 }}>
        <Typography variant="caption" sx={{ color: '#64748B', px: 1, mb: 1, display: 'block' }}>
          CATEGORIES
        </Typography>
        <List dense>
          {CATEGORIES.map((category) => (
            <ListItem key={category} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(`/documents?category=${encodeURIComponent(category)}`);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{ borderRadius: 1, py: 0.75 }}
              >
                <ListItemIcon sx={{ minWidth: 28, fontSize: '1rem' }}>
                  {categoryIcons[category] || '📄'}
                </ListItemIcon>
                <ListItemText
                  primary={category.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  slotProps={{
                    primary: {
                      variant: 'caption',
                      sx: { color: '#94A3B8' }
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* User Info Card in Sidebar */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Avatar sx={{ 
            bgcolor: 'primary.main', 
            width: 36, 
            height: 36,
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 4px 8px rgba(99, 102, 241, 0.2)'
          }}>
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }} noWrap>
              {user?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.02em' }}>
              {user?.role}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      {!isAdminPage && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
            ml: { md: `${DRAWER_WIDTH}px` },
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            backdropFilter: 'blur(8px)',
            background: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          <Toolbar>
            {!isAdminPage && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Search Bar */}
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                flex: 1,
                maxWidth: 500,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              <TextField
                size="small"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    )
                  }
                }}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'action.hover',
                    borderRadius: 2.5,
                    transition: 'all 0.2s ease',
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover': {
                      bgcolor: 'action.selected',
                      '& fieldset': { borderColor: 'divider' }
                    },
                    '&.Mui-focused': {
                      bgcolor: 'background.paper',
                      '& fieldset': { borderColor: 'primary.main' }
                    }
                  },
                  '& .MuiInputBase-input': { 
                    color: 'text.primary',
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }} />

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                sx={{ color: '#94A3B8', mr: 1 }}
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

            {/* User Menu */}
            <IconButton 
              onClick={(e) => setUserMenuAnchor(e.currentTarget)}
              sx={{ 
                p: 0.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                ml: 1
              }}
            >
              <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', fontSize: '0.8rem', fontWeight: 800 }}>
                {user?.name?.charAt(0) || 'U'}
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
                    boxShadow: 'shadow-lg'
                  }
                }
              }}
            >
              <MenuItem onClick={() => { navigate('/profile'); setUserMenuAnchor(null); }}>
                <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                <ListItemText primary="Profile" />
              </MenuItem>
              <MenuItem onClick={() => { navigate('/settings'); setUserMenuAnchor(null); }}>
                <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                <ListItemText primary="Settings" />
              </MenuItem>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><Logout fontSize="small" sx={{ color: '#EF4444' }} /></ListItemIcon>
                <ListItemText primary="Logout" sx={{ color: '#EF4444' }} />
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      {!isAdminPage && (
        <Box
          component="nav"
          sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
        >
          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH
              }
            }}
          >
            {drawer}
          </Drawer>

          {/* Desktop Drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH
              }
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: isAdminPage ? '100%' : { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: isAdminPage ? 0 : '64px',
          minHeight: isAdminPage ? '100vh' : 'calc(100vh - 64px)'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
