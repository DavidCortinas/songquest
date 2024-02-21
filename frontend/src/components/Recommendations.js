import { Box, Button, Checkbox, Tooltip, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveIcon from '@mui/icons-material/Remove';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";
import { useCallback, useRef, useState } from "react";
import theme from "theme";
import { connect } from "react-redux";
import { addToCurrentPlaylist } from "actions";

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
    console.log(theme)

    return (
      <li className={classes.recommendations} key={index}>
        <Checkbox 
          icon={<CircleIcon sx={{ color: theme.palette.primary.white }} />}
          checkedIcon={<CheckCircleIcon sx={{ color: theme.palette.primary.analgous1}} />}
          onClick={handleSelectClick}
          checked={isChecked}
          sx={{ padding: '0 3% 0 2%' }}
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
                  borderRadius: '18px',
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
                <RemoveIcon sx={{ color: theme.palette.primary.white }} /> :
                <AddIcon sx={{ color: theme.palette.primary.white }} />
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
  setIsModalOpen,
}) => {
  const [songsToAdd, setSongsToAdd] = useState([]);
  const [visibleRecommendations, setVisibleRecommendations] = useState(recommendations.length); 
  const containerRef = useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleSelectAll = () => {
    songsToAdd.length === 0 ?
    setSongsToAdd(recommendations) :
    setSongsToAdd([])
  };

  const handleBulkAdd = () => {
    const songsToAddData = songsToAdd.map(song => ({
      'id': song.id,
      'name': song.name,
      'artists': song.artists.map(artist => artist.name),
      'spotify_id': song.spotify_id,
      'isrc': song.external_ids.isrc,
      'image': song.album.images[2].url,
    }));

    onAddToCurrentPlaylist(...songsToAddData);
  };

  const handleSaveRequestParameters = () => {
    openModal();
  };

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (container && recommendations.length > 0 && container.scrollTop + container.clientHeight >= container.scrollHeight) {
      setVisibleRecommendations((preVisible) => preVisible + 4);
    };
  }, [recommendations]);

  return (
    <>
      <ul 
        style={{
          color: 'white',
          padding: '0',
          margin: '1.5% 3%',
          height: '91vh',
          transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
          '&:hover, &:active, &.MuiFocusVisible': {
            border: '2px solid rgba(89, 149, 192, 0.5)',
            backgroundColor: 'rgb(44, 216, 207, 0.5)',
            boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
          }
        }}
      >
        <Box 
          display='flex' 
          justifyContent='space-around' 
          width='100%'
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
                  {songsToAdd.length === 0 ? 'Select all discovery results' : 'Deselect discovery results'}
                </Typography>
              </div>
            }
          >
            <Button onClick={handleSelectAll}>
              <Typography 
                color='white' 
                variant='subtitle1'
              >
                {songsToAdd.length === 0 ? 'Select All' : 'Deselect'}
              </Typography>
            </Button>
          </Tooltip>
          {user && (
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
                    {'See the parameters from this request'}
                  </Typography>
                </div>
              }
            >
              <Button 
                onClick={handleSaveRequestParameters} 
                sx={{ 
                  marginRight: '8%',
                  width: '50%' 
                }}
              >
                <VisibilityIcon style={{ color: theme.palette.primary.analogous1 }} />
                <Typography 
                  color='white' 
                  variant='subtitle1'
                  paddingLeft='3%'
                >
                  {'View Request'}
                </Typography>
              </Button>
            </Tooltip>)
          }
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
                  {'Add selected to playlist'}
                </Typography>
              </div>
            }
          >
            <Button onClick={handleBulkAdd}>
              <PlaylistAddIcon 
                fontSize='large' 
                style={{ color: theme.palette.primary.white }}
              />
            </Button>
          </Tooltip>
        </Box>
        <div 
          ref={containerRef} 
          onScroll={handleScroll} 
          style={{ 
            overflowY: 'auto', 
            height: '86vh',
            scrollbarWidth: 'thin',
            scrollbarColor: `${theme.palette.primary.analogous1} transparent`,
            WebkitOverflowScrolling: 'touch',
            scrollbarFaceColor: theme.palette.primary.analogous2,
            scrollbarHighlightColor: 'transparent',
            scrollbarShadowColor: 'transparent',
            scrollbarDarkShadowColor: 'transparent',
          }}
        >
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
      <Box display='flex' justifyContent='center' alignItems='center'>
        <KeyboardDoubleArrowDownIcon 
          sx={{ color: theme.palette.primary.triadic2 }}
        />
        <Typography 
          textAlign='center' 
          color='white'
          variant='subtitle1'
          letterSpacing='1px'
        >
          Scroll Down To Load More Results
        </Typography>
        <KeyboardDoubleArrowDownIcon 
          sx={{ color: theme.palette.primary.triadic2 }}
        />
      </Box>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  onAddToCurrentPlaylist: (...songs) => dispatch(addToCurrentPlaylist(...songs)),
});

export default connect(null, mapDispatchToProps)(Recommendations);
