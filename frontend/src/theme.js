import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c8bd8',
      complementary: '#d8792c',
      analogous1: '#2cd8cf',
      analogous2: '#2c35d8',
      triadic1: '#792cd8',
      triadic2: '#d82c8b',
      white: 'white',
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
