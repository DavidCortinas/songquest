import { 
    Box, 
    Button, 
    Card, 
    Checkbox, 
    Tooltip, 
    Typography 
} from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import EditNoteIcon from '@mui/icons-material/EditNote';
import getPlaylistItems from "utils/playlist";
import useStyles from "classes/playlist";
import { connect } from "react-redux";
import { addToCurrentPlaylist, deletePlaylist, resetCurrentPlaylist } from "actions";
import theme from "theme";

const PlaylistCard = ({ 
  classes, 
  index, 
  userPlaylist, 
  onAddToCurrentPlaylist 
}) => {
  const playlistName = userPlaylist?.name

  const handlePlaylistClick = () => {
    onAddToCurrentPlaylist(...userPlaylist.songs);
  };

  return (
    <Tooltip 
      title={
        <div
          style={{
            maxHeight: '25vh', // Set the max height for the tooltip content
            overflowY: 'auto', // Allow scrolling for overflow
            padding: '8px',
            borderRadius: '8px',
          }}
        >
          <Box display='flex' alignItems='center'>
            <EditNoteIcon />
            <Typography variant='body2' letterSpacing='1px' paddingLeft='2%'>
              {`${playlistName.toUpperCase()}`}
            </Typography>
          </Box>
          {getPlaylistItems(userPlaylist)?.map((item, index) => (
            <Typography key={index} variant='body2' letterSpacing='1px'>
              {item}
            </Typography>
          ))}
        </div>
      }
      arrow
    >
      <Card
        onClick={handlePlaylistClick}
        key={index} 
        className={classes.panelCard}
      >
        <Typography
          noWrap  
          variant='subtitle2' 
          color='white'
          letterSpacing='1px'
          textAlign='start'
          sx={{
            fontWeight: 'bold',
            maxHeight: '30%',
            maxWidth: '65%',
            overflowY: 'hidden',
            cursor: 'pointer',
          }}
        >
          {playlistName}
        </Typography>
        <img 
          src='/static/images/Spotify_Icon_RGB_White.png' 
          style={{ 
            maxWidth: '8%', 
            height: 'auto',
            position: 'absolute',
            right: '5%',
            bottom: '24%',
          }}
        />
      </Card>
    </Tooltip>
  );
};

export const LeftPanel = ({
  userPlaylists,
  onAddToCurrentPlaylist,
  onDeletePlaylist,
  onResetCurrentPlaylist,
  selectedPlaylistOption,
  handleSelectUseTokens,
}) => {
  const classes = useStyles();
  
  const handleDeletePlaylist = (playlistId) => {
    onDeletePlaylist(playlistId)
  };

  const handleSelectNewPlaylist = () => {
    onResetCurrentPlaylist();
  };
  
  return (
    <Box 
      display='flex' 
      flexDirection='column'
      alignItems='center'
      paddingBottom='5%'
      position='relative'
    > 
      {/* <li style={{ listStyle: 'none' }}> */}
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
              {'Build new playlist'}
            </Typography>
          </div>
        }
      >
        <Button
          onClick={handleSelectNewPlaylist}
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
            ...(selectedPlaylistOption === 'create' && {
              border: '2px solid rgba(89, 149, 192, 0.5)',
            }),
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
          <Box display='flex' width='100%' justifyContent='center'>
            <Typography
              variant='subtitle1'
              color='white'
              letterSpacing='1px'
              sx={{
                cursor: 'pointer',
              }}
            >
              New Playlist
            </Typography>
            <AutoAwesomeIcon
              style={{ 
                color: theme.palette.primary.complementary,
                paddingLeft: '2%', 
              }}
            />
          </Box>
        </Button>
      </Tooltip>
      {/* </li> */}
      <Card className={classes.sidePanel}>
        <ul
          style={{ 
            padding: '0px', 
            display: 'flex', 
            flexDirection: 'column', 
          }}
        > 
          {/* <Box 
            display='flex' 
            flexDirection='column'
            alignItems='center'
            paddingBottom='5%'
            position='relative'
          >         */}
            {/* <li style={{ listStyle: 'none' }}>
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
                      {'Build new playlist'}
                    </Typography>
                  </div>
                }
              >
                <Card
                  onClick={handleSelectNewPlaylist}
                  className={classes.panelCard}
                  sx={
                    selectedPlaylistOption === 'create' && 
                    { 
                      border: '2px solid rgba(89, 149, 192, 0.5)' 
                    }
                  }
                >
                    <Box padding='0 5% 0'>
                        <Typography  
                          variant='subtitle1' 
                          color='white'
                          letterSpacing='1px'
                          sx={{
                            fontWeight: 'bold',
                            maxHeight: '30%',
                            maxWidth: '100%',
                            cursor: 'pointer',
                          }}
                        >
                          New Playlist
                        </Typography>
                    </Box>
                    <AutoAwesomeIcon 
                      style={{ color: theme.palette.primary.complementary }}
                    />
                </Card>
              </Tooltip>
            </li> */}
            <Box 
              display='flex' 
              alignItems='center' 
              justifyContent='space-between'
              padding='5% 0 5% 6%'
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
                      {'Select all playlists'}
                    </Typography>
                  </div>
                }
              >
                <Checkbox sx={{ padding: '0px', color: theme.palette.primary.white }}/>
              </Tooltip>
              <Typography 
                variant='caption1' 
                textAlign='center'
                width='100%' 
                letterSpacing='2px'
                sx={{ flex: 1, marginLeft: 5 }}
              >
                Edit Playlists
              </Typography>
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
                      {'Delete selected playlists'}
                    </Typography>
                  </div>
                }
              >
                <Button
                  // sx={{ padding: '0 0 0 20px'}}
                  onClick={() => handleDeletePlaylist()}
                >
                  <PlaylistRemoveIcon 
                    style={{ color: theme.palette.primary.white }}
                  />
                </Button>
              </Tooltip>
            </Box>            
            {
              userPlaylists.length == 0 ? (
                <Typography 
                  variant='subtitle1' 
                  textAlign='center' 
                  padding='10%'
                  letterSpacing='2px'
                >
                  You have not created any playlists 
                </Typography>
              ) : userPlaylists?.map((userPlaylist, index) => {
                return (
                  <Box 
                    display='flex' 
                    flexDirection='column'
                    alignItems='center'
                    paddingBottom='10px'
                  >
                    <li 
                      key={index} 
                      style={{ listStyle: 'none', position: 'relative' }}
                    >
                      <Checkbox
                        icon={<CircleIcon sx={{ color: '#d2dce1', opacity: '0.5' }} />}
                        checkedIcon={<CheckCircleIcon color='info' />}                       
                        // onClick={() => handlePlaylistSelectClick(item)}
                        // checked={isPlaylistItemChecked(item)}
                        sx={{
                          color: 'white',
                          position: 'absolute',
                          top: '10%',
                          left: '5%',
                          zIndex: '2',
                          paddingLeft: '0px',
                        }}
                      />
                      <PlaylistCard 
                        userPlaylist={userPlaylist}
                        onAddToCurrentPlaylist={onAddToCurrentPlaylist}
                        index={index}
                        classes={classes}
                      />
                    </li>
                  </Box>
                )
              }
            )}
        </ul>
      </Card>
    </Box>
  )
};

const mapStateToProps = (state) => {
return {
  userPlaylists: state.playlist.playlists,
};
};

const mapDispatchToProps = (dispatch) => ({
  onAddToCurrentPlaylist: (...songs) => dispatch(addToCurrentPlaylist(...songs)),
  onDeletePlaylist: (playlistId) => dispatch(deletePlaylist(playlistId)),
  onResetCurrentPlaylist: () => dispatch(resetCurrentPlaylist()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftPanel);