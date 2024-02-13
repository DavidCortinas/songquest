import React, { lazy, useEffect } from 'react';
import Login from './components/auth/Login';
import { searchSongRequest } from './thunks';
import { connect } from 'react-redux';
import { searchSongSuccess } from './actions';
import { Route, Routes, useNavigate } from 'react-router-dom';
import TopBar from './components/TopBar';
import { Box } from '@mui/material';
import { BottomContainer } from './components/BottomContainer';
import SpotifyConnect from './components/SpotifyConnect';
import StripeCheckout from './components/StripeCheckout';
import ProtectedRoute from './ProtectedRoute';
import Playlist from './components/Playlist';

const SongDiscovery = lazy(() => import('./components/SongDiscovery'))

const RoutesContainer = ({
  query,
  dataLoaded,
  error,
  onSearchPressed,
  onDataLoaded,
}) => {
  const navigate = useNavigate();

    const getDataTableRoutePath = (query) => {
      const { song, performer } = query;
      let path = '/songdata';

      const searchParams = new URLSearchParams();
      if (song) {
        searchParams.set('song', song);
      }
      if (performer) {
        searchParams.set('performer', performer);
      }

      const search = searchParams.toString();
      if (search) {
        path += `?${search}`;
      }

      return path;
    };

  useEffect(() => {
    if (dataLoaded && !error) {
      navigate(getDataTableRoutePath(query)); // Navigate to SongDataTable route programmatically
    }
  }, [dataLoaded, error, query, navigate]);

  return (
      <Box className='main'>
        <TopBar collapse={true}/>
        <Routes>
          <Route
            path={'/'}
            element={
              <SongDiscovery
                onSearchPressed={onSearchPressed}
                onDataLoaded={onDataLoaded}
              />
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
            {/* <Route 
              path={'/playlist/:id'} 
              element={<Playlist />} 
            /> */}
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

const mapStateToProps = (state) => {
  return {
    query: state.song?.query || {},
    dataLoaded: state.song?.dataLoaded || false,
    error: state.song?.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSearchPressed: (query) => {
      dispatch(searchSongRequest(query));
    },
    onDataLoaded: (songData, query) => {
      dispatch(searchSongSuccess(songData, query));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RoutesContainer);
