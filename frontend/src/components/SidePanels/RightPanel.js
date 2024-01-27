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
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';

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
                    marginLeft: '5px'
                  }
                }}
                InputProps={{
                  sx: {
                    color: 'white',
                    marginLeft: '5px'
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
            <Tooltip
              title={songsToRemove.length === 0 ? 'Select all tracks in current playlist' : 'Deselect All From Playlist'}
            >
              <Button onClick={handlePlaylistSelectAll}>
                <Typography variant='subtitle2'>
                  {songsToRemove.length === 0 ? 'Select All From Playlist' : 'Deselect All From Playlist'}
                </Typography>
              </Button>
            </Tooltip>
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
                        onClick={() => handlePlaylistSelectClick(item)}
                        checked={isPlaylistItemChecked(item)}
                        sx={{
                          color: 'white',
                          position: 'absolute',
                          top: '0',
                          left: '3px',
                          zIndex: '2',
                          padding: '0px',
                        }}
                      />
                    </Tooltip>
                    <iframe
                      key={index}
                      src={`https://open.spotify.com/embed/track/${item.id}?utm_source=generator&theme=0`}
                      width={'90%'}
                      height="160"
                      frameBorder="0"
                      allowFullScreen=""
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy" 
                    />
                  </li>
                </Box>
              ))}
            </ul>
          ) : (
            <>
              <Typography variant='subtitle2' textAlign='center' padding='20px'>
                Use tokens to create playlists and share your finds.
              </Typography>
              <Typography 
                textAlign='center' 
                padding='20px'
                variant='subtitle2'
              >
                Explore new music and start creating new playlists now.
              </Typography>
            </>
          )}
        </Card>
    )
}