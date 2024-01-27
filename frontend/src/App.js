import React, { useEffect, useState } from 'react';
import RoutesContainer from './RoutesContainer';
import './App.css'
import getCSRFToken from './csrf';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { LoadingState } from './components/LoadingState';
import { Box, CardHeader } from '@mui/material';

function App() {
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    // Retrieve the CSRF token
    async function initialize() {
      const token = await getCSRFToken();
      setCsrfToken(token); // Store the CSRF token in state
    }

    initialize();
  }, []);

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
        <div className='content-wrapper-nosidebar'>
            <RoutesContainer />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;