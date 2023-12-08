import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#013a57',
    },
    secondary: {
      main: '#007fbf',
    },
    tertiary: {
      main: '#eff3f5',
    },
    secondaryText: {
      main: '#ffffff',
    }
  },
  breakpoints: {
    values: {
      xs: 360,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  
});

export default theme;
