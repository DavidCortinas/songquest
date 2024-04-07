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
  createPlaylist,
  songsToAdd,
  setSongsToAdd,
  onAddToCurrentPlaylist,
  onRemoveFromCurrentPlaylistById,
  user,
  isXsScreen,
  toggleValue,
}) => {
    const navigate = useNavigate();
    const recommendationInPlaylist = createPlaylist?.tracks.some(track => track.spotifyId === recommendation.id);

    const handleAddToPlaylistClick = useCallback(() => {
      if (!user?.user.spotifyConnected) {
        navigate('/spotify-connect');
      } else {
        recommendationInPlaylist
          ? onRemoveFromCurrentPlaylistById(recommendation.id)
          : onAddToCurrentPlaylist({
              name: recommendation.name,
              artists: recommendation.artists.map((artist) => artist.name ? artist.name : artist),
              spotify_id: recommendation.id,
              image: recommendation.album ? recommendation.album.images[2].url : recommendation.image,
            });
      }
    }, [user?.user?.spotifyConnected, navigate, recommendation, recommendationInPlaylist, onRemoveFromCurrentPlaylistById, onAddToCurrentPlaylist]);


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
          icon={<CircleIcon sx={{ color: theme.palette.primary.white }} />}
          checkedIcon={<CheckCircleIcon sx={{ color: theme.palette.primary.analgous1}} />}
          onClick={handleSelectClick}
          checked={isChecked}
          sx={{ padding: '0 3% 0 2%' }}
        />
        <iframe
          src={`https://open.spotify.com/embed/track/${recommendation.spotifyId || recommendation.id}?utm_source=generator`}
          height="100%"
          width={isXsScreen ? "65%" : '100%'}
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
                  {user?.user?.spotifyConnected && !recommendationInPlaylist ? 
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
  createPlaylist,
  onAddToCurrentPlaylist,
  onRemoveFromCurrentPlaylistById,
  setIsModalOpen,
  isXsScreen,
  toggleValue,
  handleExploreMoreClick,
}) => {
  const [songsToAdd, setSongsToAdd] = useState([]);
  const [visibleRecommendations, setVisibleRecommendations] = useState(recommendations?.length); 
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
      'spotify_id': song.spotifyId,
      'isrc': song.external_ids ? song.external_ids.isrc : song.isrc,
      'image': song.album ? song.album.images[2].url : song.image,
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
          justifyContent={'space-between'}
          width={isXsScreen ? '110%' : '100%'}
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
                variant={isXsScreen ? 'caption' : 'subtitle1'}
              >
                {songsToAdd.length === 0 && !isXsScreen ? 
                  'Select All' :
                  songsToAdd.length === 0 && isXsScreen ?
                  'Select' :
                  'Deselect'}
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
                  marginRight: !isXsScreen ? '8%' : '0',
                  width: '50%' 
                }}
              >
                {toggleValue === 'Discovery Results' && (
                  <VisibilityIcon 
                    fontSize={isXsScreen ? 'small' : 'medium'}
                    style={{ color: theme.palette.primary.analogous1 }} 
                  />
                )}
                <Typography 
                  color='white' 
                  variant={isXsScreen ? 'caption' : 'subtitle1'}
                  paddingLeft='3%'
                >
                  {isXsScreen && toggleValue === 'Discovery Results' ? 
                    'Request' : 
                    toggleValue === 'Discovery Results' ? 
                    'View Request' :
                    'Selected Playlist'
                  }
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
            <Button onClick={handleBulkAdd} sx={{ p: 0 }}>
              <PlaylistAddIcon 
                fontSize={isXsScreen ? 'medium' : 'large' }
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
          {recommendations?.length > 0 ? recommendations?.slice(0, visibleRecommendations).map((recommendation, index) => (
              <Recommendation
                classes={classes}
                recommendation={recommendation}
                index={index}
                createPlaylist={createPlaylist}
                songsToAdd={songsToAdd}
                setSongsToAdd={setSongsToAdd}
                onAddToCurrentPlaylist={onAddToCurrentPlaylist}
                onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}
                user={user}
                isXsScreen={isXsScreen}
                toggleValue={toggleValue}
              />
          )) : (
            <Box
              display='flex'
              flexDirection='column'
              alignItems='center'
              width='85%'
              style={{margin: '0 auto'}}
            >
              <Typography
                variant='h5'
                textAlign='center'
                color='whitesmoke'
                paddingTop='5%'
              >
                {'No Playlist Selected'}
              </Typography>
              <Typography
                variant='h6'
                textAlign='center'
                color='whitesmoke'
                paddingTop='3%'
              >
                {`Select one of your saved playlists from the left panel to 
                preview the gems you have in your collection, or use the song
                explorer to start unearthing new gems for your collection.`}
              </Typography>
              <Button 
                  onClick={() => handleExploreMoreClick(false)}
                  variant='contained'
                  sx={{
                      color: 'white',
                      backgroundColor: 'rgb(44, 216, 207, 0.3)',
                      border: '2px solid rgba(89, 149, 192, 0.5)',
                      borderRadius: '18px',
                      boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
                      transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
                      margin: '4%',
                      width: '22vw',
                      height: '7vh', 
                      [theme.breakpoints.down('md')] : {
                          width: '70%',
                      },
                      '&:hover, &:active, &.MuiFocusVisible': {
                          border: '2px solid rgba(89, 149, 192, 0.5)',
                          backgroundColor: 'rgb(44, 216, 207, 0.5)',
                          boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
                      },
                  }}
              >
              <Typography
                variant='body2' 
                color='white'
                letterSpacing='1px'
                sx={{
                    fontWeight: 'bold',
                    cursor: 'pointer',
                }}
              >
                {'Use Song Explorer'}
              </Typography>
              </Button>
            </Box>
          )}
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
