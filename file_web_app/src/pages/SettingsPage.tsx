import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField,
  Button,
  Avatar,
  Alert,
  Divider,
  IconButton
} from '@mui/material';
import { 
  Person, 
  Lock, 
  Logout,
  Visibility,
  VisibilityOff,
  Save,
  School
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, changePassword, logout } = useAuthStore();
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', mb: 4 }}>
          Manage your account settings and preferences.
        </Typography>
      </motion.div>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 800 }}>
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card sx={{ bgcolor: '#1E293B', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Person sx={{ color: '#3B82F6' }} />
                <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 600 }}>
                  Profile Information
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: '#3B82F6',
                    fontSize: '2rem'
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ color: '#F8FAFC', fontWeight: 600 }}>
                    {user?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B' }}>
                    {user?.email}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#3B82F6',
                      textTransform: 'capitalize',
                      fontWeight: 500
                    }}
                  >
                    {user?.role}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <School sx={{ color: '#64748B', fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Julia Ortiz National High School
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Change Password Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card sx={{ bgcolor: '#1E293B', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Lock sx={{ color: '#F59E0B' }} />
                <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 600 }}>
                  Change Password
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {success}
                </Alert>
              )}

              <form onSubmit={handlePasswordChange}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    type={showPasswords.current ? 'text' : 'password'}
                    label="Current Password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    slotProps={{
                      input: {
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            edge="end"
                          >
                            {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        )
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.5)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&.Mui-focused fieldset': { borderColor: '#F59E0B' }
                      },
                      '& .MuiInputLabel-root': { color: '#94A3B8' },
                      '& .MuiInputBase-input': { color: '#F8FAFC' }
                    }}
                  />

                  <TextField
                    fullWidth
                    type={showPasswords.new ? 'text' : 'password'}
                    label="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    slotProps={{
                      input: {
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            edge="end"
                          >
                            {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        )
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.5)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&.Mui-focused fieldset': { borderColor: '#F59E0B' }
                      },
                      '& .MuiInputLabel-root': { color: '#94A3B8' },
                      '& .MuiInputBase-input': { color: '#F8FAFC' }
                    }}
                  />

                  <TextField
                    fullWidth
                    type={showPasswords.confirm ? 'text' : 'password'}
                    label="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    slotProps={{
                      input: {
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            edge="end"
                          >
                            {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        )
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.5)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&.Mui-focused fieldset': { borderColor: '#F59E0B' }
                      },
                      '& .MuiInputLabel-root': { color: '#94A3B8' },
                      '& .MuiInputBase-input': { color: '#F8FAFC' }
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    sx={{
                      mt: 1,
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)'
                      }
                    }}
                  >
                    {isLoading ? 'Saving...' : 'Update Password'}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card sx={{ bgcolor: '#1E293B', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Logout sx={{ color: '#EF4444' }} />
                <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 600 }}>
                  Sign Out
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
                Sign out of your account on this device.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{
                  borderColor: '#EF4444',
                  color: '#EF4444',
                  '&:hover': {
                    borderColor: '#DC2626',
                    bgcolor: 'rgba(239, 68, 68, 0.1)'
                  }
                }}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
}
