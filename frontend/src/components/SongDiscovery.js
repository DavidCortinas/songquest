import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Grid,
  MenuItem,
  Slider,
  Snackbar,
  Typography,
  useMediaQuery,
  InputLabel,
  Select,
  FormControl,
  OutlinedInput,
  Tooltip,
  Input,
  FormControlLabel,
  Switch,
  ToggleButton,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import FavoriteIcon from '@mui/icons-material/Favorite';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { useForm } from 'react-hook-form';
import { makeStyles, useTheme } from '@mui/styles';
import { getCode, getCountry } from 'iso-3166-1-alpha-2';
import { SpotifyAuth, addToSpotify, checkUsersTracks, createPlaylistRequest, discoverSongRequest, getSpotifyGenres, getSpotifyMarkets, getSpotifySearchResult, login, refreshAccessToken, removeUsersTracks } from '../thunks';
import { clearSearchSongError, discoverSongSuccess, resetDataLoaded, resetQueryParameter, setCurrentUser, setQueryParameter } from '../actions';
import '../App.css';
import theme from '../theme'
import { LoadingState } from './LoadingState';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { SpotifyConnect } from './SpotifyConnect';
import { Body } from './Home';
import { user } from '../reducers';

const useStyles = makeStyles(() => (
  {
  card: {
    backgroundColor: "white",
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
    marginTop: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    color: "#007fbf",
    // backgroundColor: "white",
    width: '90%',
    marginTop: '30px',
  },
  textField: {
    marginLeft: '8px',
    width: '66%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    backgroundColor: 'white',
    borderRadius: '5px',
  },
  resultsField: {
    width: '15%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    backgroundColor: 'white',
    borderRadius: '5px',
  },
  primaryField: {
    width: '50%',
    backgroundColor: 'white',
    borderRadius: '5px',
    marginRight: '10px',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      paddingRight: '0',
      margin: '0 0 1em'
    },
  },
  secondaryField: {
    width: '66%',
    [theme.breakpoints.down('sm')]: {
      width: '40%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '50%',
    },
    backgroundColor: 'white',
    borderRadius: '5px',
  },
  menuList: {
    '& li': {
      color: 'black', // Define the color for MenuItem values
    },
  },
  subHeader: {
    width: '40%',
    [theme.breakpoints.up('sm')]: {
      width: '25rem',
    },
  },
  description: {
    maxWidth: theme.breakpoints.up('xl') ? '65rem' : '50rem',
    color: '#6f6f71',
    paddingTop: '1rem',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '2%',
  },
  noBottomLine: {
    borderBottom: 'none',
  },
  recommendations: {
    display: 'flex',
    justifyContent: 'center',
    listStyle: 'none',
  },
  recommendationsUl: {
    width: '100%'
  },
  resetBtn: {
    position: 'fixed',
    bottom: '2%',
    right: '2%',
    color: '#006f96',
    fontSize: 14,
    [theme.breakpoints.down('md')]: {
      bottom: '12%',
      right: '0',
    }
  },
  createPlaylistBtn: {
    position: 'fixed',
    bottom: '2%',
    left: '2%',
    color: '#006f96',
    fontSize: 14,
    [theme.breakpoints.down('lg')]: {
      left: '7%',
    },
    [theme.breakpoints.down('md')]: {
      bottom: '12%',
      left: '0'
    },
  },
  discoveryCard: {
    padding: '2rem',
    marginTop: '2rem',
    position: 'fixed',
    left: '7%',
    color: 'white',
    // backgroundImage: 'linear-gradient(to bottom right, #004b7f, #006f96, #0090c3)',
    width: '15%',
    maxHeight: '80%',
    [theme.breakpoints.down('lg')]: {
      left: '10%',
      width: '10%',
    },
  },
  accordion: {
    width: '100%',
    borderRadius: '5px',
    overflow: 'hidden',
    paddingTop: '1%'
  },
  inputLabel: {
    overflow: 'hidden',   
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    margin: '0 1em', 
  },
  detailsHeader: {
    boxShadow: '0 4px 2px -2px #013a57',
    width: '100%',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sliderBox: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: '2%',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  }
}));

const toCapitalCase= (str) => {
    if (str) {
        return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    } else {
      return str
    };
};

const autocompleteParam = ['songs', 'performers', 'genres', 'market']

const AutocompleteParameter = ({
    parameter, 
    handleChange, 
    classes, 
    invalidSearch, 
    accessToken,
    tracks,
    artists,
    genres,
    markets,
    targetParamValues,
    setTargetParamValues,
    onSelectedOptions,
}) => {
    const dispatch = useDispatch();
    const [song, setSong] = useState('');
    const [performer, setPerformer] = useState('');
    const [genre, setGenre] = useState('');
    const [market, setMarket] = useState('');


    const handleOptionSelect = (selectedValue) => {
        const selectedOption = options.find(option => 
          option.id === selectedValue.id
        );

        if (selectedOption) {
          const totalSelectedValues = Object.values(targetParamValues).reduce((total, array) => total + array.length, 0);

          if (totalSelectedValues < 5 && !Object.values(targetParamValues).flat().includes(selectedOption.label)) {
              
              setTargetParamValues(prevValues => ({
                  ...prevValues,
                  [parameter]: [...prevValues[parameter], selectedOption.label],
              }));

            if (parameter === 'songs') {
                setSong(selectedOption.label);
                handleChange(parameter, selectedOption.id);
              } else if (parameter === 'performers') {
                setPerformer(selectedOption.label);
                handleChange(parameter, selectedOption.id);
            } else if (parameter === 'genres') {
                setGenre(selectedOption.label);
                handleChange(parameter, selectedOption.label);
            } else {
                setMarket(selectedOption.label);
                handleChange(parameter, getCode(selectedOption.label));
            }
          }
        }
        const selectedOptions = [...targetParamValues[parameter], selectedOption?.label];
        onSelectedOptions(parameter, selectedOptions)
    };

    useEffect(() => {
        if (song) {
            dispatch(getSpotifySearchResult(song, parameter, accessToken));
        };
        if (performer) {
            dispatch(getSpotifySearchResult(performer, parameter, accessToken));
        };
        if (genre) {
          dispatch(getSpotifyGenres(accessToken));
        };
        if (market) {
          dispatch(getSpotifyMarkets(accessToken));
        };
    }, [song, performer, genre, market]);

    const options = parameter === 'songs' 
      ? tracks.items.map((item) => ({
        id: item.id,
        label: `${item.name} - ${item.artists[0].name}`,
        image: item.album.images[2].url
      }))
      : parameter === 'performers'
      ? artists.items.map((item) => ({
        id: item.id,
        label: item.name,
        image: item.images[2]?.url
      }))
      : parameter === 'genres'
      ? genres.map((genre, index) => ({
        id: `genre_${index}`,
        label: genre,
      }))
      : markets.map((market, index) => ({
        id: `markets_${index}`,
        label: getCountry(market),
      }));

    const filteredOptions = options.filter(option =>
      !Object.values(targetParamValues).flat().includes(option.label)
      );

    return (
      <>
        <Autocomplete
          multiple
          filterSelectedOptions
          onChange={(e, newInputValues) => {
              const newInputValue = newInputValues[newInputValues.length - 1]
              if (newInputValue) {
                  handleOptionSelect(newInputValue);
              }
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          options={filteredOptions}
          renderOption={(props, option) => {
            return (
              <Box component="li" sx={{justifyContent: 'space-between'}} {...props}>
                  {option.image && <img
                      loading="lazy"
                      width="40"
                      src={option.image}
                      alt=""
                  />}
                  {option.label}
              </Box>
          )}}
          freeSolo
          ChipProps={{ 
            sx: {
              color: {
                color: 'white',
                backgroundColor: '#006f96',
                '& .MuiChip-deleteIcon': {
                  color: 'white',
                },
              '& .MuiChip-deleteIcon:hover': {
                color: '#00435a',
              },
              
            }}
          }}
          className={classes.textField}
          renderInput={(params) => (
              <TextField
                  {...params} 
                  label={parameter === 'songs' 
                    ? 'Select Songs' 
                    : parameter === 'performers'
                    ? 'Select Artists'
                    : parameter === 'genres' 
                    ? 'Select Genres'
                    : 'Select Market'
                  }
                  value={parameter === 'songs' 
                    ? song 
                    : parameter === 'performers'
                    ? performer
                    : parameter === 'genres'
                    ? genre
                    : market
                  }
                  onChange={
                    parameter === 'songs' 
                    ? (e) => setSong(e.target.value)
                    : parameter === 'performers'
                    ? (e) => setPerformer(e.target.value)
                    : parameter === 'genres'
                    ? (e) => setGenre(e.target.value)
                    : (e) => setMarket(e.target.value)
                  }
                  variant='standard'
                  InputLabelProps={{
                    style: {paddingLeft: '1em'},
                  }}
              />
          )}
        />
      </>
    );
};

const SearchParameter = ({ 
    parameter, 
    handleChange, 
    classes, 
    invalidSearch,  
}) => (
        <>
          <FormControl className={classes.resultsField}>
            <InputLabel className={classes.inputLabel} variant='standard' >Results</InputLabel>
            <Select 
              label='Results'
              onChange={(e) => handleChange(parameter, e.target.value)}
              variant="filled"
              SelectProps={{
                MenuProps: {
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  getContentAnchorEl: null,
                },
              }}
            >
              {Array.from({ length: 100 }, (_, index) => (
                <MenuItem key={index} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
      </>
    ); 

const SliderParameter = ({ 
  parameter, 
  query, 
  onSetQueryParameter, 
  setParameters,
  isXsScreen, 
  isSmScreen, 
  isMdScreen, 
  isLgScreen, 
  isXlScreen
}) => {
  const classes = useStyles();

  const [itemSelected, setItemSelected] = useState(false);

  useEffect(() => {
    if (
      query[parameter]['min'] === null || 
      query[parameter]['target'] === null || 
      query[parameter]['target'] === null
    ) {
      setItemSelected(false);
    };
  }, [query])

  const handleContainerClick = () => {
    setItemSelected((prev) => !prev);
  };

  const min = query && query[parameter]['min'];
  const max = query && query[parameter]['max'];
  const target = query && query[parameter]['target'];

  const marks = parameter === 'time_signature' 
  ? [
    {
      value: 3,
      label: '3/4',
    },
    {
      value: 4,
      label: '4/4',
    },
    {
      value: 5,
      label: '5/4',
    },
    {
      value: 6,
      label: '6/4',
    },
    {
      value: 7,
      label: '7/4',
    },
  ]
  : parameter === 'key'
  ? [
    {
      value: 0,
      label: 'C',
    },
    {
      value: 1,
      label: 'C#',
    },
    {
      value: 2,
      label: 'D',
    },
    {
      value: 3,
      label: 'D#',
    },
    {
      value: 4,
      label: 'E',
    },
    {
      value: 5,
      label: 'F',
    },
    {
      value: 6,
      label: 'F#',
    },
    {
      value: 7,
      label: 'G',
    },
    {
      value: 8,
      label: 'G#',
    },
    {
      value: 9,
      label: 'A',
    },
    {
      value: 10,
      label: 'A#',
    },
    {
      value: 11,
      label: 'B',
    },
  ]
  : [
      {
        value: parameter === 'duration_ms' 
          ? 30000
          : parameter === 'loudness'
          ? -60
          : 0,
        label: parameter === 'duration_ms' 
          ? '30 seconds'
          : parameter === 'loudness'
          ? '-60 db'
          : parameter === 'tempo'
          ? '0 bpm'
          : '0%',
      },
      {
        value: parameter === 'duration_ms' 
          ? 1800000
          : parameter === 'loudness'
          ? -30
          : parameter === 'tempo'
          ? 150
          : parameter === 'mode' || parameter === 'popularity' 
          ? 50
          : 0.5,
        label: parameter === 'duration_ms' 
          ? '30 minutes'
          : parameter === 'loudness'
          ? '-30 db'
          : parameter === 'tempo'
          ? '150 bpm'
          : '50%',
      },
      {
        value: parameter === 'duration_ms' 
          ? 3600000
          : parameter === 'loudness'
          ? 0
          : parameter === 'tempo'
          ? 300
          : parameter === 'mode' || parameter === 'popularity'
          ? 100
          : 1,
        label: parameter === 'duration_ms' 
          ? '1 hr'
          : parameter === 'loudness'
          ? '0 db'
          : parameter === 'tempo'
          ? '300 bpm'
          : '100%',
      },
    ];

  const [parameterValue, setParameterValue] = useState({
    min: min !== null ? min : 0,
    target: max !== null ? max : 50,
    max: target!== null ? target : 100,
  });

  useEffect(() => {
    const min = query && query[parameter] && query[parameter]['min'];
    const max = query && query[parameter] && query[parameter]['max'];
    const target = query && query[parameter] && query[parameter]['target'];

    setParameterValue({
      min: min !== null 
        ? min
        : parameter === 'duration_ms'
        ? 30000
        : parameter === 'time_signature'
        ? 1
        : parameter === 'key'
        ? -1
        : parameter === 'loudness'
        ? -60
        : 0,
      target: target !== null 
      ? target
      : parameter === 'duration_ms'
      ? 1800000
      : parameter === 'key'
      ? 6
      : parameter === 'loudness'
      ? -30
      : parameter === 'mode' || parameter === 'popularity'
      ? 50
      : parameter === 'tempo'
      ? 150
      : parameter === 'time_signature'
      ? 5
      : .50,
      max: max !== null 
        ? max 
        : parameter === 'duration_ms'
        ? 3600000
        : parameter === 'tempo'
        ? 300
        : parameter === 'mode' || parameter === 'popularity'
        ? 100
        : parameter === 'time_signature' || parameter === 'key'
        ? 11
        : parameter === 'loudness'
        ? 0
        : 1,
    });
  }, [query, parameter]);

  const handleSliderChange = (newValues) => {
    const [newMin, newTarget, newMax] = newValues;

    setParameterValue({
      min: newMin,
      target: newTarget,
      max: newMax,
    });

    setParameters(prevParameters => ({
    ...prevParameters,
    [parameter]: {
      min: newMin,
      target: newTarget,
      max: newMax,
      label: query[parameter]['label']
    },

    }));

    onSetQueryParameter(query, parameter, newValues);
  };
  
  return (
    <Box className={classes.sliderBox}>
      <FormControlLabel 
        control={<Switch onChange={handleContainerClick} checked={itemSelected}/>} 
        label={toCapitalCase(query[parameter].label)}
        labelPlacement='end' 
        sx={{ paddingLeft: '0' }}
      />
      <Slider
        disabled={!itemSelected}
        disableSwap
        track={false}
        aria-labelledby="track-false-range-slider"
        onChange={(e, newValues) => handleSliderChange(newValues)}
        // getAriaValueText={valuetext}
        value={[parameterValue.min, parameterValue.max, parameterValue.target]}
        marks={marks}
        valueLabelDisplay="auto"
        valueLabelFormat={(value, index) => {
          if (index === 0) return `Min: ${value}`;
          if (index === 1) return `Target: ${value}`;
          if (index === 2) return `Max: ${value}`;
          return '';
        }}
        max={
          parameter === 'duration_ms'
          ? 3600000
          : parameter === 'tempo'
          ? 300
          : parameter === 'mode' || parameter === 'popularity'
          ? 100
          : parameter === 'time_signature' 
          ? 7
          : parameter === 'key'
          ? 11
          : parameter === 'loudness'
          ? 0
          : 1
        }
        min={
          parameter === 'duration_ms'
          ? 30000
          : parameter === 'time_signature'
          ? 3
          : parameter === 'loudness'
          ? -60
          : 0
        }
        step={
          parameter === 'duration_ms' 
          ? 10
          : parameter === 'mode' 
            || parameter === 'popularity' 
            || parameter === 'key'
            || parameter === 'time_signature'
            || parameter === 'tempo'
          ? 1
          :0.01
        }
        sx={ isLgScreen || isXlScreen || isMdScreen ? { 
          width: '75%',
        } : {
          width: '90%',
          alignSelf: 'flex-end'
        }}
      />
    </Box>
  )
};

const CollapsibleSliders = ({ 
  parameters, 
  setParameters, 
  query, 
  onSetQueryParameter, 
  expanded, 
  setExpanded, 
  handleExpand,
  isXsScreen,
  isSmScreen,
  isMdScreen,
  isLgScreen,
  isXlScreen,
}) => {

  return (
    <Accordion expanded={expanded}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon sx={{ color: 'whitesmoke' }} />}
      onClick={handleExpand}
      sx={{ backgroundColor: '#013a57', color: 'white', borderRadius: '3px' }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        width: '98%' }}>
        <Typography>Fine Tune Your Recommendations</Typography>
        <Typography 
          color='#f6f8fc' 
          variant='caption' 
          textAlign='end'
        >
          {
            isXsScreen || isSmScreen ? 
            "* activate parameters and set the min, target, and max values" : 
            "* activate additional parameters and set the min, target, and max values to refine your recommendations"}
        </Typography>
      </Box>
    </AccordionSummary>
      <AccordionDetails 
        sx={{ 
          maxHeight: '300px', 
          overflowY: 'auto',
          // paddingTop: '3%' 
        }}
      >
        <>
          <Grid container columns={20}>
            {isMdScreen || isLgScreen || isXlScreen ?
              (
                <Grid item xs={4}>
                  <Typography>Fine Tuning Parameters</Typography>
                </Grid>
              ) : (
                <Grid item xs={1}></Grid>
              )
            }
            <Grid item xs={
              isMdScreen || isLgScreen || isXlScreen ?
              16 :
              19
            }> 
              <Box 
                display='flex' 
                flexDirection='row' 
                justifyContent='space-between'
              >
                <Typography textAlign='start'>Minimum Value</Typography>
                <Typography textAlign='center'>Target Value</Typography>
                <Typography textAlign='end'>Maximum Value</Typography>
              </Box>
            </Grid>
          </Grid>
          {Object.keys(parameters).map((parameter, index) => { 
            return parameter !== 'limit' && !autocompleteParam.includes(parameter) && (
            <SliderParameter
              key={index}
              parameter={parameter}
              setParameters={setParameters}
              query={query}
              onSetQueryParameter={onSetQueryParameter}
              isXsScreen={isXsScreen}
              isSmScreen={isSmScreen}
              isMdScreen={isMdScreen}
              isLgScreen={isLgScreen}
              isXlScreen={isXlScreen}
            />
          )})}
        </>
      </AccordionDetails>
    </Accordion>
  );
};

const Recommendation = ({ 
  classes,
  index,
  recommendation,
  user,
  handleAddToSpotify,
  handleCheckUsersTracks,
  handleRemoveUsersTracks,
  setConnectToSpotify, 
}) => {
  const [isSavedTrack, setIsSavedTrack] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Call the thunk when the component mounts
    const fetchData = async () => {
      const data = await handleCheckUsersTracks(recommendation, user?.spotify_access, user?.spotify_refresh, user?.spotify_expires_at);
      data && setIsSavedTrack(data[0]); // Set the response data in the state
    };

    user && fetchData();
  }, [recommendation, user, handleCheckUsersTracks]);

  const handleLikeClick = () => {

    if (user?.user.spotify_email && user?.spotify_access) {
      if (isSavedTrack) {
        handleRemoveUsersTracks(recommendation, user?.spotify_access, user?.spotify_refresh, user?.spotify_expires_at);
      }
      else {
        handleAddToSpotify(recommendation);
      };

      setIsSavedTrack(!isSavedTrack);
    } if (user) {
      navigate('/spotify-connect');
    } else {
      navigate('/login');
    };

  };

  

  return (
    <li className={classes.recommendations}>
      
      <iframe
        key={index}
        src={`https://open.spotify.com/embed/track/${recommendation.id}?utm_source=generator`}
        width={'70%'}
        height="100%"
        frameBorder="0"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy" 
      />
      <Tooltip 
        arrow
        title={user?.user.spotify_email && user?.spotify_access ? 
          "Save to your Spotify library" : user ? 
          "Connect to Spotify to save to libary" : 
          "Login and connect to Spotify to save to libary"
        }
      >
        <Button onClick={handleLikeClick}>
          <FavoriteIcon color={isSavedTrack ? 'success' : 'action'} />
        </Button>
      </Tooltip>
    </li>
  );
};

export const SongDiscovery = ({ 
    recommendations, 
    error, 
    query, 
    onSearchPressed, 
    onResetQueryParameter, 
    onResetDataLoaded,
    onSetQueryParameter,
    onAddToSpotify, 
    handleCheckUsersTracks,
    handleRemoveUsersTracks,
    dataLoaded,
    tracks,
    artists,
    genres,
    markets,
    user,
 }) => {
  const theme = useTheme();

  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

  const [parameters, setParameters] = useState(query);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidSearch, setInvalidSearch] = useState(false);
  const [createPlaylist, setCreatePlaylist] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('Created with SongQuest');
  const [isPlaylistPublic, setIsPlaylistPublic] = useState(false);
  const [connnectToSpotify, setConnectToSpotify] = useState(false);
  
  const [targetParams, setTargetParams] = useState(['songs', 'performers', 'genres']);

  const [targetParamValues, setTargetParamValues] = useState({
      songs: [],
      performers: [],
      genres: [],
  });

  const [targetParamLabels, setTargetParamLabels] = useState({
  songs: [],
  performers: [],
  genres: [],
  });

  const [usernameValue, setUsernameValue] = useState('');
  const [usernameCreated, setUsernameCreated] = useState(Boolean(user?.user));
  const [spotifyAuthorized, setSpotifyAuthorized] =  useState(false);


  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');

  useEffect(() => {
          // Define an async function inside the useEffect
          async function fetchData() {
              const access_token = searchParams.get('access_token');
              const refresh_token = searchParams.get('refresh_token');
              const spotify_access_token = searchParams.get('spotify_access_token');
              const spotify_refresh_token = searchParams.get('spotify_refresh_token');
              const spotify_expires_at = searchParams.get('spotify_expires_at');
              const spotify_username = searchParams.get('username')

              if (spotify_access_token && spotify_refresh_token && spotify_expires_at) {
                  // Use await within the async function
                  const currentUser = await dispatch(login(email, null, spotify_access_token, spotify_refresh_token, spotify_expires_at));
                  dispatch(setCurrentUser(currentUser));

                  setSpotifyAuthorized(true);
              };

              // Check if access_token and refresh_token exist, and then remove them from the URL
              if (spotify_access_token && spotify_refresh_token && spotify_expires_at) {
              // Create a new URLSearchParams without the tokens
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.delete('email');
              newSearchParams.delete('spotify_access_token');
              newSearchParams.delete('spotify_refresh_token');
              newSearchParams.delete('spotify_expires_at');

              // Replace the URL without the tokens
              const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
              window.history.replaceState({}, document.title, newURL);
              };

              if (spotify_username) {
                  const newSearchParams = new URLSearchParams(searchParams);

                  setUsernameValue(spotify_username);
                  newSearchParams.delete('username');
                  newSearchParams.delete('email');
                  newSearchParams.delete('spotify_access_token');
                  newSearchParams.delete('spotify_refresh_token');
                  newSearchParams.delete('spotify_expires_at');

                  const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
                  window.history.replaceState({}, document.title, newURL);
              };
          };

          // Call the async function
          fetchData();
      }, [email, spotifyAuthorized, usernameCreated]);

  const { handleSubmit } = useForm();

  const handleChange = (param, value) => {

    const sliderParam = value?.hasOwnProperty('min') 
    || value?.hasOwnProperty('max') 
    ||value?.hasOwnProperty('target')
    
    setInvalidSearch(false);

    if (!sliderParam) {
      setParameters(prevParameters => {
        if (param === 'market' || param === 'limit') {
            return {
                ...prevParameters,
                [param]: value
            };
        } else {
            if (!prevParameters[param].includes(value) 
              && Object.values(targetParamValues).reduce((total, array) => 
              total + array.length, 0) < 5) {
              return {
                ...prevParameters,
                [param]: [...prevParameters[param], value]
              };
            } else {
                return prevParameters;
            }
          }
      })} 
  };

  const [selectOpen, setSelectOpen] = useState(false);

  const handleTargetParamChange = (e) => {
    setSelectOpen(!selectOpen);
    setTargetParams(e.target.value);
  }

  const handleTargetParamDelete = (value) => {
    setTargetParams((prevTargetParam) =>
      prevTargetParam.filter((param) => param !== value)
    )
  }

  const dispatch = useDispatch();

  const handleSnackbarClose = () => {
    dispatch(clearSearchSongError());
  };

  const onSubmit = async () => {
    // if (songValue === '') {
    //   // Empty song value, set invalidSearch to true and exit the onSubmit process
    //   setInvalidSearch(true);
    //   return;
    // }
    setIsLoading(true);
    setExpanded(false);

    // const newQuery = {
    //   song: songValue,
    //   performer: performerValue,
    // };
    try {
      if (createPlaylist) {
        console.log('create playlist')
        console.log(user)
        console.log({
          playlist_name: playlistName,
          playlist_description: playlistDescription,
          is_public: isPlaylistPublic,
        })
        await createPlaylistRequest(
          user.user.id, 
          playlistName, 
          playlistDescription, 
          isPlaylistPublic, 
          user?.spotify_access,
          user?.spotify_refresh,
          user?.spotify_expires_at,
        )
      } else {
        await onSearchPressed(parameters); 
      //   dispatch(resetQueryParameter());
        setIsLoading(false);
      }

    } catch (error) {
      console.log('Error: ', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      const targetHeight = 650; // Replace 500 with the desired vertical position (height) in pixels.

      window.scrollTo({
        top: targetHeight,
        behavior: 'smooth', // Use 'auto' for instant scrolling.
      });
    };
  }, [isLoading])

  const handleReset = () => {
    setInvalidSearch(false);
    setExpanded(false);
    setParameters(query);
    setTargetParams([]);
    setTargetParamLabels(
      {
        songs: [],
        performers: [],
        genres: [],
      }
    );
    setTargetParamValues(
      {
        songs: [],
        performers: [],
        genres: [],
      }
    );
    onResetDataLoaded();
    onResetQueryParameter(); 
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    onSubmit(); // Call the onSubmit function manually
  };

  const hasMinMaxKeys = (obj) => {
    return 'min' in obj && 'max' in obj && 'target' in obj;
  } ;

  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const handleSelectedOptions = (parameter, selectedOptions) => {
    setTargetParamLabels(prevLabels => ({
      ...prevLabels,
      [parameter]: selectedOptions,
    }))
  };

  const handleExploreMoreClick = () => {
    // Smoothly scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCreatePlaylist(false);
  };

  const handleAddToSpotify = (recommendation) => {
    onAddToSpotify(recommendation, user.spotify_access, user.spotify_refresh, user.spotify_expires_at);
  }

  const handleCreatePlaylist = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCreatePlaylist(true);
  }

  const classes = useStyles();
  const discoveryRecommendations = recommendations?.tracks

  const showTracks = discoveryRecommendations && dataLoaded && !query.limit

  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    const buttonsContainer = document.querySelector('.buttons-container');

    const distanceFromTop = 200;
    const distanceFromBottom = 225;

    if (buttonsContainer && (scrollPosition < distanceFromTop || pageHeight - (scrollPosition + windowHeight) < distanceFromBottom)) {
      buttonsContainer.style.display = 'none';
    } 
    if (buttonsContainer && !(scrollPosition < distanceFromTop || pageHeight - (scrollPosition + windowHeight) < distanceFromBottom)) {
      buttonsContainer.style.display = 'block';
    }
  });

  return (
    <>
      <Box
        sx={{
          // minHeight: '20rem',
          width: '100%',
          // backgroundImage: 'linear-gradient(to bottom right, #004b7f, #006f96, #0090c3)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <form className={classes.form} onSubmit={handleFormSubmit}>
          {/* <FormControl> */}
          {/* <CardHeader
            title={createPlaylist ? "🎵 Create New Playlist 🎶" : "🎵 Discover New Music 🎶"}
            titleTypographyProps={{
              width: '100%',
              variant: isSmScreen || isXsScreen
                ? 'h6'
                : 'h5',
              textAlign: 'center',
              color: 'white',
              paddingTop: '2%',
            }}
            subheader={!isXsScreen && !createPlaylist &&
              "Begin your journey by selecting the songs, artists, and genres you'd like to shape your recommendations."}
            // "Discover music with Song Explorer. Uncover new tunes based on your preferences - from similar songs to unique genres. Begin your musical journey now!"}
            subheaderTypographyProps={{
              width: '100%',
              variant: isXlScreen || isLgScreen
                ? 'body1'
                : 'body2',
              textAlign: 'center',
              color: 'whitesmoke',
            }} /> */}
          <Typography 
            color='white' 
            textAlign='center'
            paddingBottom='5px'
            variant={isXsScreen || isSmScreen ?
            "body2" :
            "body1"}
          >
            {isXsScreen || isSmScreen ? 
            "Select the songs, artists, and genres you'd like to shape your recommendations." :
            "Begin your journey by selecting the songs, artists, and genres you'd like to shape your recommendations"}
          </Typography>
          <>
            <SpotifyAuth>
              {(accessToken) => {
                return createPlaylist ? (
                  <Box
                    display="flex"
                    flexDirection={(isXsScreen || isSmScreen) ? "column" : "row"}
                    justifyContent='center'
                    alignItems={(isXsScreen || isSmScreen) ? "center" : "flex-start"}
                    style={{ marginBottom: '1%' }}
                  >
                    <FormControl style={{ width: '50%' }}>
                      <TextField 
                        label="Enter Playlist Name" 
                        style={{ 
                          marginBottom: '8px',
                          backgroundColor: 'white',
                        }}
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                      />
                      <TextField 
                        value={playlistDescription}
                        style={{ 
                          marginBottom: '8px',
                          backgroundColor: 'white',
                        }}
                        multiline
                        rows={3}
                        disabled 
                      />
                      <FormControlLabel 
                        disabled 
                        value={isPlaylistPublic}
                        control={<Switch />} 
                        label={
                          <span style={{ color: 'lightgrey' }}>Make Playlist Public</span>
                        }
                      />
                    </FormControl>
                  </Box>
                ) : (
                  <>
                    {Object.keys(parameters).map((parameter, index) => {
                      return parameter === 'limit' || autocompleteParam.includes(parameter) ? (
                        <Box key={index}>
                          <Box>
                            {parameter === 'limit' ? (
                              <>
                                <Box
                                  display="flex"
                                  flexDirection={(isXsScreen || isSmScreen) ? "column" : "row"}
                                  justifyContent='center'
                                  alignItems={(isXsScreen || isSmScreen) ? "center" : "flex-start"}
                                  style={{ marginBottom: '1%' }}
                                >
                                  <FormControl className={classes.primaryField}>
                                    <InputLabel 
                                      className={classes.inputLabel} 
                                      variant='standard'
                                    >
                                      Set Recommendation Sources (Songs, Artists, or Genres)
                                    </InputLabel>
                                    <Select
                                      multiple
                                      open={selectOpen}
                                      onOpen={() => setSelectOpen(true)}
                                      onClose={() => setSelectOpen(false)}
                                      label="Set Recommendation Sources (Songs, Artists, or Genres)"
                                      value={targetParams}
                                      onChange={handleTargetParamChange}
                                      variant="standard"
                                      SelectProps={{
                                        MenuProps: {
                                          anchorOrigin: {
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                          },
                                          transformOrigin: {
                                            vertical: 'top',
                                            horizontal: 'left',
                                          },
                                          getContentAnchorEl: null,
                                        },
                                      }}
                                      // input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                      renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                          {selected.map((value, index) => (
                                            <Chip
                                              key={value}
                                              sx={{
                                                backgroundColor: '#006f96',
                                                color: 'white',
                                                '& .MuiChip-deleteIcon': {
                                                  color: 'white',
                                                },
                                                marginLeft: index === 0 ? '8px' : '0px',
                                              }}
                                              label={toCapitalCase(value)}
                                              deleteIcon={<CancelIcon
                                                onMouseDown={(event) => event.stopPropagation()} />}
                                              onDelete={() => handleTargetParamDelete(value)} />
                                          ))}
                                        </Box>
                                      )}
                                    >
                                      <MenuItem value={'songs'}>Songs</MenuItem>
                                      <MenuItem value={'performers'}>Performers</MenuItem>
                                      <MenuItem value={'genres'}>Genres</MenuItem>
                                    </Select>
                                  </FormControl>
                                  <SearchParameter
                                    parameter={parameter}
                                    handleChange={handleChange}
                                    invalidSearch={invalidSearch}
                                    classes={classes} 
                                  />
                                </Box>
                                <Typography
                                  textAlign='center'
                                  color='whitesmoke'
                                  variant={
                                    isXsScreen || isSmScreen ?
                                    "body2" :
                                    "body1"
                                  }
                                >
                                  {Object.values(targetParamValues).every(arr => arr.length === 0)
                                    ? `Choose Up to 5 Recommendation Sources`
                                    : Object.values(targetParamValues).every(arr => arr.length < 5)
                                      ? `Choose Up to ${5 - [].concat(...[...new Set(Object.values(targetParamValues))])
                                        .length} More Recommendation Sources`
                                      : `You Have Run Out Of Target Parameters To Set`}
                                </Typography>
                              </>
                            )
                              : autocompleteParam.includes(parameter) && targetParams.includes(parameter) ? (
                                <Box display="flex" flexDirection='column' justifyContent="center" alignItems='center' style={{ marginBottom: '1%' }}>
                                  <AutocompleteParameter
                                    parameter={parameter}
                                    handleChange={(parameter, value) => {
                                      handleChange(parameter, value);
                                    } }
                                    classes={classes}
                                    invalidSearch={invalidSearch}
                                    accessToken={accessToken}
                                    tracks={tracks}
                                    artists={artists}
                                    genres={genres}
                                    markets={markets}
                                    setTargetParamValues={setTargetParamValues}
                                    targetParamValues={targetParamValues}
                                    onSelectedOptions={handleSelectedOptions} />
                                </Box>
                              ) : null}
                          </Box>
                        </Box>
                      ) : null;
                    })}
                    <Box className={classes.accordion}>
                      <CollapsibleSliders
                        parameters={parameters}
                        setParameters={setParameters}
                        query={query}
                        onSetQueryParameter={onSetQueryParameter}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        handleExpand={handleExpand}
                        isXsScreen={isXsScreen}
                        isSmScreen={isSmScreen}
                        isMdScreen={isMdScreen}
                        isLgScreen={isLgScreen}
                        isXlScreen={isXlScreen}
                      />
                    </Box>
                  </>
                )
              }}
            </SpotifyAuth>
          </>
          <Grid className={classes.buttonsContainer}>
            <Button
              type="submit"
              variant='contained'
              onClick={handleSubmit(onSubmit)}
              style={{ color: 'white', backgroundColor: '#3fc98e', borderRadius: '8px' }}
            >
              Try For Free
            </Button>
            <Button
              onClick={handleReset}
              style={{ color: 'white', backgroundColor: 'transparent' }}
            >
              Reset
            </Button>
          </Grid>
          <br />
          {/* </FormControl> */}
        </form>
      </Box>
      {isLoading && (
        <Box backgroundColor='white' width='100%' paddingBottom='5%'>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="30vh"
            id='loadingState'
          >
            <CardHeader
              title="Loading Results"
              titleTypographyProps={{ color: 'black' }}
              subheaderTypographyProps={{ color: '#3d3d3d' }}
            />
          </Box>
          <LoadingState />
        </Box>
      )}
      {showTracks ? (
        <Box backgroundColor='white' width='100%'>
          <Box className='buttons-container'>
            {!isXsScreen && !isSmScreen && !isMdScreen ? (
              <Button variant='text' className={classes.resetBtn} onClick={handleExploreMoreClick}>
                Explore More
              </Button>
              ) : (
              <Button variant='text' className={classes.resetBtn} onClick={handleExploreMoreClick}>
                <ArrowUpwardIcon />
              </Button>
            )}
            {/* {user && 
              // <Box 
              //   display='flex' 
              //   flexDirection='row' 
              //   alignItems='center'
              //   padding='15px 15px 0'
              // >
                <Tooltip 
                  arrow 
                  title="Create playlist from recommendations" 
                >
                  {!isXsScreen && !isSmScreen && !isMdScreen ? 
                  (
                    <Button onClick={handleCreatePlaylist} className={classes.createPlaylistBtn}>
                      Create Playlist
                    </Button>
                  ) : (
                    <Button onClick={handleCreatePlaylist} className={classes.createPlaylistBtn}>
                      <QueueMusicIcon />
                    </Button>
                  )}
                </Tooltip>
              // {/* </Box> */}
            {/* } */} 
          </Box>
          <ul className={classes.recommendationsUl}>
            {discoveryRecommendations.map((recommendation, index) => (
              <Recommendation 
                classes={classes} 
                index={index}
                recommendation={recommendation}
                user={user}
                handleAddToSpotify={handleAddToSpotify}
                handleCheckUsersTracks={handleCheckUsersTracks}
                handleRemoveUsersTracks={handleRemoveUsersTracks}
                setConnectToSpotify={setConnectToSpotify}
              />
            ))}
          </ul>
        </Box>
      ) : !isLoading && (
        <Body 
          isSmScreen={isSmScreen} 
          isXsScreen={isXsScreen}
          isMdScreen={isMdScreen}
          isLgScreen={isLgScreen} 
          isXlScreen={isXlScreen} 
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    query: state.discovery.query,
    error: state.discovery.error,
    recommendations: state.discovery.recommendations,
    dataLoaded: state.discovery.dataLoaded,
    tracks: state.discovery.tracks,
    artists: state.discovery.artists,
    genres: state.discovery.genres,
    markets: state.discovery.markets,
    user: state.user.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSearchPressed: (query) => dispatch(discoverSongRequest(query)),
  onResetQueryParameter: () =>
    dispatch(resetQueryParameter()),
  onResetDataLoaded: () =>
    dispatch(resetDataLoaded()),
  onSetQueryParameter: (query, parameter, newValues) => dispatch(setQueryParameter(query, parameter, newValues)),
  onAddToSpotify: (recommendation, spotify_access, spotify_refresh, spotify_expires_at) => dispatch(addToSpotify(recommendation, spotify_access, spotify_refresh, spotify_expires_at)),
  handleCheckUsersTracks: (recommendation, spotify_access, spotify_refresh, spotify_expires_at) => dispatch(checkUsersTracks(recommendation, spotify_access, spotify_refresh, spotify_expires_at)),
  handleRemoveUsersTracks: (recommendation, spotify_access, spotify_refresh, spotify_expires_at) => dispatch(removeUsersTracks(recommendation, spotify_access, spotify_refresh, spotify_expires_at)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SongDiscovery);