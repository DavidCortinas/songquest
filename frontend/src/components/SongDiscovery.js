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
import { useForm } from 'react-hook-form';
import { makeStyles, useTheme } from '@mui/styles';
import { 
  addToSavedPlaylistRequest,
  createPlaylistRequest,
  // addToSpotify, 
  // checkUsersTracks, 
  discoverSongRequest, 
  // removeUsersTracks 
} from '../thunks';
import { 
  addToCurrentPlaylist, 
  confirmSpotifyAccess,  
  deletePlaylist, 
  removeFromCurrentPlaylist, 
  resetDataLoaded, 
  resetQueryParameter, 
  setQueryParameter 
} from '../actions';
import '../App.css';
import theme from '../theme'
import { LoadingState } from './LoadingState';
import { useLocation } from 'react-router-dom';
import { Body } from './Body';
import { LeftPanel } from './SidePanels/LeftPanel';
import { RightPanel } from './SidePanels/RightPanel';
import { startTransition } from 'react';

const Recommendations = lazy(() => import('./Recommendations'))
const SpotifyForm = lazy(() => import('./SpotifyForm/SpotifyForm'))

const useStyles = makeStyles(() => (
  {
    root: {
      padding: '15px 0 5px',
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
  playlistField: {
    width: '100%',
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
  currentPlaylistUl: {
    margin: '0 5% 0 0',
    listStyle: 'none',
  },
  recommendationsUl: {
    width: '100%'
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
  discoveryCard: {
    padding: '2rem',
    marginTop: '2rem',
    position: 'fixed',
    left: '7%',
    color: 'white',
    width: '15%',
    maxHeight: '80%',
    [theme.breakpoints.down('lg')]: {
      left: '10%',
      width: '10%',
    },
  },
  accordion: {
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
    query, 
    onSearchPressed, 
    onResetQueryParameter, 
    onResetDataLoaded,
    onSetQueryParameter,
    onAddToSpotify, 
    handleCheckUsersTracks,
    handleRemoveUsersTracks,
    dataLoaded,
    tracks,
    artists,
    genres,
    markets,
    user,
    currentPlaylist,
    playlists,
    onAddToCurrentPlaylist,
    onRemoveFromCurrentPlaylist,
    onCreatePlaylist,
    onAddToSavedPlaylist,
    onDeletePlaylist,
 }) => {
  const theme = useTheme();

  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

  const [parameters, setParameters] = useState(query);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidSearch, setInvalidSearch] = useState(false);
  const [createPlaylist, setCreatePlaylist] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  const [songsToAdd, setSongsToAdd] = useState([]);
  const [songsToRemove, setSongsToRemove] = useState([]);
  
  const [targetParams, setTargetParams] = useState(['songs', 'performers', 'genres']);

  const [targetParamValues, setTargetParamValues] = useState({
      songs: [],
      performers: [],
      genres: [],
  });

  const [targetParamLabels, setTargetParamLabels] = useState({
  songs: [],
  performers: [],
  genres: [],
  });

  const [usernameCreated, setUsernameCreated] = useState(Boolean(user?.user));
  const [spotifyAuthorized, setSpotifyAuthorized] =  useState(false);


  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');

  useEffect(() => {
          // Define an async function inside the useEffect
          async function fetchData() {
              const spotify_connection = searchParams.get('spotify_connection');

              // Check if access_token and refresh_token exist, and then remove them from the URL
              if (spotify_connection) {
                dispatch(confirmSpotifyAccess(spotify_connection))
                // Create a new URLSearchParams without the tokens
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.delete('spotify_connection');

                // Replace the URL without the tokens
                const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
                window.history.replaceState({}, document.title, newURL);
              };
          };

          // Call the async function
          fetchData();
      }, [email, spotifyAuthorized, usernameCreated]);

  const { handleSubmit } = useForm();

  const handleChange = (param, value) => {

    const sliderParam = value?.hasOwnProperty('min') 
    || value?.hasOwnProperty('max') 
    ||value?.hasOwnProperty('target')
    
    setInvalidSearch(false);

    if (!sliderParam) {
      setParameters(prevParameters => {
        if (param === 'market' || param === 'limit') {
            return {
                ...prevParameters,
                [param]: value
            };
        } else {
            if (!prevParameters[param].includes(value) 
              && Object.values(targetParamValues).reduce((total, array) => 
              total + array.length, 0) < 5) {
              return {
                ...prevParameters,
                [param]: [...prevParameters[param], value]
              };
            } else {
                return prevParameters;
            }
          }
      })} 
  };

  const [selectOpen, setSelectOpen] = useState(false);

  const handleTargetParamChange = (e) => {
    setSelectOpen(!selectOpen);
    setTargetParams(e.target.value);
  }

  const handleTargetParamDelete = (value) => {
    setTargetParams((prevTargetParam) =>
      prevTargetParam.filter((param) => param !== value)
    )
  }

  const dispatch = useDispatch();

  const onSubmit = () => {
    setIsLoading(true);
    setOpenModal(false);

    startTransition(() => {
      onSearchPressed(parameters)
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.log('Error: ', error);
        setIsLoading(false);
      })
    })
  };

  useEffect(() => {
    if (isLoading) {
      const targetHeight = 650; // Replace 500 with the desired vertical position (height) in pixels.

      window.scrollTo({
        top: targetHeight,
        behavior: 'smooth', // Use 'auto' for instant scrolling.
      });
    };
  }, [isLoading])

  const handleReset = () => {
    setInvalidSearch(false);
    setOpenModal(false);
    setParameters(query);
    setTargetParams([]);
    setTargetParamLabels(
      {
        songs: [],
        performers: [],
        genres: [],
      }
    );
    setTargetParamValues(
      {
        songs: [],
        performers: [],
        genres: [],
      }
    );
    onResetDataLoaded();
    onResetQueryParameter(); 
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    onSubmit(); // Call the onSubmit function manually
  };

  const [openModal, setOpenModal] = useState(false);

  const handleSelectedOptions = (parameter, selectedOptions) => {
    setTargetParamLabels(prevLabels => ({
      ...prevLabels,
      [parameter]: selectedOptions,
    }))
  };

  const handleExploreMoreClick = () => {
    // Smoothly scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // setCreatePlaylist(false);
  };

  const handleCreatePlaylist = () => {
    const newPlaylist = {
      name: playlistName, 
      tracks: currentPlaylist
    }

    onCreatePlaylist(user.user.id, newPlaylist)
      .then(createdPlaylist => {
        console.log('created: ', createdPlaylist)
        const spotifyId = createdPlaylist.spotify_id;
        const trackUris = newPlaylist.tracks.map(track => track.uri);
        console.log('onCreate: ', spotifyId)
        console.log('onCreate: ', trackUris)

        return onAddToSavedPlaylist(spotifyId, user.user.id, trackUris);
      })
      .then(response => {
        console.log("Playlist created and tracks added", response);
      })
      .catch(error => {
        console.log("Error in creating playlist and adding tracks: ", error);
      });
  };

  const handleDeletePlaylist = (playlistId) => {
    onDeletePlaylist(playlistId)
  }

  const classes = useStyles();
  const discoveryRecommendations = recommendations?.tracks
  
  const showTracks = discoveryRecommendations && dataLoaded
  
  const handleSelectAll = () => {
    songsToAdd.length === 0 ?
    setSongsToAdd(discoveryRecommendations) :
    setSongsToAdd([])
  };

  const handleBulkAdd = () => {
   onAddToCurrentPlaylist(...songsToAdd);
  };

  const handleBulkRemove = () => {
    onRemoveFromCurrentPlaylist(...songsToRemove);
  }

  window.addEventListener('scroll', () => {
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
  });

  const playlistItemInSongsToRemove = (id) => {
    return songsToRemove.some(obj => obj.id === id)
  };

  const handlePlaylistSelectClick = (item) => {
    if (playlistItemInSongsToRemove(item.id)) {
      setSongsToRemove(songsToRemove.filter(song => song.id !== item.id));
    } else {
      setSongsToRemove([...songsToRemove, item])
    };
  };

  const handlePlaylistSelectAll = () => {
      if (songsToRemove.length === 0) {
          setSongsToRemove(currentPlaylist);
      } else {
          setSongsToRemove([]);
      }
  };

  const isPlaylistItemChecked = (item) => {
    return songsToRemove.some(song => song.id === item.id);
  };

  const getPlaylistItems = (playlist) => {
    return (
      playlist.tracks?.map((track, index) => (
        <Typography>
          {`${track.name} - ${track.artists.map((a) => ` ${a.name}`)}`}
        </Typography>
      )
    ))
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <form className={classes.form} onSubmit={handleFormSubmit}>
          <CardHeader
            title={"🎵 Discover New Music, Customize Playlists, and Share Unique Finds 🎶"}
            titleTypographyProps={{
              width: '100%',
              variant: isSmScreen || isXsScreen
                ? 'h6'
                : 'h5',
              textAlign: 'center',
              color: 'white',
              letterSpacing: '1px',
            }}
            // subheader={!isXsScreen &&
            //   "Begin your journey by selecting the AI model you would like to copilot your quest"}
            subheaderTypographyProps={{
              width: '100%',
              variant: isXlScreen || isLgScreen
                ? 'body1'
                : 'body2',
              textAlign: 'center',
              color: 'whitesmoke',
            }} 
            classes={{
              root: classes.root
            }}
          />
          <SpotifyForm
            classes={classes}
            isSmScreen={isSmScreen}
            isXsScreen={isXsScreen}
            isLgScreen={isLgScreen}
            isXlScreen={isXlScreen}
            playlistName={playlistName}
            setPlaylistName={setPlaylistName}
            parameters={parameters}
            selectOpen={selectOpen}
            setSelectOpen={setSelectOpen}
            targetParams={targetParams}
            handleTargetParamChange={handleTargetParamChange}
            handleTargetParamDelete={handleTargetParamDelete}
            handleChange={handleChange}
            invalidSearch={invalidSearch}
            targetParamValues={targetParamValues}
            tracks={tracks}
            artists={artists}
            genres={genres}
            markets={markets}
            setTargetParamValues={setTargetParamValues}
            handleSelectedOptions={handleSelectedOptions}
            setParameters={setParameters}
            query={query}
            onSetQueryParameter={onSetQueryParameter}
            openModal={openModal}
            setOpenModal={setOpenModal}
            isMdScreen={isMdScreen}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            handleReset={handleReset}
          />
        </form>
      </Box>
      <Box
        display='flex'
        flexDirection='row'
        justifyContent='center'
        width='100%'
      >
        <LeftPanel 
          classes={classes} 
          handleDeletePlaylist={handleDeletePlaylist}
          playlists={playlists}
          getPlaylistItems={getPlaylistItems}
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
                    title={songsToAdd.length === 0 ? 'Select all discovery results' : 'Deselect all discovery results'}
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
                  <Tooltip
                    title='Add selected to playlist'
                  >
                    <Button marginRight='-10px' onClick={handleBulkAdd}>
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
                    onRemoveFromCurrentPlaylist={onRemoveFromCurrentPlaylist}
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
          classes={classes}
          handleCreatePlaylist={handleCreatePlaylist}
          setPlaylistName={setPlaylistName}
          playlistName={playlistName}
          handleBulkRemove={handleBulkRemove}
          handlePlaylistSelectAll={handlePlaylistSelectAll}
          currentPlaylist={currentPlaylist}
          songsToRemove={songsToRemove}
          isPlaylistItemChecked={isPlaylistItemChecked}
          handlePlaylistSelectClick={handlePlaylistSelectClick}
        />
      </Box>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    query: state.discovery.query,
    error: state.discovery.error,
    recommendations: state.discovery.recommendations,
    dataLoaded: state.discovery.dataLoaded,
    tracks: state.discovery.tracks,
    artists: state.discovery.artists,
    genres: state.discovery.genres,
    markets: state.discovery.markets,
    user: state.user.currentUser,
    currentPlaylist: state.playlist.currentPlaylist,
    playlists: state.playlist.playlists,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSearchPressed: (query) => dispatch(discoverSongRequest(query)),
  onResetQueryParameter: () =>
    dispatch(resetQueryParameter()),
  onResetDataLoaded: () =>
    dispatch(resetDataLoaded()),
  onSetQueryParameter: (query, parameter, newValues) => dispatch(setQueryParameter(query, parameter, newValues)),
  // onAddToSpotify: (recommendation, spotify_access, spotify_refresh, spotify_expires_at) => dispatch(addToSpotify(recommendation, spotify_access, spotify_refresh, spotify_expires_at)),
  // handleCheckUsersTracks: (recommendation, email) => dispatch(checkUsersTracks(recommendation, email)),
  // handleRemoveUsersTracks: (recommendation, spotify_access, spotify_refresh, spotify_expires_at) => dispatch(removeUsersTracks(recommendation, spotify_access, spotify_refresh, spotify_expires_at)),
  onAddToCurrentPlaylist: (...songs) => dispatch(addToCurrentPlaylist(...songs)),
  onRemoveFromCurrentPlaylist: (...songs) => dispatch(removeFromCurrentPlaylist(...songs)),
  onCreatePlaylist: (userId, playlist) => dispatch(createPlaylistRequest(userId, playlist)),
  onAddToSavedPlaylist: (playlistId, userId, ...songs) => dispatch(addToSavedPlaylistRequest(playlistId, userId, ...songs)),
  onDeletePlaylist: (plalistId) => {dispatch(deletePlaylist(plalistId))},
});

export default connect(mapStateToProps, mapDispatchToProps)(SongDiscovery);