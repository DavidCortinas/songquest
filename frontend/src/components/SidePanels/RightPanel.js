import { 
    Box, 
    Button, 
    Card, 
    Checkbox, 
    TextField, 
    Tooltip, 
    Typography
} from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import useStyles from "classes/playlist";
import { useState } from "react";
import { connect } from "react-redux";
import { addToSavedPlaylistRequest, createPlaylistRequest } from "thunks";
import { useNavigate } from "react-router-dom";

const MainPanel = ({
  classes,
  handleCreatePlaylistClick,
  handleAddToPlaylistClick,
}) => {
  return (
    <Box 
      display='flex' 
      flexDirection='column'
      alignItems='center' 
      justifyContent='space-between'
      padding='20px'
    >
      <Box
        display='flex' 
        alignItems='center' 
        justifyContent='space-between'
        paddingBottom='2%'
      >
        <Typography 
          variant='caption1' 
          textAlign='center' 
          letterSpacing='2px'
        >
          AI Powered Music Discovery
        </Typography>
      </Box>
      <ul
        style={{ 
          padding: '0px', 
          display: 'flex', 
          flexDirection: 'column', 
        }}
      >
        <Box 
          display='flex' 
          flexDirection='column'
          alignItems='center'
          paddingBottom='10px'
          position='relative'
          sx={{ marginBottom: '10px' }}
        >
          <li key='' style={{ listStyle: 'none' }}>
            <Tooltip
              title={
                <div
                  style={{
                    maxHeight: '25vh', // Set the max height for the tooltip content
                    overflowY: 'auto', // Allow scrolling for overflow
                    padding: '8px',
                    borderRadius: '8px',
                    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
                  }}
                >
                    <Typography variant='body2' letterSpacing='1px'>
                      Create a new playlist
                    </Typography>
                </div>
              }
            >
              <Card 
                className={classes.panelCard} 
                sx={{ marginBottom: '5%' }}
                onClick={handleCreatePlaylistClick}
              >
                <Box>
                    <Typography  
                      variant='subtitle1' 
                      color='white'
                      letterSpacing='1px'
                      sx={{
                        fontWeight: 'bold',
                        maxHeight: '30%',
                        maxWidth: '100%',
                        overflowY: 'auto',
                        cursor: 'pointer',
                      }}
                    >
                      Create Playlist
                    </Typography>
                </Box>
              </Card>
            </Tooltip>
          </li>
          <li key='' style={{ listStyle: 'none' }}>
            <Tooltip
              title={
                <div
                  style={{
                    maxHeight: '25vh', // Set the max height for the tooltip content
                    overflowY: 'auto', // Allow scrolling for overflow
                    padding: '8px',
                    borderRadius: '8px',
                    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
                  }}
                >
                    <Typography variant='body2' letterSpacing='1px'>
                      Add to existing playlist
                    </Typography>
                </div>
              }
            >
              <Card 
                className={classes.panelCard} 
                sx={{ height: '150px' }}
                onClick={handleAddToPlaylistClick}
              >
                <Box>
                    <Typography  
                      variant='subtitle1' 
                      color='white'
                      letterSpacing='1px'
                      sx={{
                        fontWeight: 'bold',
                        maxHeight: '30%',
                        maxWidth: '100%',
                        overflowY: 'auto',
                        cursor: 'pointer',
                      }}
                    >
                      Add To Playlist
                    </Typography>
                </Box>
              </Card>
            </Tooltip>
          </li>
        </Box>
      </ul>
    </Box>
  )
};

const PlaylistItemCard = ({ item, key }) => {
  const songName = item?.name
  const artists = item?.artists.map(artist => artist.name).join(', ');
  const imgUrl = item?.album.images[2].url

  return (
    <Card 
      key={key} 
      sx={{ 
        display: 'flex', 
        width: '18vw',
        height: '11vh', 
        // alignItems: 'center' ,
        overflow: 'hidden',
        borderRadius: '8px',
        backgroundColor: '#282828',
        boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
        opacity: '0.9',
        paddingLeft: '2%',
      }}>
      <img 
        src={imgUrl} 
        style={{
          maxWidth: '100%',       
          height: 'auto',
          padding: '2% 2% 2% 2vw',         
        }} 
      />
      <Box>
        <Typography  
          variant='subtitle2' 
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
          variant='subtitle2' 
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
          right: 20,
          bottom:15,
        }}
      />
    </Card>
  );
};

const CreatePlaylist = ({
  classes,
  currentPlaylist,
  handleCreatePlaylist,
  user,
  setPlaylistName,
  playlistName,
  onRemoveFromCurrentPlaylist,
  handleBackToMainPanel,
}) => {
  const isPlaylistItemChecked = (item) => {
    return songsToRemove.some(song => song.id === item.id);
  };

  const [songsToRemove, setSongsToRemove] = useState([]);

  const handleBulkRemove = () => {
    onRemoveFromCurrentPlaylist(...songsToRemove);
  };

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
      };
  };

  return (
    <>
      <Box
        display='flex'
        flexDirection='column'
      >
        <Box 
          display='flex' 
          justifyContent='center'
          alignItems='center'
          marginTop='10px'
        >
          <Tooltip
            title={user?.user.spotify_connected ? 
              'Create Playlist' : 
              'Connect to Spotify to create playlists'
            }
          >
            <Button onClick={handleCreatePlaylist}>
              <AutoAwesomeIcon />
            </Button>
          </Tooltip>
          <TextField 
            label='Playlist Name' 
            variant='standard' 
            required
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className={classes.playlistField}
            InputLabelProps={{
              sx: {
                color: 'white',
                marginLeft: '5px',
                fontSize: '80%',
              }
            }}
            InputProps={{
              sx: {
                color: 'white',
                marginLeft: '5px',
                fontSize: '90%'
              }
            }}
          />
          <Tooltip
            title='Clear selected from playlist'
          >
            <Button onClick={handleBulkRemove}>
              <PlaylistRemoveIcon />
            </Button>
          </Tooltip>
        </Box>
        <Box 
          display='flex' 
          justifyContent='space-between'
          padding='0 4% 0 0'
        >
          <Tooltip
            title={
              songsToRemove.length === 0 ? 
              'Select all tracks in current playlist' : 
              'Deselect all tracks in current playlist'
            }
          >
            <Button onClick={handlePlaylistSelectAll}>
              <Typography variant='subtitle2'>
                {songsToRemove.length === 0 ? 'Select All' : 'Deselect All'}
              </Typography>
            </Button>
          </Tooltip>
          <Tooltip
            title='Back to main panel'
          >
            <Button onClick={handleBackToMainPanel}>
              <Typography variant='subtitle2'>
                {'Back'}
              </Typography>
              <KeyboardDoubleArrowRightIcon />
            </Button>
          </Tooltip>
        </Box>
      </Box>
      {currentPlaylist.length > 0 ? (
        <ul 
          style={{ 
            padding: '0px', 
            display: 'flex', 
            flexDirection: 'column', 
          }}
        >
          {currentPlaylist.map((item, index) => (
            <Box 
              display='flex' 
              flexDirection='column'
              alignItems='center'
              paddingBottom='10px'
              position='relative'
            >
              <li key={index} className={classes.currentPlaylistUl}>
                <Tooltip
                  title='Select song from playlist'
                >
                  <Checkbox
                    icon={<CircleIcon sx={{ color: '#d2dce1', opacity: '0.5' }} />}
                    checkedIcon={<CheckCircleIcon color='info' />}                       
                    onClick={() => handlePlaylistSelectClick(item)}
                    checked={isPlaylistItemChecked(item)}
                    sx={{
                      color: 'white',
                      position: 'absolute',
                      top: '20%',
                      left: '4%',
                      zIndex: '2',
                      paddingLeft: '0px',
                    }}
                  />
                </Tooltip>
                <PlaylistItemCard item={item} key={item.id} />
              </li>
            </Box>
          ))}
        </ul>
      ) : (
        <>
          <Typography 
            variant='subtitle2' 
            textAlign='center' 
            padding='20px'
            letterSpacing='1px'
          >
            Use tokens to create playlists and share your finds.
          </Typography>
          <Typography 
            textAlign='center' 
            padding='20px'
            variant='subtitle2'
            letterSpacing='1px'
          >
            Explore new music and start creating new playlists now.
          </Typography>
        </>
      )}
    </>
  )
};

const AddToPlaylist = ({
  classes,
  currentPlaylist,
  user,
  setPlaylistName,
  playlistName,
  onRemoveFromCurrentPlaylist,
  handleBackToMainPanel,
}) => {
  const isPlaylistItemChecked = (item) => {
    return songsToRemove.some(song => song.id === item.id);
  };

  const [songsToRemove, setSongsToRemove] = useState([]);

  const handleBulkRemove = () => {
    onRemoveFromCurrentPlaylist(...songsToRemove);
  };

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
      };
  };

  return (
    <>
      <Box
        display='flex'
        flexDirection='column'
      >
        <Box 
          display='flex' 
          justifyContent='center'
          alignItems='center'
          marginTop='10px'
        >
          {/* <Tooltip
            title={user?.user.spotify_connected ? 
              'Create Playlist' : 
              'Connect to Spotify to create playlists'
            }
          >
            <Button onClick={handleCreatePlaylist}>
              <AutoAwesomeIcon />
            </Button>
          </Tooltip> */}
          <TextField 
            label='Playlist Name' 
            variant='standard' 
            required
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className={classes.playlistField}
            InputLabelProps={{
              sx: {
                color: 'white',
                marginLeft: '5px',
                fontSize: '80%',
              }
            }}
            InputProps={{
              sx: {
                color: 'white',
                marginLeft: '5px',
                fontSize: '90%'
              }
            }}
          />
          <Tooltip
            title='Clear selected from playlist'
          >
            <Button onClick={handleBulkRemove}>
              <PlaylistRemoveIcon />
            </Button>
          </Tooltip>
        </Box>
        <Box 
          display='flex' 
          justifyContent='space-between'
          padding='0 4% 0 0'
        >
          <Tooltip
            title={
              songsToRemove.length === 0 ? 
              'Select all tracks in current playlist' : 
              'Deselect all tracks in current playlist'
            }
          >
            <Button onClick={handlePlaylistSelectAll}>
              <Typography variant='subtitle2'>
                {songsToRemove.length === 0 ? 'Select All' : 'Deselect All'}
              </Typography>
            </Button>
          </Tooltip>
          <Tooltip
            title='Back to main panel'
          >
            <Button onClick={handleBackToMainPanel}>
              <Typography variant='subtitle2'>
                {'Back'}
              </Typography>
              <KeyboardDoubleArrowRightIcon />
            </Button>
          </Tooltip>
        </Box>
      </Box>
      {currentPlaylist.length > 0 ? (
        <ul 
          style={{ 
            padding: '0px', 
            display: 'flex', 
            flexDirection: 'column', 
          }}
        >
          {currentPlaylist.map((item, index) => (
            <Box 
              display='flex' 
              flexDirection='column'
              alignItems='center'
              paddingBottom='10px'
              position='relative'
            >
              <li key={index} className={classes.currentPlaylistUl}>
                <Tooltip
                  title='Select song from playlist'
                >
                  <Checkbox
                    icon={<CircleIcon sx={{ color: '#d2dce1', opacity: '0.5' }} />}
                    checkedIcon={<CheckCircleIcon color='info' />}                       
                    onClick={() => handlePlaylistSelectClick(item)}
                    checked={isPlaylistItemChecked(item)}
                    sx={{
                      color: 'white',
                      position: 'absolute',
                      top: '20%',
                      left: '4%',
                      zIndex: '2',
                      paddingLeft: '0px',
                    }}
                  />
                </Tooltip>
                <PlaylistItemCard item={item} key={item.id} />
              </li>
            </Box>
          ))}
        </ul>
      ) : (
        <>
          <Typography 
            variant='subtitle2' 
            textAlign='center' 
            padding='20px'
            letterSpacing='1px'
          >
            Use tokens to create playlists and share your finds.
          </Typography>
          <Typography 
            textAlign='center' 
            padding='20px'
            variant='subtitle2'
            letterSpacing='1px'
          >
            Explore new music and start creating new playlists now.
          </Typography>
        </>
      )}
    </>
  )
};

  export const RightPanel = ({
      currentPlaylist,
      user,
      onCreatePlaylist,
      onAddToSavedPlaylist,
      onRemoveFromCurrentPlaylist,
  }) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] =  useState('');
    const [playlistName, setPlaylistName] = useState('');

    const handleCreatePlaylistClick = () => {
      setSelectedOption('create');
    };

    const handleAddToPlaylistClick = () => {
      setSelectedOption('add');
    };

    const handleBackToMainPanel = () => {
      setSelectedOption('');
    };

    const handleCreatePlaylist = () => {
      if (!user?.user.spotify_connected) {
        navigate('/spotify-connect')
      };

      const newPlaylist = {
        name: playlistName, 
        tracks: currentPlaylist
      }

      onCreatePlaylist(user?.user.id, newPlaylist)
        .then(createdPlaylist => {
          const playlistId = createdPlaylist.id;
          const playlistTracks = newPlaylist.tracks.map(track => {
            return {
              name: track.name,
              artists: track.artists,
              spotifyId: track.id,
              isrc: track.external_ids.isrc,
            }
          });

          return onAddToSavedPlaylist(playlistId, user?.user.id, playlistTracks);
        })
        .then(response => {
          console.log("Playlist created and tracks added", response);
          onRemoveFromCurrentPlaylist(...response.songs);
          setPlaylistName('');
        })
        .catch(error => {
          console.log("Error in creating playlist and adding tracks: ", error);
        });
    };

    return (
        <Card className={classes.sidePanel}>
          {selectedOption === 'create' ? (
            <CreatePlaylist 
              currentPlaylist={currentPlaylist}
              handleCreatePlaylist={handleCreatePlaylist}
              user={user}
              playlistName={playlistName}
              setPlaylistName={setPlaylistName}
              classes={classes}
              onRemoveFromCurrentPlaylist={onRemoveFromCurrentPlaylist}
              handleBackToMainPanel={handleBackToMainPanel}
            />
          ) : selectedOption === 'add' ? (
            <AddToPlaylist 
              classes={classes}
              currentPlaylist={currentPlaylist}
              user={user}
              setPlaylistName={setPlaylistName}
              playlistName={playlistName}
              onRemoveFromCurrentPlaylist={onRemoveFromCurrentPlaylist}
              handleBackToMainPanel={handleBackToMainPanel}    
            />
          ) : (
            <MainPanel 
              classes={classes} 
              handleAddToPlaylistClick={handleAddToPlaylistClick}
              handleCreatePlaylistClick={handleCreatePlaylistClick}
            />
          )}
        </Card>
    );
};

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onCreatePlaylist: (userId, playlist) => dispatch(createPlaylistRequest(userId, playlist)),
  onAddToSavedPlaylist: (playlistId, userId, ...songs) => dispatch(addToSavedPlaylistRequest(playlistId, userId, ...songs)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RightPanel);