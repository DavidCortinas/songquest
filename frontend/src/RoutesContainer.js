import React, { lazy } from 'react';
import Login from './components/auth/Login';
import { Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar';
import { Box } from '@mui/material';
import { BottomContainer } from './components/BottomContainer';
import SpotifyConnect from './components/SpotifyConnect';
import StripeCheckout from './components/StripeCheckout';
import ProtectedRoute from './ProtectedRoute';

const SongDiscovery = lazy(() => import('./components/SongDiscovery'))

const RoutesContainer = () => {

  return (
      <Box className='main'>
        <TopBar collapse={true}/>
          <Routes>
            <Route
              path={'/'}
              element={
                <SongDiscovery />
              }
            />
            <Route 
              path={'/login'}
              element={
                <Login />
              }
            />
            <Route element={<ProtectedRoute />}>
              <Route 
                path={'/spotify-connect'} 
                element={<SpotifyConnect />} 
              />
            </Route>
            <Route 
              path={'/checkout'}
              element={
                <StripeCheckout />
              }
            />
          </Routes>
        <BottomContainer />
      </Box>
  );
};

export default RoutesContainer
