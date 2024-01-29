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
        height: '10vh', 
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

export const RightPanel = ({
    classes,
    handleCreatePlaylist,
    setPlaylistName,
    playlistName,
    handleBulkRemove,
    handlePlaylistSelectAll,
    currentPlaylist,
    songsToRemove,
    isPlaylistItemChecked,
    handlePlaylistSelectClick,
}) => {

    return (
        <Card className={classes.sidePanel}>
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
                title='Create Playlist'
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
          <Box>
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
                  <li className={classes.currentPlaylistUl}>
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
                          left: '6%',
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
        </Card>
    );
};