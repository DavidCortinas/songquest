import React, { useEffect, useState } from 'react';
import RoutesContainer from './RoutesContainer';
import './App.css'
import getCSRFToken from './csrf';
import TopBar from './components/TopBar';
import { ThemeProvider } from '@mui/material/styles';
import SideBar from './components/SideBar';
import theme from './theme';
import { LoadingState } from './components/LoadingState';
import { Box, CardHeader, useMediaQuery } from '@mui/material';
import BottomBar from './components/BottomBar';

function App() {
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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
    // You can show a loading state or spinner until the CSRF token is retrieved
    return (
      <>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CardHeader
            title="Loading..."
            titleTypographyProps={{ color: 'black' }}
            subheaderTypographyProps={{ color: '#3d3d3d' }}
          />
        </Box>
        <LoadingState />
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {!isXsScreen && !isSmScreen &&
          <div className='sidebar'>
            <SideBar collapse={collapse} onCollapse={handleCollapse} />
          </div>
        }
        {/* <div className='sidebar'>
          <SideBar collapse={collapse} onCollapse={handleCollapse} />
        </div> */}
        <div className={isXsScreen || isSmScreen
          ? 'content-wrapper-nosidebar'
          : collapse 
          ? "content-wrapper-collapsed" 
          : "content-wrapper"
        }>
          <TopBar collapse={collapse}/>
          <main className="main-content">
            <RoutesContainer />
          </main>
        </div>
        {(isXsScreen || isSmScreen) &&
          <BottomBar />
        }
      </div>
    </ThemeProvider>
  );
}

export default App;