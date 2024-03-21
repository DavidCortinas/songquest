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
      whitesmoke: 'whitesmoke',
      dark: '#30313d',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 800,
      lg: 1024,
      xl: 1280,
    },
  },
});

export default theme;
