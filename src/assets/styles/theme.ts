// src/theme.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { blue, orange, grey } from '@mui/material/colors';

const commonSettings = {
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
};

const lightThemeBase = createTheme({
  ...commonSettings,
  palette: {
    mode: 'light',
    primary: {
      main: blue[800],
      light: blue[600],
      dark: blue[900],
      contrastText: '#fff',
    },
    secondary: {
      main: orange[500],
      light: orange[300],
      dark: orange[700],
      contrastText: '#fff',
    },
    background: {
      default: grey[50],
      paper: '#fff',
    },
    text: {
      primary: grey[900],
      secondary: grey[700],
      disabled: grey[500],
    },
  },
});

const darkThemeBase = createTheme({
  ...commonSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: blue[200],
    },
    secondary: {
      main: orange[300],
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: grey[400],
      disabled: grey[600],
    },
  },
});

// Responsive font sizes
export const lightTheme = responsiveFontSizes(lightThemeBase);
export const darkTheme = responsiveFontSizes(darkThemeBase);
