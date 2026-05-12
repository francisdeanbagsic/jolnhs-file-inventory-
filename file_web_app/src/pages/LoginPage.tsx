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

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      const currentUser = useAuthStore.getState().user;
      navigate(currentUser?.role === 'admin' ? '/admin' : '/dashboard');
    } catch {
      // Error is handled in store
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 300,
          height: 300,
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
          width: 250,
          height: 250,
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
            width: { xs: '90%', sm: 420 },
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            p: 5
          }}
        >
          {/* Logo and Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1E3A5F 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)'
                }}
              >
                <School sx={{ fontSize: 40, color: 'white' }} />
              </Box>
            </motion.div>
            
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: '#F8FAFC',
                mb: 1
              }}
            >
              JONHS Documents
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#94A3B8'
              }}
            >
              Julia Ortiz National High School
            </Typography>
          </Box>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
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
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#3B82F6' }
                },
                '& .MuiInputLabel-root': { color: '#94A3B8' },
                '& .MuiInputBase-input': { color: '#F8FAFC' }
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
                        sx={{ color: '#94A3B8' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#3B82F6' }
                },
                '& .MuiInputLabel-root': { color: '#94A3B8' },
                '& .MuiInputBase-input': { color: '#F8FAFC' }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #3B82F6 0%, #1E3A5F 100%)',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563EB 0%, #1E3A5F 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.5)'
                },
                '&:disabled': {
                  background: 'rgba(59, 130, 246, 0.5)'
                }
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              textAlign: 'center',
              mt: 3,
              color: '#64748B'
            }}
          >
            Secure Login for Faculty & Staff
          </Typography>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/admin-login')}
            sx={{
              mt: 2,
              color: '#3B82F6',
              textTransform: 'none'
            }}
          >
            Go to Admin Login
          </Button>
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
