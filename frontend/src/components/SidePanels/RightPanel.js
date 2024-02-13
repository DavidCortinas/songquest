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
import { lazy } from "react";

const Playlist = lazy(() => import('../Playlist'));

const PlaylistItemCard = ({ item, key }) => {
  const songName = item?.name
  const artists = item?.artists.join(', ');
  console.log(item)
  console.log(artists)
  const imgUrl = item?.image  
  console.log(imgUrl)
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
          noWrap  
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
          noWrap
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
  handleSelectUseTokens,
  user,
  setPlaylistName,
  playlistName,
  onRemoveFromCurrentPlaylistById,
}) => {
  const isPlaylistItemChecked = (item) => {
    console.log(item)
    console.log(songsToRemove)
    return songsToRemove.some(song => song === item.id);
  };

  const [songsToRemove, setSongsToRemove] = useState([]);

  const handleBulkRemove = () => {
    onRemoveFromCurrentPlaylistById(...songsToRemove.map(songId => songId));
  };

    const playlistItemInSongsToRemove = (id) => {
    return songsToRemove.some(obj => obj.id === id)
  };

  const handlePlaylistSelectClick = (item) => {
    console.log(item)
    if (playlistItemInSongsToRemove(item.id)) {
      setSongsToRemove(songsToRemove.filter(song => song.id !== item.id));
    } else {
      setSongsToRemove([...songsToRemove, item.id])
    };
  };
  console.log(songsToRemove)

  const handlePlaylistSelectAll = () => {
    console.log('handle')
    if (songsToRemove.length === 0) {
        setSongsToRemove(currentPlaylist.map(song => song.id));
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
                  {user?.user.spotify_connected ? 
                  'Create Playlist' : 
                  'Connect to Spotify to create playlists'}
                </Typography>
              </div>
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
            <Button onClick={handlePlaylistSelectAll}>
              <Typography variant='subtitle2'>
                {songsToRemove.length === 0 ? 'Select All' : 'Deselect All'}
              </Typography>
            </Button>
          </Tooltip>
          {/* <Tooltip
            title='Back to main panel'
          >
            <Button onClick={handleBackToMainPanel}>
              <Typography variant='subtitle2'>
                {'Back'}
              </Typography>
              <KeyboardDoubleArrowRightIcon />
            </Button>
          </Tooltip> */}
        </Box>
      </Box>
      <ul 
        style={{ 
          padding: '0px', 
          display: 'flex', 
          flexDirection: 'column', 
        }}
      >
        {currentPlaylist.length > 0 ? currentPlaylist.map((item, index) => (
          <Box 
            display='flex' 
            flexDirection='column'
            alignItems='center'
            paddingBottom='10px'
            position='relative'
          >
            <li key={index} className={classes.currentPlaylistUl}>
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
                    top: '20%',
                    left: '4%',
                    zIndex: '2',
                    paddingLeft: '0px',
                  }}
                />
              </Tooltip>
              <PlaylistItemCard item={item} key={item.id} />
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
              {user?.user.spotify_connected ? (
                <Typography 
                  variant='subtitle1' 
                  textAlign='center' 
                  padding='20px'
                  letterSpacing='2px'
                >
                  Start exploring new music to unearth new gems and add them to your collection...
                </Typography>
              ) : (
                <>
                  <Typography 
                    variant='subtitle1' 
                    textAlign='center' 
                    padding='20px'
                    letterSpacing='2px'
                  >
                    Connect to Spotify to earn tokens and start creating playlists
                  </Typography>
                  <li style={{ listStyle: 'none' }}>
                    <Card
                      onClick={handleSelectUseTokens}
                      className={classes.panelCard}
                      // sx={
                        //   selectedPlaylistOption === 'create' && 
                        //   { 
                          //     border: '2px solid rgba(89, 149, 192, 0.5)' 
                          //   }
                          // }
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
      onCreatePlaylist,
      onAddToSavedPlaylist,
      onRemoveFromCurrentPlaylistById,
      selectedPlaylistOption,
  }) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [playlistName, setPlaylistName] = useState('');

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
              image: track.album.images[2].url
            }
          });

          return onAddToSavedPlaylist(playlistId, user?.user.id, playlistTracks);
        })
        .then(response => {
          console.log("Playlist created and tracks added", response);
          onRemoveFromCurrentPlaylistById(...response.map(song => song));
          setPlaylistName('');
        })
        .catch(error => {
          console.log("Error in creating playlist and adding tracks: ", error);
        });
    };
    console.log(currentPlaylist)

    return (
        <Card className={classes.sidePanel}>
          <CreatePlaylist 
            currentPlaylist={currentPlaylist}
            handleCreatePlaylist={handleCreatePlaylist}
            user={user}
            playlistName={playlistName}
            setPlaylistName={setPlaylistName}
            classes={classes}
            onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}
          />
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