import { Box, Button, Checkbox, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from "react-router-dom";

const Recommendation = ({
  classes,
  recommendation,
  index,
  currentPlaylist,
  songsToAdd,
  setSongsToAdd,
  onAddToCurrentPlaylist,
  onRemoveFromCurrentPlaylist,
  user,
}) => {
    const navigate = useNavigate();
    const recommendationInPlaylist = currentPlaylist.some(track => track.id === recommendation.id);

    const handleAddToPlaylistClick = () => {
      !user.user.spotify_connected ?
      navigate('/spotify-connect') :
      recommendationInPlaylist ? 
      onRemoveFromCurrentPlaylist(recommendation) : 
      onAddToCurrentPlaylist(recommendation);
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
  onRemoveFromCurrentPlaylist,
  songsToAdd,
  setSongsToAdd,
}) => {
  return (
    <ul>
      {recommendations.map((recommendation, index) => (
        <Recommendation
          classes={classes}
          recommendation={recommendation}
          index={index}
          currentPlaylist={currentPlaylist}
          songsToAdd={songsToAdd}
          setSongsToAdd={setSongsToAdd}
          onAddToCurrentPlaylist={onAddToCurrentPlaylist}
          onRemoveFromCurrentPlaylist={onRemoveFromCurrentPlaylist}
          user={user}
        />
      ))}
    </ul>
  );
};

export default Recommendations;
