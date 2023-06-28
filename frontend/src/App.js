import React, { useEffect, useState } from 'react';
import RoutesContainer from './RoutesContainer';
import './App.css'
import getCSRFToken from './csrf';
import TopBar from './components/TopBar';
import { ThemeProvider } from '@mui/material/styles';
import SideBar from './components/SideBar';
import theme from './theme';
import { LoadingState } from './components/LoadingState';
import { useMediaQuery } from '@mui/material';
import BottomBar from './components/BottomBar';

function App() {
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

  const [csrfToken, setCsrfToken] = useState(null);
  const [collapse, setCollapse] = useState(true);

  useEffect(() => {
    // Retrieve the CSRF token
    async function initialize() {
      const token = await getCSRFToken();
      setCsrfToken(token); // Store the CSRF token in state
    }

    initialize();
  }, []);

  const handleCollapse = () => {
    setCollapse((collapsed) => !collapsed)
  }

  if (csrfToken === null) {
    console.log('LOADING')
    // You can show a loading state or spinner until the CSRF token is retrieved
    return <LoadingState />;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <NavBar />
        <Grid container style={{ backgroundColor: '#eff3f5' }}>
          <Grid item xs={2}>
            <SideBar collapse={collapse} onCollapse={handleCollapse}/>
          </Grid>
          <Grid item xs={collapse ? 8 :10} position={'center'}>
              <RoutesContainer />
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default App;