import React, { Suspense, lazy, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  CardHeader,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {  
  removeFromCurrentPlaylistById,
} from '../actions';
import '../App.css';
import theme from '../theme'
import { LoadingState } from './LoadingState';
import { Body } from './Body';
import LeftPanel from './sidePanels/LeftPanel';
import RightPanel from './sidePanels/RightPanel';
import { initialDiscoveryState } from 'reducers';
import { saveRequestParameters } from 'thunks';

const Recommendations = lazy(() => import('./Recommendations'))
const SpotifyForm = lazy(() => import('./spotifyForm/SpotifyForm'))
const SaveQueryModal = lazy(() => import('./SaveQueryModal'))

const useStyles = makeStyles((theme) => (
  {
    root: {
      padding: '15px 0 5px',
      [theme.breakpoints.down('md')]: {
        padding: '0px',
      }
    },
    paper: {
      marginTop: '1vh',
      backgroundColor: '#30313d',
      width: '18%'
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
      background: 'rgba(48, 130, 164, 0.15)',
      // background: 'rgba(196,213,228, 0.2)',
      boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
      padding: '0 2%',
    },
    panelCard: {
      display: 'flex', 
      width: '18vw',
      minHeight: 'fit-content', 
      padding: '0.5%',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      margin: '1%',
      borderRadius: '8px',
      backgroundColor: '#282828',
      boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
      opacity: '0.8',
      '&:hover, &:active, &.MuiFocusVisible': {
          border: '2px solid rgba(89, 149, 192, 0.5)',
          background: 'rgba(48, 130, 164, 0.15)',
          boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
      },
      [theme.breakpoints.down('lg')]: {
        width: '25vw',
      },
      [theme.breakpoints.down('sm')]: {
        width: '50vw',
      },
    },
    buttonWithMargin: {
      margin: '4%',
      width: '22vw',
      height: '10vh', 
      [theme.breakpoints.down('md')] : {
          width: '80%',
      },
    },
    button: {
      color: 'white',
      backgroundColor: 'rgb(44, 216, 207, 0.3)',
      border: '2px solid rgba(89, 149, 192, 0.5)',
      borderRadius: '18px',
      boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
      transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
      '&:hover, &:active, &.MuiFocusVisible': {
        border: '2px solid rgba(89, 149, 192, 0.5)',
        backgroundColor: 'rgb(44, 216, 207, 0.5)',
        boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
      },
    },
    highlightedButton: {
      backgroundColor: 'rgb(44, 216, 207, 0.5)',
    },
    sidePanel: {
      marginTop: '10px',
      height: '95vh', 
      width: '20%',
      color: 'white',
      border: '2px solid rgba(89, 149, 192, 0.5)',
      borderRadius: '18px',
      background: 'rgba(48, 130, 164, 0.15)',
      boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: `${theme.palette.primary.analogous1} transparent`,
      WebkitOverflowScrolling: 'touch',
      scrollbarFaceColor: theme.palette.primary.analogous2,
      scrollbarHighlightColor: 'transparent',
      scrollbarShadowColor: 'transparent',
      scrollbarDarkShadowColor: 'transparent',
    },
    textField: {
      width: '66%',
      [theme.breakpoints.down('lg')]: {
        width: '100%',
      },
      backgroundColor: '#30313d',
      borderRadius: '8px',
      boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
    },
    resultsField: {
      width: '15%',
      [theme.breakpoints.down('lg')]: {
        width: '25%',
      },
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
      [theme.breakpoints.down('lg')]: {
        width: '75%',
      },
      [theme.breakpoints.down('md')]: {
        width: '100%',
        paddingRight: '0',
        margin: '1vh'
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
      [theme.breakpoints.down('sm')]: {
        marginLeft: '-10px'
      }
    }
  }
));

const MobileResults = ({
  handleSelectUseTokens,
  discoveryRecommendations,
  classes,
  user,
  currentPlaylist,
  onRemoveFromCurrentPlaylistById,
  setIsModalOpen,
  isLoading,
  showTracks,
  handleExploreMoreClick,
  isXsScreen,
  isSmScreen,
  isMdScreen,
  isLgScreen,
  isXlScreen,
  showPlaylists,
  setShowPlaylists,
}) => {
  
  return (
    <Box
      display='flex'
      flexDirection='row'
      justifyContent='center'
      width='99%'
      id='resultsBox'
      paddingLeft={(user?.user || showTracks) && '3%'}
    >
      {(user?.user || showTracks) && (showPlaylists ? (
        <LeftPanel 
          handleSelectUseTokens={handleSelectUseTokens}
          isMdScreen={isMdScreen}
          isSmScreen={isSmScreen}
          isXsScreen={isXsScreen}
          setShowPlaylists={setShowPlaylists}
          user={user}
        />
      ) : (
        <RightPanel 
          currentPlaylist={currentPlaylist}
          onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}
          handleSelectUseTokens={handleSelectUseTokens}
          handleExploreMoreClick={handleExploreMoreClick}
          isSmScreen={isSmScreen}
          isXsScreen={isXsScreen}
          setShowPlaylists={setShowPlaylists}
        />
      ))}
      <Box 
        backgroundColor='transparent' 
        width={(isXsScreen || isSmScreen) ? 
          '100%' : 
          '65%'
        }
      >
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
                titleTypographyProps={{ color: 'white' }}
                subheaderTypographyProps={{ color: '#3d3d3d' }}
              />
            </Box>
            <LoadingState />
          </Box>
        )}
        {showTracks ? (
          <Box  width='100%' justifyContent='space-between'>
            <Suspense fallback={<div>Loading...</div>}>
              <Recommendations 
                classes={classes} 
                recommendations={discoveryRecommendations}
                user={user}
                currentPlaylist={currentPlaylist}
                onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}
                setIsModalOpen={setIsModalOpen}
                isXsScreen={isXsScreen}
              />
            </Suspense>
          </Box>    
        ) : !isLoading && (
          user?.user ? (
            <Box 
              display='flex'
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
            >
              <Typography 
                color='white' 
                textAlign='center' 
                variant='h6'
                letterSpacing='1px'
                padding='5% 0 0'
                width='80%'
              >
                What kind of music are you in the mood for today?
              </Typography>
              <Typography 
                color='white' 
                // textAlign='center' 
                variant='body1'
                letterSpacing='1px'
                padding='5% 5% 0'
              >
                Start discovering new music now. Simply choose from the songs,
                artists, and genres that inspire you and start discovering related music.
              </Typography>
              <Typography 
                color='white' 
                // textAlign='center' 
                variant='caption'
                letterSpacing='1px'
                padding='5% 5% 0'
              >
                * Adjust your search by clicking on "Fine Tune Your Recommendations" 
                to enable and configure fine-tuning parameters. This allows you to 
                personalize your results and find music that precisely matches your 
                preferences.
              </Typography>
              <Button 
                className={`${classes.button} ${classes.buttonWithMargin}`} 
                onClick={() => handleExploreMoreClick(false)}
                variant='contained'
              >
                <Typography
                  variant='body2' 
                  color='white'
                  letterSpacing='1px'
                  sx={{
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Get Started On Your Journey
                </Typography>
                <Typography variant='h5' paddingLeft='2%'>
                  🚀
                </Typography>
              </Button>
            </Box>
          ) : (
            <Body 
              isSmScreen={isSmScreen} 
              isXsScreen={isXsScreen}
              isMdScreen={isMdScreen}
              isLgScreen={isLgScreen} 
              isXlScreen={isXlScreen}
              handleExploreMoreClick={handleExploreMoreClick}
            />
          )
        )}
      </Box>
    </Box>
  )
}

export const SongDiscovery = ({ 
    recommendations, 
    dataLoaded,
    user,
    currentPlaylist,
    onRemoveFromCurrentPlaylistById,
    onSaveQuery,
 }) => {
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

  const [parameters, setParameters] = useState(initialDiscoveryState.query);
  const [isLoading, setIsLoading] = useState(false);

  const [invalidSearch, setInvalidSearch] = useState(false);
  const [targetParamValues, setTargetParamValues] = useState({
    songs: [],
    performers: [],
    genres: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDemoModal, setOpenDemoModal] = useState(false);
  const [queryName, setQueryName] = useState(''); 

  const [showPlaylists, setShowPlaylists] = useState(true);

  useEffect(() => {
    if (isLoading) {
      const targetElement = document.getElementById('resultsBox');

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  }, [isLoading]);

const handleExploreMoreClick = (activatesModal) => {
  const myComponent = document.getElementById('topBar');

  if (myComponent) {
    myComponent.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  if (activatesModal) {
    setOpenDemoModal(true);
  };
};

  const classes = useStyles();
  const discoveryRecommendations = recommendations?.tracks
  
  const showTracks = discoveryRecommendations && dataLoaded

  const handleQueryNameChange = (e) => {
    setQueryName(e.target.value);
  };

  const handleSelectUseTokens = () => {

  };

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
        openDemoModal={openDemoModal}
        setOpenDemoModal={setOpenDemoModal}
      />
      {!(isSmScreen || isXsScreen || isMdScreen) ? (
        <Box
          display='flex'
          flexDirection='row'
          justifyContent='center'
          width='100%'
          id='resultsBox'
        >
          {(user?.user || showTracks) && (
            <LeftPanel 
              handleSelectUseTokens={handleSelectUseTokens}
              isMdScreen={isMdScreen}
              isSmScreen={isSmScreen}
              isXsScreen={isXsScreen}
              setShowPlaylists={setShowPlaylists}
              user={user}
            />
          )}
          <Box 
            backgroundColor='transparent' 
            width={(isXsScreen || isSmScreen) ? 
              '100%' : 
              (user?.user || showTracks) ? 
              '53%' : 
              '70%'
            }
            display='flex'
            flexDirection='column'
            alignItems='center'
          >
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
                    titleTypographyProps={{ color: 'white' }}
                    subheaderTypographyProps={{ color: '#3d3d3d' }}
                  />
                </Box>
                <LoadingState />
              </Box>
            )}
            {showTracks ? (
              <Box  width='100%' justifyContent='space-between'>
                <Suspense fallback={<div>Loading...</div>}>
                  <Recommendations 
                    classes={classes} 
                    recommendations={discoveryRecommendations}
                    user={user}
                    currentPlaylist={currentPlaylist}
                    onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}
                    setIsModalOpen={setIsModalOpen}
                    isXsScreen={isXsScreen}
                  />
                </Suspense>
              </Box>    
            ) : !isLoading && (
              user?.user ? (
                <Box 
                  display='flex'
                  flexDirection='column'
                  justifyContent='center'
                  alignItems='center'
                  width='95%'
                >
                  <Typography 
                    color='white' 
                    textAlign='center' 
                    variant='h4'
                    letterSpacing='1px'
                    padding='5% 0 0'
                    width='80%'
                  >
                    What kind of music are you in the mood for today?
                  </Typography>
                  <Typography 
                    color='white' 
                    // textAlign='center' 
                    variant='subtitle1'
                    letterSpacing='1px'
                    padding='5% 3% 0'
                    width='100%'
                  >
                    Start discovering new music now. Simply choose from the songs,
                    artists, and genres that inspire you and start discovering related music.
                  </Typography>
                  <Typography 
                    color='white' 
                    // textAlign='center' 
                    variant='subtitle1'
                    letterSpacing='1px'
                    padding='5% 3% 0'
                    width='100%'
                  >
                    Adjust your search by clicking on "Fine Tune Your Recommendations" 
                    to enable and configure fine-tuning parameters. This allows you to 
                    personalize your results and find music that precisely matches your 
                    preferences.
                  </Typography>
                  <Button 
                    className={`${classes.button} ${classes.buttonWithMargin}`} 
                    onClick={() => handleExploreMoreClick(false)}
                    variant='contained'
                  >
                    <Typography
                      variant='subtitle1' 
                      color='white'
                      letterSpacing='1px'
                      sx={{
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      Get Started On Your Journey
                    </Typography>
                    <Typography variant='h5' paddingLeft='2%'>
                      🚀
                    </Typography>
                  </Button>
                </Box>
              ) : (
                <Body 
                  isSmScreen={isSmScreen} 
                  isXsScreen={isXsScreen}
                  isMdScreen={isMdScreen}
                  isLgScreen={isLgScreen} 
                  isXlScreen={isXlScreen}
                  handleExploreMoreClick={handleExploreMoreClick}
                />
              )
            )}
          </Box>
          {(user?.user || showTracks) && (
            <RightPanel 
              currentPlaylist={currentPlaylist}
              onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}
              handleSelectUseTokens={handleSelectUseTokens}
              handleExploreMoreClick={handleExploreMoreClick}
              isSmScreen={isSmScreen}
              isXsScreen={isXsScreen}
              setShowPlaylists={setShowPlaylists}
            />
          )}
        </Box>
      ) : (
        <MobileResults 
          handleSelectUseTokens={handleSelectUseTokens}
          discoveryRecommendations={discoveryRecommendations}
          classes={classes}
          user={user}
          currentPlaylist={currentPlaylist}
          onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}
          setIsModalOpen={setIsModalOpen}
          showPlaylists={showPlaylists}
          setShowPlaylists={setShowPlaylists}
          isLoading={isLoading}
          showTracks={showTracks}
          handleExploreMoreClick={handleExploreMoreClick}
          isXsScreen={isXsScreen}
          isSmScreen={isSmScreen}
          isMdScreen={isMdScreen}
          isLgScreen={isLgScreen}
          isXlScreen={isXlScreen}
        />
      )}
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
  onRemoveFromCurrentPlaylistById: (...songs) => dispatch(removeFromCurrentPlaylistById(...songs)),
  onSaveQuery: (userId, query) => dispatch(saveRequestParameters(userId, query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SongDiscovery);