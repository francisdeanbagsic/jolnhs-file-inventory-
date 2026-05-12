import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert, 
  InputAdornment, 
  IconButton,
  CircularProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  School 
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, logout, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalError(null);
    
if (!email.trim() || !password.trim()) {
    setLocalError('Please enter both email and password');
    return;
  }

  try {
    await login(email, password);
    
    // Get latest user state
    const currentUser = useAuthStore.getState().user;

    if (currentUser?.role !== 'admin') {
      logout();
      setLocalError('Admin login only. Please use the regular login page.');
      return;
    }

    navigate('/admin');
  } catch (error) {
    console.error('Login error:', error);
    // No need to set error here, you're already showing it from the store
  }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        position: 'relative'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: { xs: 150, sm: 300 },
          height: { xs: 150, sm: 300 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: { xs: 125, sm: 250 },
          height: { xs: 125, sm: 250 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            width: { xs: '95%', sm: 420 },
            maxWidth: '100%',
            backgroundColor: 'background.paper',
            borderRadius: 3,
            border: `1px solid`,
            borderColor: 'divider',
            boxShadow: 3,
            p: { xs: 3, sm: 5 },
            mx: { xs: 1, sm: 0 }
          }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box
                sx={{
                  width: { xs: 60, sm: 80 },
                  height: { xs: 60, sm: 80 },
                  borderRadius: 3,
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: 2
                }}
              >
                <School sx={{ fontSize: { xs: 30, sm: 40 }, color: 'white' }} />
              </Box>
            </motion.div>

            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2.125rem' }
              }}
            >
              Admin Login
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', sm: '0.875rem' }
              }}
            >
              Activity Completion Report
            </Typography>
          </Box>

          {(error || localError) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <Alert severity="error" sx={{ mb: 3 }}>
                {localError || error}
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                mb: { xs: 2, sm: 3 }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
              sx={{
                mb: { xs: 3, sm: 4 }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{
                py: { xs: 1.25, sm: 1.5 },
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 600
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Admin Sign In'}
            </Button>
          </form>

          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              textAlign: 'center',
              mt: { xs: 2, sm: 3 },
              color: 'text.secondary',
              fontSize: { xs: '0.75rem', sm: '0.75rem' }
            }}
          >
            Secure admin access only
          </Typography>
        </Box>
      </motion.div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Box>
  );
}
