import { 
  Autocomplete,
    Box, 
    Button, 
    Card, 
    Checkbox, 
    TextField, 
    ToggleButton, 
    ToggleButtonGroup, 
    Tooltip, 
    Typography,
    useMediaQuery
} from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import useStyles from "classes/playlist";
import { useState } from "react";
import { connect } from "react-redux";
import { addToSavedPlaylistRequest, createPlaylistRequest } from "thunks";
import { useNavigate } from "react-router-dom";
import theme from "theme";

const root = {
  "& .MuiAutocomplete-option[data-focus='true']": {
    backgroundColor: '#40444d',
    color: 'white',
  },
  "& .MuiAutocomplete-option:hover": {
    backgroundColor: '#40444d',
    color: 'white',
  },
};

const PlaylistItemCard = ({ 
  item, 
  key, 
  handlePlaylistSelectClick, 
  isPlaylistItemChecked,
  isSmScreen,
  isXsScreen, 
}) => {
  const songName = item?.name;
  const artists = item?.artists?.join(', ');
  const imgUrl = item?.image;  

  return (
    <Card 
      key={key} 
      sx={{ 
        display: 'flex', 
        width: (isXsScreen || isSmScreen) ? '30vw' : '18vw',
        height: (isXsScreen || isSmScreen) ? '7vh' : '11vh', 
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px',
        backgroundColor: '#282828',
        boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
        opacity: '0.9',
        paddingLeft: '2%',
      }}
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
              {'Select song from playlist'}
            </Typography>
          </div>
        }
      >
        <Checkbox
          icon={<CircleIcon sx={{ color: '#d2dce1', opacity: '0.5' }} />}
          checkedIcon={<CheckCircleIcon color='info' />}                       
          onClick={() => handlePlaylistSelectClick(item)}
          checked={isPlaylistItemChecked(item)}
          sx={{
            color: 'white',
            position: 'absolute',
            top: '10%',
            left: '2%',
            zIndex: '2',
            paddingLeft: '0px',
          }}
        />
      </Tooltip>
      {!(isXsScreen || isSmScreen) && (
        <img 
          src={imgUrl} 
          style={{
            maxWidth: '100%',       
            height: 'auto',
            padding: '2% 2% 2% 2vw',         
          }} 
        />
      )}
      <Box paddingLeft={(isXsScreen || isSmScreen) && '25%'}>
        <Typography
          noWrap  
          variant={(isXsScreen || isSmScreen) ? 'caption' : 'subtitle2'} 
          color='white'
          sx={{
            maxHeight: '30%',
            maxWidth: '100%',
            overflowY: 'auto',
          }}
        >
          {songName}
        </Typography>
        <Typography 
          noWrap={(isXsScreen || isSmScreen)}
          variant={(isXsScreen || isSmScreen) ? 'caption' : 'subtitle2'} 
          color='white' 
          sx={{ 
            fontWeight: 'bold', 
            display: 'flex', 
            maxWidth: '100%',
            overflowY: 'auto', 
          }}
        >
          {artists}
        </Typography>
      </Box>
      <img 
        src='/static/images/Spotify_Icon_RGB_White.png' 
        style={{ 
          maxWidth: '8%', 
          height: 'auto',
          position: 'absolute',
          right: '5%',
          bottom:'15%',
        }}
      />
    </Card>
  );
};

const CreateOrEditPlaylist = ({
  classes,
  currentPlaylist,
  handleCreatePlaylist,
  user,
  playlists,
  setPlaylistName,
  playlistName,
  onRemoveFromCurrentPlaylistById,
  navigate,
}) => {
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));
  console.log(currentPlaylist)

  
  const [songsToRemove, setSongsToRemove] = useState([]);
  const [playlistToEdit, setPlaylistToEdit] = useState('');
  const [toggleValue, setToggleValue] = useState('Create');

  const isPlaylistItemChecked = (item) => {
    return songsToRemove.some(song => song === item.id);
  };

  const handleBulkRemove = () => {
    onRemoveFromCurrentPlaylistById(...songsToRemove.map(songId => songId));
  };

    const playlistItemInSongsToRemove = (id) => {
    return songsToRemove.some(obj => obj.id === id)
  };

  const handlePlaylistSelectClick = (item) => {
    if (playlistItemInSongsToRemove(item.id)) {
      setSongsToRemove(songsToRemove.filter(song => song.id !== item.id));
    } else {
      setSongsToRemove([...songsToRemove, item.id])
    };
  };

  const handlePlaylistSelectAll = () => {
    if (songsToRemove.length !== currentPlaylist.tracks.length) {
        setSongsToRemove(currentPlaylist.tracks.map(song => song.id));
    } else {
        setSongsToRemove([]);
    };
  };

  const handleConnectToSpotify = () => {
    if (!user?.user) {
      navigate('/login');
    } else {

    };
  };

  const handleChange = (event, newValue) => {
      // setSelectedGenres(newValue);
  };

  const handleToggle = () => {
    if (toggleValue === 'Create') {
      setToggleValue('Edit')
    } else {
      setToggleValue('Create')
    }
  };

  return (
    <>
      <Box
        display='flex'
        flexDirection='column'

      >
        <Box display="flex" justifyContent="center">
          <ToggleButtonGroup 
            exclusive
            sx={{
              boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
              borderRadius: '8px',
              width: '70%',
              marginTop: '2%',
            }}
            onChange={handleToggle}
          >
            <ToggleButton 
              value="Create"
              sx={{
                backgroundColor: toggleValue === 'Create' ? 'rgb(44, 216, 207, 0.3)' : 'rgba(48, 130, 164, 0.15)',
                color: toggleValue === 'Create' ? 'whitesmoke' : 'grey',
                borderRadius: '8px',
                width: '50%',
                padding: '1%',
                '&:hover': {
                    backgroundColor: 'rgb(44, 216, 207, 0.5)',
                    color: 'whitesmoke',
                },
              }}
            >
              {'Create'}
            </ToggleButton>
            <ToggleButton 
              value="Edit"
              sx={{
                backgroundColor: toggleValue === 'Edit' ? 'rgb(44, 216, 207, 0.3)' : 'rgba(48, 130, 164, 0.15)',
                color: toggleValue === 'Edit' ? 'whitesmoke' : 'grey',
                borderRadius: '8px',
                width: '50%',
                padding: '1%',
                '&:hover': {
                    backgroundColor: 'rgb(44, 216, 207, 0.5)',
                    color: 'whitesmoke',
                },
              }}
            >
              {'Edit'}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box 
          display='flex' 
          justifyContent='center'
          alignSelf='center'
          width='90%'
          margin='5%'
        >
          {toggleValue === 'Create' ? (
            <TextField 
              label='Playlist Name' 
              variant='standard' 
              required
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className={classes.playlistField}
              sx={(isXsScreen || isSmScreen) && {
                "& .MuiInputBase-root": {
                  marginTop: '7px',
                }
              }}
              InputLabelProps={{
                sx: {
                  color: 'white',
                  marginLeft: '5%',
                  fontSize: (isXsScreen || isSmScreen) ? '70%' : '100%',
                }
              }}
              InputProps={{
                sx: {
                  color: 'white',
                  marginLeft: '5px',
                  fontSize: (isXsScreen || isSmScreen) ? '70%' : '97%',
                  '& .MuiInputBase-input': {
                    padding: '2%'
                  },
                }
              }}
            />
          ) : (
            <Autocomplete 
              freeSolo
              filterSelectedOptions
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              value={playlistToEdit.name}
              onChange={handleChange}
              label={'Select Playlist'}
              options={playlists.map(playlist => playlist.name)}
              ListboxProps={{
                sx: {
                    ...root,
                    padding: 0,
                }
              }}
              className={classes.textField}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{
                      justifyContent: 'space-between',
                      background: '#30313d',
                      color: 'white',
                  }}
                  {...props}
                >
                  {option}
                </Box>
              )}
              ChipProps={{
                sx: {
                  color: 'white',
                  backgroundColor: '#006f96',
                  '& .MuiChip-deleteIcon': {
                      color: 'white',
                  },
                  '& .MuiChip-deleteIcon:hover': {
                      color: '#00435a',
                  },
                }       
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Playlist"
                  variant="standard"
                  InputLabelProps={{
                    sx: {
                      paddingLeft: '1em',
                      // backgroundColor: '#30313d',
                      color: 'white',
                    },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    style: { 
                      // margin: '5px 0', 
                      // padding: '5px 10px', 
                      fill: 'white',
                    },
                    sx: {
                      ...params.InputProps.sx,
                      color: 'white',
                      '&:before': { 
                          borderBottom: 'none',
                      },
                      '&:hover:not(.Mui-disabled):before': {
                          borderBottom: 'none',
                      },
                    },
                  }}
                />
              )}
            />
          )
        }
        </Box>
        <Box 
          display='flex' 
          justifyContent={'space-between'}
          padding={'5% 0 0 5%'}
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
                  {
                    songsToRemove.length === 0 ? 
                    'Select all tracks in current playlist' : 
                    'Deselect all tracks in current playlist'
                  }
                </Typography>
              </div>
            }
          >
            <Checkbox
              onClick={handlePlaylistSelectAll} 
              sx={{ 
                padding: '0px', 
                color: theme.palette.primary.white,
                '& .MuiSvgIcon-root': { 
                  fontSize: isXsScreen ? '1.25rem' : '2rem', 
                  transform: 'scale(0.75)', 
                }
              }}
            />
          </Tooltip>
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
                  {user?.user.spotifyConnected && user?.user.tokens > 2 && toggleValue === 'Create' ? 
                  'Create Playlist' : 
                  user?.user.spotifyConnected && user?.user.tokens > 2 ?
                  'Update Playlist' :
                  user?.user.tokens < 2 ?
                  "Get more tokens to complete request" :
                  'Connect to Spotify to create playlists'}
                </Typography>
              </div>
            }
          >
            <Button 
              disabled={!user?.user}
              onClick={handleCreatePlaylist} 
              className={user?.user.tokens < 2 ? classes.disabled : classes.button}
            >
              <Box display='flex' alignItems='center'>
                <AutoAwesomeIcon
                  style={{ 
                    color: theme.palette.primary.complementary,
                    paddingRight: '2%',
                  }}
                  fontSize={(isSmScreen || isXsScreen) ? 'small' : 'medium'}
                />
                <Typography 
                  variant={(isLgScreen || isXlScreen) ? 'body2' : 'caption'} 
                  letterSpacing='1px'
                >
                  {!(isXsScreen || isSmScreen) && 
                    toggleValue === 'Create' ? 
                    'Create' :
                    'Update'
                  }
                </Typography>
              </Box>
            </Button>
          </Tooltip>
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
                  {'Clear selected from playlist'}
                </Typography>
              </div>
            }
          >
            <Button
                sx={{ padding: '0'}}
            >
              <PlaylistRemoveIcon 
                style={{ color: theme.palette.primary.white }}
                onClick={handleBulkRemove}
              />
            </Button>
          </Tooltip>
        </Box>
      </Box>
      <ul 
        style={{ 
          padding: '0px', 
          display: 'flex', 
          flexDirection: 'column', 
        }}
      >
        {currentPlaylist.tracks.length > 0 ? currentPlaylist.tracks.map((item, index) => (
          <Box 
            display='flex' 
            flexDirection='column'
            alignItems='center'
            paddingBottom='10px'
          >
            <li key={index} className={classes.currentPlaylistUl}>
              <PlaylistItemCard 
                item={item} 
                key={item.id} 
                handlePlaylistSelectClick={handlePlaylistSelectClick}
                isPlaylistItemChecked={isPlaylistItemChecked}
                isSmScreen={isSmScreen}
                isXsScreen={isXsScreen}
              />
            </li>
          </Box>)
          ) : (
            <Box 
              display='flex' 
              flexDirection='column'
              alignItems='center'
              paddingBottom='5%'
              position='relative'
            >
              {user?.user.spotifyConnected ? (
                <Typography 
                  variant={(isXsScreen || isSmScreen) ? 'subtitle2' : 'subtitle1' }
                  textAlign='center' 
                  padding='20px'
                  letterSpacing='2px'
                >
                  {'Unearth new gems and add them to your collection...'}
                </Typography>
              ) : (
                <>
                  <Typography 
                    variant='subtitle1' 
                    textAlign='center' 
                    padding='20px'
                    letterSpacing='2px'
                  >
                    {
                      user?.user ? 
                      'Connect to Spotify to earn tokens and start creating playlists' :
                      `Register/Login, Connect to Spotify, Use tokens to unearth new gems and add them to your collection`
                    }
                  </Typography>
                  <li style={{ listStyle: 'none' }}>
                    <Card
                      onClick={handleConnectToSpotify}
                      className={classes.panelCard}
                    >
                      <Box padding='0 5% 0'>
                        <Typography 
                          variant='subtitle1' 
                          textAlign='center' 
                          letterSpacing='2px'
                          color='white'
                          sx={{
                            fontWeight: 'bold',
                            maxHeight: '30%',
                            maxWidth: '100%',
                            overflowY: 'auto',
                            cursor: 'pointer',
                          }}
                          >
                          Connect to Spotify
                        </Typography>
                      </Box> 
                      <img 
                        src='/static/images/Spotify_Icon_RGB_White.png' 
                        style={{ 
                          maxWidth: '8%', 
                          height: 'auto',
                          position: 'absolute',
                          right: 20,
                          bottom:20,
                        }}
                      />
                    </Card>
                  </li>
                </>
              )}
            </Box>
          )
        }
      </ul>
    </>
  )
};

  export const RightPanel = ({
      currentPlaylist,
      user,
      playlists,
      onCreatePlaylist,
      onAddToSavedPlaylist,
      onRemoveFromCurrentPlaylistById,
      handleExploreMoreClick,
      isSmScreen,
      isXsScreen,
      setShowPlaylists,
  }) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [playlistName, setPlaylistName] = useState('');

    const handleBackToPlaylists = () => {
      setShowPlaylists(true);
    };

    const handleCreatePlaylist = () => {
      if (!user?.user.spotifyConnected) {
        navigate('/spotify-connect')
      };

      if (user?.user.tokens < 2) {
        navigate('/pricing');
      };

      const newPlaylist = {
        name: playlistName, 
        tracks: currentPlaylist.tracks,
      };

      onCreatePlaylist(user?.user.id, newPlaylist)
        .then(createdPlaylist => {
          const playlistId = createdPlaylist.id;
          const playlistTracks = newPlaylist.tracks.map(track => {
            return {
              name: track.name,
              artists: track.artists,
              spotifyId: track.id,
              isrc: track.isrc,
              image: track.image
            }
          });

          return onAddToSavedPlaylist(playlistId, user?.user.id, playlistTracks);
        })
        .then(response => {
          onRemoveFromCurrentPlaylistById(...response.map(song => song));
          setPlaylistName('');
        })
        .catch(error => {
          console.log("Error in creating playlist and adding tracks: ", error);
        });
    };

    return (
      <Box>
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
                {(isXsScreen || isSmScreen) ? 'Back to collections' : 'Build new playlist'}
              </Typography>
            </div>
          }
        >
          <Button
            onClick={() => {
              (isXsScreen || isSmScreen) ? 
              handleBackToPlaylists() : 
              handleExploreMoreClick(false)
            }}
            sx={{
              color: 'white',
              background: `rgb(121, 44, 216, 0.3)`,
              border: '2px solid rgba(89, 149, 192, 0.5)',
              borderRadius: '18px',
              boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
              transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
              '&:hover, &:active, &.Mui-focusVisible': {
                background: `rgb(121, 44, 216, 0.5)`,
                boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
              },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3%',
              marginTop: '5%',
              minHeight: 'fit-content',
              width: '100%'
            }}
          >
            <Box display='flex'>
              {(isSmScreen ||isXsScreen) && (
                <KeyboardDoubleArrowLeftIcon 
                  style={{ color: theme.palette.primary.triadic2 }}
                  fontSize={'small'}
                />
              )}
              <Typography
                variant={isXsScreen ? 'caption' : 'subtitle1'}
                color='white'
                letterSpacing='1px'
                sx={{
                  cursor: 'pointer',
                }}
              >
                {(isSmScreen || isXsScreen) ? 'Back' : 'New Request'}
              </Typography>
              {!(isSmScreen ||isXsScreen) && (
                <KeyboardDoubleArrowUpIcon
                  style={{ color: theme.palette.primary.triadic2 }}
                />
              )}
            </Box>
          </Button>
        </Tooltip>
        <Card className={classes.sidePanel}>
          <CreateOrEditPlaylist 
            currentPlaylist={currentPlaylist}
            handleCreatePlaylist={handleCreatePlaylist}
            user={user}
            playlistName={playlistName}
            setPlaylistName={setPlaylistName}
            classes={classes}
            onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}
            navigate={navigate}
            playlists={playlists}
          />
        </Card>
      </Box>
    );
};

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
    playlists: state.playlist.playlists,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onCreatePlaylist: (userId, playlist) => dispatch(createPlaylistRequest(userId, playlist)),
  onAddToSavedPlaylist: (playlistId, userId, ...songs) => dispatch(addToSavedPlaylistRequest(playlistId, userId, ...songs)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RightPanel);