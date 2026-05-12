import { createTheme } from '@mui/material/styles';

const sharedTypography = {
  fontFamily: '"Inter", "Outfit", "Roboto", sans-serif',
  h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
  h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
  h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
  h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
  h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
  h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
  button: { textTransform: 'none', fontWeight: 600 },
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1',
      light: '#EEF2FF',
      dark: '#4F46E5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8B5CF6',
      light: '#F5F3FF',
      dark: '#7C3AED',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8FAFC',
      paper: '#ffffff',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
      disabled: '#94A3B8',
    },
    action: {
      hover: '#F1F5F9',
      selected: '#E2E8F0',
    },
    divider: '#E2E8F0',
  },
  typography: sharedTypography,
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 700,
          textTransform: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.3)',
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#F8FAFC',
            transition: 'all 0.2s ease',
            '& fieldset': { borderColor: '#E2E8F0' },
            '&:hover fieldset': { borderColor: '#CBD5E1' },
            '&.Mui-focused fieldset': { borderColor: '#6366F1' },
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#818CF8',
      light: '#312E81',
      dark: '#6366F1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#A78BFA',
      light: '#4C1D95',
      dark: '#8B5CF6',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
    divider: '#334155',
  },
  typography: sharedTypography,
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 700,
          textTransform: 'none',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid #334155',
          backgroundImage: 'none',
        },
      },
    },
  },
});