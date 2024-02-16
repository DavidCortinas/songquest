import { Box, Button, Checkbox, Tooltip, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveIcon from '@mui/icons-material/Remove';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import { useNavigate } from "react-router-dom";
import { useCallback, useRef, useState } from "react";

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

    const handleAddToPlaylistClick = useCallback(() => {
      if (!user?.user.spotify_connected) {
        navigate('/spotify-connect');
      } else {
        recommendationInPlaylist
          ? onRemoveFromCurrentPlaylistById(recommendation.id)
          : onAddToCurrentPlaylist({
              name: recommendation.name,
              artists: recommendation.artists.map((artist) => artist.name),
              spotify_id: recommendation.id,
              image: recommendation.album.images[2].url,
            });
      }
    }, [user?.user.spotify_connected, navigate, recommendation, recommendationInPlaylist, onRemoveFromCurrentPlaylistById, onAddToCurrentPlaylist]);


    const recommendationInSongsToAdd = songsToAdd.some(obj => obj.id === recommendation.id);

    const handleSelectClick = useCallback(() => {
      if (recommendationInSongsToAdd) {
        setSongsToAdd(songsToAdd.filter(song => song.id !== recommendation.id));
      } else {
        setSongsToAdd([...songsToAdd, recommendation]);
      }
    }, [recommendation, recommendationInSongsToAdd, setSongsToAdd]);

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
  const [visibleRecommendations, setVisibleRecommendations] = useState(recommendations.length); 
  const containerRef = useRef(null);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (container && recommendations.length > 0 && container.scrollTop + container.clientHeight >= container.scrollHeight) {
      setVisibleRecommendations((preVisible) => preVisible + 5);
    };
  }, [recommendations]);

  const handleAddSongToQuery = (song) => {

  };

  const handleAddArtistsToQuery = (artists) => {

  };

  const handleAddGenresToQuery = (genres) => {

  };

  return (
    <ul>
      <div ref={containerRef} onScroll={handleScroll} style={{ overflowY: 'auto', height: '100vh' }}>
        {recommendations.slice(0, visibleRecommendations).map((recommendation, index) => (
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
        ))}
      </div>
    </ul>
  );
};

export default Recommendations;
