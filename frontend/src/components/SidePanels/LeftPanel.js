import { 
    Box, 
    Button, 
    Card, 
    Checkbox, 
    Tooltip, 
    Typography 
} from "@mui/material";
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { useNavigate } from "react-router-dom";
import getPlaylistItems from "utils/playlist";
import useStyles from "classes/playlist";
import { connect } from "react-redux";
import { deletePlaylist } from "actions";

const PlaylistCard = ({ classes, item, index, playlist }) => {
  const playlistName = item?.name
  const navigate = useNavigate();

  const handlePlaylistClick = () => {
    navigate(`/playlist/${playlist.id}`);
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
            boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
          }}
        >
          {getPlaylistItems(playlist).map((item, index) => (
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
                {playlistName}
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
    </Tooltip>
  );
};

export const LeftPanel = ({
    onDeletePlaylist,
    playlists,
}) => {
    const classes = useStyles();
    const handleDeletePlaylist = (playlistId) => {
      onDeletePlaylist(playlistId)
    };
    console.log(playlists)

    return (
        <Card className={classes.sidePanel}>
          <Box 
            display='flex' 
            alignItems='center' 
            justifyContent='space-between'
            padding='20px 0 20px 20px'
          >
            <Tooltip
              title='Select all playlists'
            >
              <Checkbox sx={{ padding: '0px', color: 'white' }}/>
            </Tooltip>
            <Typography 
              variant='caption1' 
              textAlign='center'
              width='100%' 
              letterSpacing='2px'
              sx={{ flex: 1, marginLeft: 4 }}
            >
              Manage Your Playlists
            </Typography>
            <Tooltip
              title='Delete selected playlists'
            >
              <Button
                // sx={{ padding: '0 0 0 20px'}}
                onClick={() => handleDeletePlaylist()}
              >
                <PlaylistRemoveIcon />
              </Button>
            </Tooltip>
          </Box>
          {playlists?.length === 0 ? (
            <>
              <Typography 
                variant='subtitle2' 
                textAlign='center' 
                padding='20px'
                letterSpacing='1px'
              >
                You have not created any playlists. 
              </Typography>
              <Typography 
                variant='subtitle2' 
                textAlign='center' 
                padding='20px'
                letterSpacing='1px'
              >
                Use tokens to create playlists and share your finds. 
              </Typography>
            </>
          ) : (
            <ul
              style={{ 
                padding: '0px', 
                display: 'flex', 
                flexDirection: 'column', 
              }}
            >                
              {playlists?.map((playlist, index) => {
                return (
                  <Box 
                    display='flex' 
                    flexDirection='column'
                    alignItems='center'
                    paddingBottom='10px'
                    position='relative'
                  >
                    <li key={index} style={{ listStyle: 'none' }}>
                      <PlaylistCard 
                        item={playlist} 
                        playlist={playlist}
                        index={index}
                        classes={classes}
                      />
                    </li>
                  </Box>
                )}
              )}
            </ul>
          )}
        </Card>
    )
};

const mapStateToProps = (state) => {
  return {
    playlists: state.playlist.playlists,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onDeletePlaylist: (playlistId) => dispatch(deletePlaylist(playlistId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftPanel);