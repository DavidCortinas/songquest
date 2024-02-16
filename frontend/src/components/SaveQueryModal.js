import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { getSpotifyArtists, getSpotifyTracks } from "thunks";
import { toCapitalCase } from "utils";
import { autocompleteParam } from "./spotifyForm/SpotifyForm";

const SaveQueryModal = ({ 
  isModalOpen, 
  setIsModalOpen,
  onSaveQuery,
  queryName,
  handleQueryNameChange,
  savedQueries,
  onGetSpotifyTracks,
  onGetSpotifyArtists,
  user, 
  classes,
  parameters,
}) => {
  const [songsToSave, setSongsToSave] = useState([]);
  const [artistsToSave, setArtistsToSave] = useState([]);
  const [genresToSave, setGenrestToSave] = useState([]);
  console.log('modal')

    const memoizedFetchSong = useCallback(async () => {
        if (savedQueries.previous) {
        const queryToSave = savedQueries.previous;
        const songIdsToSave = queryToSave.songs;

        try {
            const songs = await onGetSpotifyTracks(user?.user.id, songIdsToSave);
            setSongsToSave(songs);
        } catch (error) {
            console.error('Error fetching Spotify tracks:', error.message);
        }
        }
    }, [onGetSpotifyTracks, savedQueries.previous]);

    const memoizedFetchArtists = useCallback(async () => {
        if (savedQueries.previous) {
        const queryToSave = savedQueries.previous;
        const artistIdsToSave = queryToSave.performers;

        try {
            const artists = await onGetSpotifyArtists(user?.user.id, artistIdsToSave);
            setArtistsToSave(artists);
        } catch (error) {
            console.error('Error fetching Spotify artists:', error.message);
        }
        }
    }, [onGetSpotifyArtists, savedQueries.previous]);

    useEffect(() => {
        if (isModalOpen) {
        memoizedFetchSong();
        }
    }, [isModalOpen, memoizedFetchSong]);

    useEffect(() => {
        if (isModalOpen) {
        memoizedFetchArtists();
        }
    }, [isModalOpen, memoizedFetchArtists]);

    const handleSaveClick = () => {
        onSaveQuery({
        name: queryName,
        queries: savedQueries.prevQuery,
        // songs: songsToSave,
        // artists: artistsToSave,
        });
        setIsModalOpen(false);
    };

    const formattedSongs = songsToSave?.map(song => {
        const albumImage = song.album.images[2]?.url || ''; // Use the third image or provide a default value
        const songName = song.name;
        const artists = song.artists.map(artist => artist.name).join(', ');

        return {
            id: song.id,
            label: `${songName} - ${artists}`,
            image: albumImage
        };
    });

    console.log('genres: ', savedQueries.previous.genres);
    console.log(parameters)

  return (
    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <Box
        sx={{
          backgroundColor: 'rgba(13,27,38,0.9)',
          color: 'white',
          border: '2px solid rgba(89, 149, 192, 0.5)',
          borderRadius: '18px',
          overflowY: 'auto',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50%',
          height: '80%',
          boxShadow: 24,
          p: 4,
        }}
        display='flex'
        flexDirection='column'
        alignItems='center'
      >
        <TextField
            label="Request Parameters Name"
            value={queryName}
            autoFocus
            onChange={handleQueryNameChange}
            required
            className={classes.textField}
            variant="standard"
            InputLabelProps={{ 
                style: { 
                    margin: '2px 5px',
                    color: 'white', 
                },
                sx: {
                    color: 'white',
                    backgroundColor: '#30313d',
                },
            }}
            InputProps={{ 
                disableUnderline: 'true', 
                style: { 
                    margin: '5px', 
                    padding: '5px 0', 
                    fill: 'white',
                },
                sx: {
                    color: 'white'
                },
            }}
        />
        <Button 
            onClick={handleSaveClick} 
            sx={{ marginTop: '1%' }}
            style={{ 
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
            }}
        >
            Save Parameters
        </Button>
        <Typography variant="h5" letterSpacing='1px' padding='2%'>
            Recommendation Sources
        </Typography>
        <Box display='flex' flexDirection='column' width='70%'>
            {formattedSongs && (
                <Box
                    display='flex'
                    justifyContent='space-between'
                    paddingTop='1%'
                    color='white'
                >
                    <Typography variant="h6" letterSpacing='1px'>
                        Songs
                    </Typography>
                    <Box width='40%'>
                        {formattedSongs.map((formattedSong) => (
                            <Box
                                display='flex'
                                alignItems='center'
                                padding='2%'
                            >
                                {formattedSong.image && (
                                    <img
                                        loading="lazy"
                                        width="40"
                                        src={formattedSong.image}
                                        alt=""
                                    />
                                )}
                                <Typography>
                                    {formattedSong.label}
                                </Typography>
                            </Box>
                        ))}    
                    </Box>    
                </Box>
            )}
            {artistsToSave && (
                <Box
                    display='flex'
                    justifyContent='space-between'
                    paddingTop='1%'
                    color='white'
                >
                    <Typography variant="h6" letterSpacing='1px'>
                        Artists
                    </Typography>
                    <Box width='40%'>
                        {artistsToSave.map((artistToSave) => (
                            <Box
                                display='flex'
                                alignItems='center'
                                padding='2%'
                            >
                                {artistToSave.images && (
                                    <img
                                        loading="lazy"
                                        width="40"
                                        src={artistToSave.images[2].url}
                                        alt=""
                                    />
                                )}
                                <Typography>
                                    {artistToSave.name}
                                </Typography>
                            </Box>
                        ))}    
                    </Box>    
                </Box>
            )}
            {savedQueries.previous.genres.length > 0 && (
                <Box
                    display='flex'
                    justifyContent='space-between'
                    paddingTop='1%'
                    color='white'
                >
                    <Typography variant="h6" letterSpacing='1px'>
                        Genres
                    </Typography>
                    <Box display='flex' width='40%' alignItems='center'>
                        <Typography>
                            {savedQueries.previous.genres?.map(genre => toCapitalCase(genre)).join(', ')}
                        </Typography>
                    </Box>  
                </Box>
            )}
            {Object.keys(parameters).some(
                parameter => savedQueries.previous[parameter] &&
                    !autocompleteParam.includes(parameter) &&
                    savedQueries.previous[parameter].min !== null &&
                    savedQueries.previous[parameter].target !== null &&
                    savedQueries.previous[parameter].max !== null
            ) && (
                <>
                    <Typography 
                        variant="h5" 
                        letterSpacing='1px' 
                        padding='2%' 
                        textAlign='center'
                    >
                        Fine Tuning Parameters
                    </Typography>
                    <Box display='flex' justifyContent='space-between' paddingLeft='30%'>
                        <Typography>
                            Min
                        </Typography>
                        <Typography paddingLeft='4%'>
                            Target
                        </Typography>
                        <Typography>
                            Max
                        </Typography>
                    </Box>
                    {Object.keys(parameters).map(
                        parameter => savedQueries.previous[parameter] && 
                        !autocompleteParam.includes(parameter) && 
                        savedQueries.previous[parameter].min !== null &&
                        savedQueries.previous[parameter].target !== null &&
                        savedQueries.previous[parameter].max !== null && (
                            <Box
                                display='flex'
                                justifyContent='space-between'
                                paddingTop='1%'
                                color='white'
                                alignItems='end'
                            >
                                <Typography variant="h6" letterSpacing='1px'>
                                    {toCapitalCase(parameter)}
                                </Typography>
                                <Box 
                                    display='flex' 
                                    justifyContent='space-between' 
                                    width='70%'
                                    alignItems='start'
                                >
                                    <Box>
                                        <Typography textAlign='center'>
                                            {savedQueries.previous[parameter].min}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography textAlign='center'>
                                            {savedQueries.previous[parameter].target}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography textAlign='center'>
                                            {savedQueries.previous[parameter].max}
                                        </Typography>
                                    </Box>
                                </Box>  
                            </Box>
                        )
                    )}
                </>
            )}
        </Box>
      </Box>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    error: state.discovery.error,
    recommendations: state.discovery.recommendations,
    dataLoaded: state.discovery.dataLoaded,
    user: state.user.currentUser,
    currentPlaylist: state.playlist.currentPlaylist,
    savedQueries: state.discovery.savedQueries,
  };
};

const mapDispatchToProps = (dispatch) => ({
    onGetSpotifyTracks: (userId, spotifyIds) => dispatch(getSpotifyTracks(userId, spotifyIds)),
    onGetSpotifyArtists: (userId, artistIds) => dispatch(getSpotifyArtists(userId, artistIds)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SaveQueryModal);