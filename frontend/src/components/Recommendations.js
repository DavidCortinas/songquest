import { Box, Button, Checkbox, Tooltip, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveIcon from '@mui/icons-material/Remove';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import { useNavigate } from "react-router-dom";

const Recommendation = ({
  classes,
  recommendation,
  index,
  currentPlaylist,
  songsToAdd,
  setSongsToAdd,
  onAddToCurrentPlaylist,
  onRemoveFromCurrentPlaylistById,
  user,
}) => {
    const navigate = useNavigate();
    const recommendationInPlaylist = currentPlaylist.some(track => track.spotify_id === recommendation.id);
    console.log(recommendation)

    const handleAddToPlaylistClick = () => {
      !user.user.spotify_connected ?
      navigate('/spotify-connect') :
      recommendationInPlaylist ? 
      onRemoveFromCurrentPlaylistById(recommendation.id) : 
                    //       {
                    //     'id': song.id,
                    //     'name': song.name,
                    //     'artists': song.artists.split(', '),
                    //     'spotify_id': song.spotify_id,
                    //     'image': song.image,
                    // }
      onAddToCurrentPlaylist({
        // 'id': recommendation.id,
        'name': recommendation.name,
        'artists': recommendation.artists.map(artist => artist.name),
        'spotify_id': recommendation.id,
        'image': recommendation.album.images[2].url,
      });
    };

    const recommendationInSongsToAdd = songsToAdd.some(obj => obj.id === recommendation.id);

    const handleSelectClick = () => {
      if (recommendationInSongsToAdd) {
        setSongsToAdd(songsToAdd.filter(song => song.id !== recommendation.id));
      } else {
        setSongsToAdd([...songsToAdd, recommendation]);
      }
    };

    const isChecked = recommendationInSongsToAdd;

    return (
      <li className={classes.recommendations} key={index}>
        <Checkbox 
          icon={<CircleIcon color='primary' />}
          checkedIcon={<CheckCircleIcon color='info' />}
          onClick={handleSelectClick}
          checked={isChecked}
        />
        <iframe
          src={`https://open.spotify.com/embed/track/${recommendation.id}?utm_source=generator`}
          width='100%'
          height="100%"
          frameBorder="0"
          allowFullScreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy" 
        />
        <Box>
          <Tooltip
            arrow
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
                  {user?.user.spotify_connected && !recommendationInPlaylist ? 
                  "Add to current playlist" :
                  recommendationInPlaylist ?
                  "Remove from current playlist" :
                  "Login to create playlists and more"}
                </Typography>
              </div>
            }
          >
            <Button onClick={handleAddToPlaylistClick}>
              {recommendationInPlaylist ? 
                <RemoveIcon /> :
                <AddIcon />
              }
            </Button>
          </Tooltip>
        </Box>
      </li>
    );
  };

const Recommendations = ({ 
  classes,
  recommendations,
  user,
  currentPlaylist,
  onAddToCurrentPlaylist,
  onRemoveFromCurrentPlaylistById,
  songsToAdd,
  setSongsToAdd,
}) => {
  return (
    <ul>
      {recommendations.map((recommendation, index) => (
        <>
          <Box
            display='flex'
            justifyContent='space-around'
            paddingBottom='3%'
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
                    Get more tracks like this song
                  </Typography>
                </div>
              }
            >
              <Button variant='outlined' className={classes.seedButtons}>
                <AutoModeIcon fontSize='small' sx={{ padding: '0 10% 0 0' }} />
                Song
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
                    Get more tracks from similar artists
                  </Typography>
                </div>
              }
            >
              <Button variant='outlined' className={classes.seedButtons}>
                <AutoModeIcon fontSize='small' sx={{ padding: '0 10% 0 0' }} />
                Artist
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
                    Get more tracks from this genre
                  </Typography>
                </div>
              }
            >
              <Button variant='outlined' className={classes.seedButtons}>
                <AutoModeIcon fontSize='small' sx={{ padding: '0 10% 0 0' }} />
                Genre
              </Button>
            </Tooltip>
          </Box>
          <Recommendation
            classes={classes}
            recommendation={recommendation}
            index={index}
            currentPlaylist={currentPlaylist}
            songsToAdd={songsToAdd}
            setSongsToAdd={setSongsToAdd}
            onAddToCurrentPlaylist={onAddToCurrentPlaylist}
            onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}
            user={user}
          />
        </>
      ))}
    </ul>
  );
};

export default Recommendations;
