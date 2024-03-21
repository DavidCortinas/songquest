import React, { lazy } from 'react';
import Login from './components/auth/Login';
import { Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar';
import { Box } from '@mui/material';
import { BottomContainer } from './components/BottomContainer';
import SpotifyConnect from './components/SpotifyConnect';
import StripeCheckout from './components/checkout/StripeCheckout';
import ProtectedRoute from './ProtectedRoute';
import Pricing from 'components/checkout/Pricing';
import RegistrationSuccess from 'components/auth/RegistrationSuccess';
import ErrorPage from 'components/ErrorPage';

const SongDiscovery = lazy(() => import('./components/SongDiscovery'))

const RoutesContainer = () => {

  return (
      <Box>
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
            <Route 
              path={'/error'}
              element={
                <ErrorPage />
              }
            />
            <Route element={<ProtectedRoute />}>
              <Route 
                path={'/registration-success'} 
                element={<RegistrationSuccess />} 
              />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route 
                path={'/spotify-connect'} 
                element={<SpotifyConnect />} 
              />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route 
                path={'/pricing'} 
                element={<Pricing />} 
              />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route 
                path={'/checkout'} 
                element={<StripeCheckout />} 
              />
            </Route>
          </Routes>
        <BottomContainer />
      </Box>
  );
};

export default RoutesContainer
