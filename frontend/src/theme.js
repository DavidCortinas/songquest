import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d2dce1',
    },
    secondary: {
      main: '#eff3f5',
    },
    tertiary: {
      main: '#eff3f5',
    },
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
