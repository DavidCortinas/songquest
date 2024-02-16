import React, { Suspense, lazy, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  CardHeader,
  Typography,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { makeStyles, useTheme } from '@mui/styles';
import { 
  addToCurrentPlaylist, 
  confirmSpotifyAccess,  
  removeFromCurrentPlaylistById,
  saveQuery, 
} from '../actions';
import '../App.css';
import theme from '../theme'
import { LoadingState } from './LoadingState';
import { useLocation } from 'react-router-dom';
import { Body } from './Body';
import LeftPanel from './sidePanels/LeftPanel';
import RightPanel from './sidePanels/RightPanel';
import getCSRFToken from '../csrf';
import { initialDiscoveryState } from 'reducers';

const Recommendations = lazy(() => import('./Recommendations'))
const SpotifyForm = lazy(() => import('./spotifyForm/SpotifyForm'))
const SaveQueryModal = lazy(() => import('./SaveQueryModal'))

const useStyles = makeStyles(() => (
  {
    root: {
      padding: '15px 0 5px',
    },
    expanded: {
      '&.Mui-expanded': {
        margin: 0,
      },
    },
    card: {
    backgroundColor: "white",
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
    marginTop: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    color: "#007fbf",
    width: '90%',
    border: '2px solid rgba(89, 149, 192, 0.5)',
    borderRadius: '18px',
    background: 'rgba(48, 130, 164, 0.1)',
    boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
    backdropFilter: 'blur(5.1px)',
    WebkitBackdropFilter: 'blur(5.1px)',
    padding: '0 2%',
  },
  sidePanel: {
    marginTop: '10px',
    maxHeight: '1800px', 
    width: '20%',
    color: 'white',
    border: '2px solid rgba(89, 149, 192, 0.5)',
    borderRadius: '18px',
    background: 'rgba(48, 130, 164, 0.1)',
    boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
    backdropFilter: 'blur(5.1px)',
    WebkitBackdropFilter: 'blur(5.1px)',
    overflowY: 'auto',
  },
  textField: {
    marginLeft: '8px',
    width: '66%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    backgroundColor: '#30313d',
    borderRadius: '8px',
    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
  },
  resultsField: {
    width: '15%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    backgroundColor: '#30313d',
    borderRadius: '8px',
    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
  },
  primaryField: {
    width: '50%',
    backgroundColor: '#30313d',
    borderRadius: '8px',
    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
    margin: '0 10px 0 0',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      paddingRight: '0',
      margin: '0 0 1em'
    },
  },
  secondaryField: {
    width: '66%',
    [theme.breakpoints.down('sm')]: {
      width: '40%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '50%',
    },
    backgroundColor: '#30313d',
    borderRadius: '8px',
    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
  },
  menuList: {
    '& li': {
      color: 'black',
    },
  },
  subHeader: {
    width: '40%',
    [theme.breakpoints.up('sm')]: {
      width: '25rem',
    },
  },
  description: {
    maxWidth: theme.breakpoints.up('xl') ? '65rem' : '50rem',
    color: '#6f6f71',
    paddingTop: '1rem',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '2%',
  },
  noBottomLine: {
    borderBottom: 'none',
  },
  recommendations: {
    display: 'flex',
    alignItems: 'start',
    listStyle: 'none',
  },
  seedButtons: {
    width: '25%',
    color: 'white', 
    backgroundColor: 'transparent', 
    border: '2px solid rgba(89, 149, 192, 0.5)',
    borderRadius: '8px' ,
    boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
    '&:hover, &:active, &.MuiFocusVisible': {
      border: '2px solid rgba(89, 149, 192, 0.5)',
      background: 'rgba(48, 130, 164, 0.1)',
      boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
      backdropFilter: 'blur(5.1px)',
      WebkitBackdropFilter: 'blur(5.1px)',
    },
  },
  recommendationsUl: {
    width: '100%'
  },
  resetBtn: {
    position: 'fixed',
    bottom: '2%',
    right: '2%',
    color: 'white',
    fontSize: 14,
    [theme.breakpoints.down('md')]: {
      bottom: '12%',
      right: '0',
    }
  },
  createPlaylistBtn: {
    position: 'fixed',
    bottom: '2%',
    left: '2%',
    color: '#006f96',
    fontSize: 14,
    [theme.breakpoints.down('lg')]: {
      left: '7%',
    },
    [theme.breakpoints.down('md')]: {
      bottom: '12%',
      left: '0'
    },
  },
  modal: {
    width: '100%',
    borderRadius: '18px',
    overflow: 'hidden',
    paddingTop: '1%'
  },
  inputLabel: {
    overflow: 'hidden',   
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    margin: '0 1em', 
    color: 'white',
  },
  detailsHeader: {
    boxShadow: '0 4px 2px -2px #013a57',
    width: '100%',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sliderBox: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '15px',
    width: '100%',
    marginLeft: '-25px',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  }
}));

export const SongDiscovery = ({ 
    recommendations, 
    dataLoaded,
    user,
    currentPlaylist,
    onAddToCurrentPlaylist,
    onRemoveFromCurrentPlaylistById,
    onSaveQuery,
 }) => {
  const theme = useTheme();

  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

  const [parameters, setParameters] = useState(initialDiscoveryState.query);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlaylistOption, setSelectedPlaylistOption] =  useState('create');

  const [songsToAdd, setSongsToAdd] = useState([]);
  const [invalidSearch, setInvalidSearch] = useState(false);
  const [targetParamValues, setTargetParamValues] = useState({
    songs: [],
    performers: [],
    genres: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queryName, setQueryName] = useState(''); 

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
      const newSearchParams = new URLSearchParams(searchParams);

      async function fetchData() {
        const authorizationCode = newSearchParams.get('code');
        const authorizationState = newSearchParams.get('state')
        
          if (authorizationCode) {
            newSearchParams.delete('code');
            newSearchParams.delete('state');
            const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
            window.history.replaceState({}, document.title, newURL);
            try {
                const csrftoken = await getCSRFToken();

                const response = await fetch('http://localhost:8000/auth/spotify/callback/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken,
                        // 'Authorization': `Bearer ${user.access}`
                    },
                    body: JSON.stringify({ code: authorizationCode, userId: user.user.id }),
                });

                const data = await response.json();

                const spotifyConnected = data['spotify_connected']

                if (spotifyConnected) {
                  dispatch(confirmSpotifyAccess(spotifyConnected))
                }

                const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
                window.history.replaceState({}, document.title, newURL);
            } catch (error) {
                console.error('Error:', error);
                // Handle any errors
            }
        };
      };

      // Call the async function
      fetchData();
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) {
      const targetElement = document.getElementById('resultsBox'); // Replace with the actual ID of your target element.

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  }, [isLoading]);

  const handleExploreMoreClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const classes = useStyles();
  const discoveryRecommendations = recommendations?.tracks
  
  const showTracks = discoveryRecommendations && dataLoaded
  
  const handleSelectAll = () => {
    songsToAdd.length === 0 ?
    setSongsToAdd(discoveryRecommendations) :
    setSongsToAdd([])
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleQueryNameChange = (e) => {
    setQueryName(e.target.value);
  };

  const handleSaveRequestParameters = () => {
    openModal();
  };

  const handleSelectUseTokens = () => {

  };

  const handleBulkAdd = () => {
    const songsToAddData = songsToAdd.map(song => ({
      'id': song.id,
      'name': song.name,
      'artists': song.artists.map(artist => artist.name),
      'spotify_id': song.spotify_id,
      'isrc': song.external_ids.isrc,
      'image': song.album.images[2].url,
    }));

    onAddToCurrentPlaylist(...songsToAddData);
  };

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    const buttonsContainer = document.querySelector('.buttons-container');

    const distanceFromTop = 200;
    const distanceFromBottom = 225;

    if (buttonsContainer && (scrollPosition < distanceFromTop || pageHeight - (scrollPosition + windowHeight) < distanceFromBottom)) {
      buttonsContainer.style.display = 'none';
    } 
    if (buttonsContainer && !(scrollPosition < distanceFromTop || pageHeight - (scrollPosition + windowHeight) < distanceFromBottom)) {
      buttonsContainer.style.display = 'block';
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <SpotifyForm
        classes={classes}
        parameters={parameters}
        setParameters={setParameters}
        invalidSearch={invalidSearch}
        setInvalidSearch={setInvalidSearch}
        targetParamValues={targetParamValues}
        setTargetParamValues={setTargetParamValues}
        setIsLoading={setIsLoading}
        user={user}
      />
      <Box
        display='flex'
        flexDirection='row'
        justifyContent='center'
        width='100%'
        id='resultsBox'
      >
        <LeftPanel 
          selectedPlaylistOption={selectedPlaylistOption}
          setSelectedPlaylistOption={setSelectedPlaylistOption}
          handleSelectUseTokens={handleSelectUseTokens}
        />
        <Box backgroundColor='transparent' width='53%'>
          {isLoading && (
            <Box backgroundColor='transparent' width='100%' paddingBottom='5%'>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                id='loadingState'
              >
                <CardHeader
                  title="Loading Results"
                  titleTypographyProps={{ color: 'black' }}
                  subheaderTypographyProps={{ color: '#3d3d3d' }}
                />
              </Box>
              <LoadingState />
            </Box>
          )}
          {showTracks ? (
            <Box backgroundColor='transparent' width='95%'>
              <Box className='buttons-container'>
                {!isXsScreen && !isSmScreen && !isMdScreen ? (
                  <Button variant='text' className={classes.resetBtn} onClick={handleExploreMoreClick}>
                    Explore More
                  </Button>
                  ) : (
                  <Button variant='text' className={classes.resetBtn} onClick={handleExploreMoreClick}>
                    <ArrowUpwardIcon />
                  </Button>
                )}
              </Box>
              <Box 
                display='flex' 
                justifyContent='space-between' 
                marginLeft='20px' 
                width='100%'
              >
                <Tooltip
                  title={
                    <div
                      style={{
                        maxHeight: '25vh',
                        overflowY: 'auto',
                        padding: '8px',
                        borderRadius: '8px',
                      }}
                    > 
                      <Typography variant='body2' letterSpacing='1px'>
                        {songsToAdd.length === 0 ? 'Select all discovery results' : 'Deselect all discovery results'}
                      </Typography>
                    </div>
                  }
                >
                  <Button onClick={handleSelectAll}>
                    <Typography 
                      color='white' 
                      variant='subtitle1'
                    >
                      {songsToAdd.length === 0 ? 'Select All' : 'Deselect All'}
                    </Typography>
                  </Button>
                </Tooltip>
                {user && (
                  <Tooltip
                    title={
                      <div
                        style={{
                          maxHeight: '25vh',
                          overflowY: 'auto',
                          padding: '8px',
                          borderRadius: '8px',
                        }}
                      > 
                        <Typography variant='body2' letterSpacing='1px'>
                          {'Save the parameters from this request'}
                        </Typography>
                      </div>
                    }
                  >
                    <Button onClick={handleSaveRequestParameters} sx={{ marginRight: '5%' }}>
                      <Typography 
                        color='white' 
                        variant='subtitle1'
                      >
                        {'View Request Parameters'}
                      </Typography>
                    </Button>
                  </Tooltip>)
                }
                <Tooltip
                  title={
                    <div
                      style={{
                        maxHeight: '25vh',
                        overflowY: 'auto',
                        padding: '8px',
                        borderRadius: '8px',
                      }}
                    > 
                      <Typography variant='body2' letterSpacing='1px'>
                        {'Add selected to playlist'}
                      </Typography>
                    </div>
                  }
                >
                  <Button onClick={handleBulkAdd}>
                    <PlaylistAddIcon fontSize='large' color='primary'/>
                  </Button>
                </Tooltip>
              </Box>
              <Suspense fallback={<div>Loading...</div>}>
                <Recommendations 
                  classes={classes} 
                  recommendations={discoveryRecommendations}
                  user={user}
                  currentPlaylist={currentPlaylist}
                  onAddToCurrentPlaylist={onAddToCurrentPlaylist}
                  onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}
                  songsToAdd={songsToAdd}
                  setSongsToAdd={setSongsToAdd}
                />
              </Suspense>
            </Box>    
          ) : !isLoading && (
              <Body 
                isSmScreen={isSmScreen} 
                isXsScreen={isXsScreen}
                isMdScreen={isMdScreen}
                isLgScreen={isLgScreen} 
                isXlScreen={isXlScreen} 
              />
          )}
        </Box>
        <RightPanel 
          currentPlaylist={currentPlaylist}
          onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}
          selectedPlaylistOption={selectedPlaylistOption}
          setSelectedPlaylistOption={setSelectedPlaylistOption}
          handleSelectUseTokens={handleSelectUseTokens}
        />
      </Box>
      <SaveQueryModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSaveQuery={onSaveQuery}
        queryName={queryName}
        handleQueryNameChange={handleQueryNameChange}
        user={user}
        classes={classes}
        parameters={parameters}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    error: state.discovery.error,
    recommendations: state.discovery.recommendations,
    dataLoaded: state.discovery.dataLoaded,
    user: state.user.currentUser,
    currentPlaylist: state.playlist.currentPlaylist,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onAddToCurrentPlaylist: (...songs) => dispatch(addToCurrentPlaylist(...songs)),
  onRemoveFromCurrentPlaylistById: (...songs) => dispatch(removeFromCurrentPlaylistById(...songs)),
  onSaveQuery: (query) => dispatch(saveQuery(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SongDiscovery);