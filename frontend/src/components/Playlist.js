import { Box, Checkbox, Tooltip, Typography } from "@mui/material";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { makeStyles } from "@mui/styles";
import LeftPanel from "./sidePanels/LeftPanel";

const useStyles = makeStyles(() => (
    {
        playlistItems: {
            display: 'flex',
            alignItems: 'start',
            listStyle: 'none',
            width: '100%',
        },
        playlistItemsUl: {
            width: '100%'
        },
        container: {
            display: 'flex',
            width: '100%',
            paddingLeft: '5vw' 
        },
    }
));

export const Playlist = ({ playlists }) => {
    const classes = useStyles();

    const { id } = useParams();
    const playlistId = parseInt(id, 10)
    const playlist = playlists.find(playlist => playlist.id === playlistId)
    console.log(playlist)

    return (
        <>
            {/* <Typography color='white' variant='h5' textAlign='center'>
                Playlist Dashboard
            </Typography> */}
            <Box className={classes.container}>
                <LeftPanel />
                <Box 
                    display='flex' 
                    justifyContent='center' 
                    flexDirection='column'
                    alignItems='center'
                    width='60vw'
                >
                    <Typography color='white' variant="h6" letterSpacing='1px'>
                        {playlist?.name}
                    </Typography>
                    <ul className={classes.playlistItemsUl}>
                        {playlist?.songs.map((song, index) => 
                            <li className={classes.playlistItems} key={index}>
                                <Checkbox 
                                    icon={<CircleIcon color='primary' />}
                                    checkedIcon={<CheckCircleIcon color='info' />}
                                    // onClick={handleSelectClick}
                                    // checked={isChecked}
                                />
                                <iframe
                                    src={`https://open.spotify.com/embed/track/${song.spotify_id}?utm_source=generator`}
                                    width='100%'
                                    height="100%"
                                    frameBorder="0"
                                    allowFullScreen=""
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy" 
                                />
                                <Box>
                                    {/* <Tooltip
                                        arrow
                                        title={user?.user.spotify_connected && !recommendationInPlaylist ? 
                                        "Add to current playlist" :
                                        recommendationInPlaylist ?
                                        "Remove from current playlist" :
                                        "Login to create playlists and more"
                                        }
                                    >
                                        <Button onClick={handleAddToPlaylistClick}>
                                        {recommendationInPlaylist ? 
                                            <RemoveIcon /> :
                                            <AddIcon />
                                        }
                                        </Button>
                                    </Tooltip> */}
                                </Box>
                            </li>
                        )}
                    </ul>
                </Box>
            </Box>
        </>
    );
};

const mapStateToProps = (state) => {
  return {
    playlists: state.playlist.playlists,
  };
};

export default connect(mapStateToProps)(Playlist);