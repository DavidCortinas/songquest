import React, { useEffect } from 'react';
import SongForm from './components/SongForm';
import SongDataTable from './components/SongDataTable';
import Login from './components/Login';
import { searchSongRequest } from './thunks';
import { connect } from 'react-redux';
import { searchSongSuccess } from './actions';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import { SongDetector } from './components/SongDetector';
import SongDiscovery from './components/SongDiscovery';
import { LyricSearch } from './components/LyricSearch';
import TopBar from './components/TopBar';
import { Box, makeStyles } from '@mui/material';
import { BottomContainer } from './components/BottomContainer';
import { SpotifyConnect } from './components/SpotifyConnect';


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
            exact
            path={'/'}
            element={
              <Home 
                onSearchPressed={onSearchPressed}
                onDataLoaded={onDataLoaded}
              />
            }
          />
          {/* <Route
            path={'/discover'}
            element={
              <SongDiscovery
                onSearchPressed={onSearchPressed}
                onDataLoaded={onDataLoaded}
              />
            }
          /> */}
          {/* <Route
            path={'/lyric-search'}
            element={
              <LyricSearch />
            }
          /> */}
          {/* <Route
            path={'/search'}
            element={
              <SongForm
                onSearchPressed={onSearchPressed}
                onDataLoaded={onDataLoaded}
              />
            }
          /> */}
          <Route 
            path={'/login'}
            element={
              <Login />
            }
          />
          <Route 
            path={'/spotify-connect'}
            element={
              <SpotifyConnect />
            }
          />
          {/* <Route
            path={'/songdata'}
            element={
              <SongDataTable
                query={query}
                onSearchPressed={onSearchPressed}
                onDataLoaded={onDataLoaded}
                dataLoaded={dataLoaded}
              />
            }
          /> */}
          {/* <Route
            path={'/song-detector'}
            element={
              <SongDetector />
            }
          /> */}
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
