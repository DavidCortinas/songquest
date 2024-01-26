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
  Modal,
  Radio,
  Checkbox,
  Tab,
  Tabs,
  ButtonGroup,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import FavoriteIcon from '@mui/icons-material/Favorite';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import RemoveIcon from '@mui/icons-material/Remove';
import SendIcon from '@mui/icons-material/Send';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CircleIcon from '@mui/icons-material/Circle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useForm } from 'react-hook-form';
import { makeStyles, useTheme } from '@mui/styles';
import { getCode, getCountry } from 'iso-3166-1-alpha-2';
import { SpotifyAuth, addToSpotify, checkUsersTracks, createPlaylistRequest, discoverSongRequest, getSpotifyGenres, getSpotifyMarkets, getSpotifySearchResult, login, refreshAccessToken, removeUsersTracks } from '../thunks';
import { addToCurrentPlaylist, clearSearchSongError, confirmSpotifyAccess, createPlaylist, deletePlaylist, discoverSongSuccess, removeFromCurrentPlaylist, resetDataLoaded, resetQueryParameter, setCurrentUser, setQueryParameter } from '../actions';
import '../App.css';
import theme from '../theme'
import { LoadingState } from './LoadingState';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { SpotifyConnect } from './SpotifyConnect';
import { Body } from './Home';
import { user } from '../reducers';
import getCSRFToken from '../csrf';

const root = {
  "& .MuiAutocomplete-option[data-focus='true']": {
    backgroundColor: '#40444d',
    color: 'white',
  },
  "& .MuiAutocomplete-option:hover": {
    backgroundColor: '#40444d',
    color: 'white',
  },
};

const useStyles = makeStyles(() => (
  {
    root: {
      padding: '15px 0 5px',
    },
    button: {
      marginBottom: '5px',
      borderRadius: '8px',
      backgroundColor: 'transparent', 
      border: '2px solid rgba(89, 149, 192, 0.5)',
      boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
      '&:hover, &:active, &.Mui-focusVisible': {
        border: '2px solid rgba(89, 149, 192, 0.5)',
        background: 'rgba(48, 130, 164, 0.1)',
        boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
        backdropFilter: 'blur(5.1px)',
        WebkitBackdropFilter: 'blur(5.1px)',
      },
    },
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
    // marginTop: '30px',
    border: '2px solid rgba(89, 149, 192, 0.5)',
    borderRadius: '18px',
    background: 'rgba(48, 130, 164, 0.1)',
    boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
    backdropFilter: 'blur(5.1px)',
    WebkitBackdropFilter: 'blur(5.1px)',
    padding: '0 2%',
  },
  sidePanel: {
    marginTop: '10px',
    // minHeight: '100vh',
    maxHeight: '1800px', 
    width: '20%',
    color: 'white',
    border: '2px solid rgba(89, 149, 192, 0.5)',
    borderRadius: '18px',
    background: 'rgba(48, 130, 164, 0.1)',
    boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
    backdropFilter: 'blur(5.1px)',
    WebkitBackdropFilter: 'blur(5.1px)',
    overflowY: 'auto',
  },
  textField: {
    marginLeft: '8px',
    width: '66%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    backgroundColor: '#30313d',
    borderRadius: '8px',
    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
  },
  openaiChatField: {
    backgroundColor: '#30313d',
    borderRadius: '8px',
    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
    height: '50vh',
    margin: '10px 0 25px',
    width: '80vw',
    opacity: '0.7'
  },
  playlistField: {
    width: '100%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    backgroundColor: '#30313d',
    borderRadius: '8px',
    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
  },
  resultsField: {
    width: '15%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    backgroundColor: '#30313d',
    borderRadius: '8px',
    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
  },
  primaryField: {
    width: '50%',
    backgroundColor: '#30313d',
    borderRadius: '8px',
    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
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
    backgroundColor: '#30313d',
    borderRadius: '8px',
    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
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
    alignItems: 'start',
    listStyle: 'none',
  },
  currentPlaylistUl: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    listStyle: 'none',
  },
  recommendationsUl: {
    width: '100%'
  },
  recommendationsUl: {
    width: '100%'
  },
  resetBtn: {
    position: 'fixed',
    bottom: '2%',
    right: '2%',
    // color: '#006f96',
    color: 'white',
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
    borderRadius: '18px',
    overflow: 'hidden',
    paddingTop: '1%'
  },
  inputLabel: {
    overflow: 'hidden',   
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    margin: '0 1em', 
    color: 'white',
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
    paddingBottom: '15px',
    width: '100%',
    marginLeft: '-25px',
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
    expiresAt,
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
            dispatch(getSpotifySearchResult(song, parameter, accessToken, expiresAt));
        };
        if (performer) {
            dispatch(getSpotifySearchResult(performer, parameter, accessToken, expiresAt));
        };
        if (genre) {
          dispatch(getSpotifyGenres(accessToken, expiresAt));
        };
        if (market) {
          dispatch(getSpotifyMarkets(accessToken, expiresAt));
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
          ListboxProps={{ sx: root }}
          renderOption={(props, option) => {
            return (
              <Box 
                component="li" 
                sx={{
                  justifyContent: 'space-between',
                  background: '#30313d',
                  color: 'white',
                }} 
                {...props}>
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
                    sx: {
                      paddingLeft: '1em',
                      backgroundColor: '#30313d',
                      color: 'white',
                    },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      ...params.InputProps.sx,
                      paddingLeft: '1em',
                      color: 'white',
                      '& .MuiInputBase-input': {
                        color: 'white', // This targets the input text
                      },
                    },
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
              sx={{
                '.MuiInputBase-input': { // Targeting the MuiInputBase class
                  color: 'white', // Setting the color to white
                },
              }}
              MenuProps={{
                sx: {
                  '.MuiPaper-root': {
                    backgroundColor: '#30313d', // Background color
                    color: 'white',
                  },
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
    <Box 
      className={classes.sliderBox}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginRight: 2,
        }}
      >
        <FormControlLabel 
          control={
            <>
              <Typography>
                On
              </Typography>
              <Switch 
                onChange={handleContainerClick} 
                checked={itemSelected}
                sx={{
                  '& .MuiSwitch-switchBase': {
                    color: '#28bfe2',
                    opacity: '0.7',
                  },
                  '& .MuiSwitch-switchBase + .MuiSwitch-track': {
                    background: 'linear-gradient(to right, #28bfe2, #2c8bd8, #d96cb1)',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#d96cb1',
                    opacity: '0.7',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    background: 'linear-gradient(to right, #28bfe2, #2c8bd8, #d96cb1)',
                  },
                }}
              />
              <Typography paddingLeft='10px'>
                Off
              </Typography>
            </>
          } 
          labelPlacement='start' 
          sx={{ 
            padding: '0 20px 0 0',
          }}
        />
        <Typography variant='subtitle2'>
          {toCapitalCase(query[parameter].label)}
        </Typography>
      </Box>
      <Slider
        disabled={!itemSelected}
        disableSwap
        // track={false}
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
        sx={ 
          isLgScreen || isXlScreen || isMdScreen ? 
          { 
            width: '70%',
            opacity: '0.7',
            color: '#d96cb1', // This changes the thumb color and the color of the track before the thumb
              '& .MuiSlider-track': {
                background: 'linear-gradient(to right, #28bfe2, #2c8bd8, #d96cb1)'
              },
              '& .MuiSlider-rail': {
                background: 'linear-gradient(to right, #28bfe2, #2c8bd8, #d96cb1)'
              },
              '& .MuiSlider-markLabel': {
                color: 'white',
              },
          } : {
            width: '90%',
            alignSelf: 'flex-end',
            opacity: '0.7',
            color: '#d96cb1', // This changes the thumb color and the color of the track before the thumb
              '& .MuiSlider-track': {
                backgroundColor: 'pink', // Change 'desiredColor' to the color you want for the track
              },
              '& .MuiSlider-rail': {
                backgroundColor: 'pink', // Optional: Change 'railColor' to style the rail if needed
              },
              '& .MuiSlider-markLabel': {
                color: 'white',
              },
          }
        }
      />
    </Box>
  )
};

const CollapsibleSliders = ({ 
  parameters, 
  setParameters, 
  query, 
  onSetQueryParameter, 
  openModal, 
  setOpenModal, 
  isXsScreen,
  isSmScreen,
  isMdScreen,
  isLgScreen,
  isXlScreen,
}) => {

  return (
    <>
      <Tooltip
        arrow
        title='Adjust your discovery settings'
      >
        <Button 
          sx={{ 
            color: 'white', 
            borderRadius: '18px',
            height: '55px',
            border: '2px solid rgba(89, 149, 192, 0.5)',
            boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
            textTransform: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            '&:hover, &:active, &.Mui-focusVisible': {
              border: '2px solid rgba(89, 149, 192, 0.5)',
              background: 'rgba(48, 130, 164, 0.1)',
              boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
              backdropFilter: 'blur(5.1px)',
              WebkitBackdropFilter: 'blur(5.1px)',
            },
          }} 
          fullWidth
          variant='outlined'
          onClick={() => setOpenModal(true)}
          disableRipple
        >
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
          <SettingsIcon />
        </Button>
      </Tooltip>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
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
            width: '70%',
            height: '80%',
            boxShadow: 24,
            p: 4,
          }}
        >
            <Grid container columns={20} paddingBottom='15px'>
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
          </Box>
      </Modal>
    </>
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
  currentPlaylist,
  onAddToCurrentPlaylist,
  onRemoveFromCurrentPlaylist,
  songsToAdd,
  setSongsToAdd,
}) => {
  const [isSavedTrack, setIsSavedTrack] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Call the thunk when the component mounts
    const fetchData = async () => {
      const data = await handleCheckUsersTracks(recommendation, user?.user.email);
      data && setIsSavedTrack(data[0]); // Set the response data in the state
    };

    user && fetchData();
  }, [recommendation, user, handleCheckUsersTracks]);

  const handleLikeClick = () => {

    if (user?.spotifyConnection) {
      if (isSavedTrack) {
        handleRemoveUsersTracks(recommendation, user?.user.email);
      }
      else {
        handleAddToSpotify(recommendation, user?.user.email);
      };

      setIsSavedTrack(!isSavedTrack);
    } if (!user?.spotifyConnection) {
      navigate('/spotify-connect');
    };

  };
  
  const recommendationInPlaylist = currentPlaylist.some(track => track.id === recommendation.id);
  
  const handleAddToPlaylistClick = (recommendation) => {
    recommendationInPlaylist ? 
    onRemoveFromCurrentPlaylist(recommendation) : 
    onAddToCurrentPlaylist(recommendation)
  };

  const reccommendationInSongsToAdd = (id) => {
    return songsToAdd.some(obj => obj.id === id);
  };

  const handleSelectClick = () => {
    if (reccommendationInSongsToAdd(recommendation.id)) {
      // Remove the deselected song from the list
      setSongsToAdd(songsToAdd.filter(song => song.id !== recommendation.id));
    } else {
      // Add the selected song to the list
      setSongsToAdd([...songsToAdd, recommendation]);
    }
  };

  const isChecked = songsToAdd.some(song => song.id === recommendation.id);

  return (
    <li className={classes.recommendations}>
      <Checkbox 
        icon={<CircleIcon color='primary' />}
        checkedIcon={<CheckCircleIcon color='info' />}
        onClick={handleSelectClick}
        checked={isChecked}
      />
      <iframe
        key={index}
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
          title={user && !recommendationInPlaylist ? 
            "Add to current playlist" :
            recommendationInPlaylist ?
            "Remove from current playlist" :
            "Login to create playlists and more"
          }
        >
          {recommendationInPlaylist ? (
            <Button onClick={() => handleAddToPlaylistClick(recommendation)}>
              <RemoveIcon />
            </Button>
            ) : (
            <Button onClick={() => handleAddToPlaylistClick(recommendation)}>
              <AddIcon />
            </Button>
          )}
        </Tooltip>
      </Box>
    </li>
  );
};

const SpotifyForm = ({
  classes,
  handleFormSubmit,
  isSmScreen,
  isXsScreen,
  isLgScreen,
  isXlScreen,
  playlistName,
  setPlaylistName,
  playlistDescription,
  isPlaylistPublic,
  parameters,
  selectOpen,
  setSelectOpen,
  targetParams,
  handleTargetParamChange,
  handleTargetParamDelete,
  handleChange,
  invalidSearch,
  targetParamValues,
  tracks,
  artists,
  genres,
  markets,
  setTargetParamValues,
  handleSelectedOptions,
  setParameters,
  query,
  onSetQueryParameter,
  openModal,
  setOpenModal,
  isMdScreen,
  handleSubmit,
  onSubmit,
  handleReset,
}) => {
  return (
    <>
      <SpotifyAuth>
        {(accessToken, expiresAt) => {
          return (
            <>
              {Object.keys(parameters).map((parameter, index) => {
                return parameter === 'limit' || autocompleteParam.includes(parameter) ? (
                  <Box key={index}>
                    <Box>
                      {parameter === 'limit' ? (
                        <>
                          <Typography
                            paddingBottom='3px'
                            variant='subtitle2'
                            textAlign='center' 
                            color='white'
                          >
                            Choose the songs, artists, and genres you'd like to shape your recommendations.
                          </Typography>
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
                                MenuProps={{
                                  sx: {
                                    '.MuiPaper-root': {
                                      backgroundColor: '#30313d',
                                      color: 'white',
                                    },
                                  },
                                }}
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
                        : autocompleteParam.includes(parameter) && 
                        targetParams.includes(parameter) ? (
                          <Box 
                            display="flex" 
                            flexDirection='column' 
                            justifyContent="center" 
                            alignItems='center' 
                            style={{ marginBottom: '1%' }}
                          >
                            <AutocompleteParameter
                              parameter={parameter}
                              handleChange={(parameter, value) => {
                                handleChange(parameter, value);
                              } }
                              classes={classes}
                              invalidSearch={invalidSearch}
                              accessToken={accessToken}
                              expiresAt={expiresAt}
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
                  openModal={openModal}
                  setOpenModal={setOpenModal}
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
    <Grid className={classes.buttonsContainer}>
      <Tooltip
        title='Discover New Music'
        arrow
        >
        <Button
          type="submit"
          variant='contained'
          onClick={handleSubmit(onSubmit)}
          style={{ 
            color: 'white', 
            backgroundColor: 'transparent', 
            border: '2px solid rgba(89, 149, 192, 0.5)',
            borderRadius: '8px' ,
            boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
            '&:hover, &:active, &.Mui-focusVisible': {
              border: '2px solid rgba(89, 149, 192, 0.5)',
              background: 'rgba(48, 130, 164, 0.1)',
              boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
              backdropFilter: 'blur(5.1px)',
              WebkitBackdropFilter: 'blur(5.1px)',
            },
          }}
          >
          Try For Free
        </Button>         
      </Tooltip>
      <Tooltip
        title='Reset discovery parameters'
        arrow
        >
        <Button
          onClick={handleReset}
          style={{ color: 'white', backgroundColor: 'transparent' }}
          >
          Reset
        </Button>
      </Tooltip>
    </Grid>
    <br />
  </>
  )
};


const OpenAiForm = ({
  classes,
  handleFormSubmit,
  isSmScreen,
  isXsScreen,
  isLgScreen,
  isXlScreen,
  playlistName,
  setPlaylistName,
  playlistDescription,
  isPlaylistPublic,
  parameters,
  selectOpen,
  setSelectOpen,
  targetParams,
  handleTargetParamChange,
  handleTargetParamDelete,
  handleChange,
  invalidSearch,
  targetParamValues,
  tracks,
  artists,
  genres,
  markets,
  setTargetParamValues,
  handleSelectedOptions,
  setParameters,
  query,
  onSetQueryParameter,
  openModal,
  setOpenModal,
  isMdScreen,
  handleSubmit,
  onSubmit,
  handleReset,
}) => {

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() !== "") {
      setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
      const csrfToken = await getCSRFToken();
      const result = await fetch('http://localhost:8000/get-openai-initial-response/', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        method: 'post',
        body: JSON.stringify({ data: input }),
      });

      if (result.status == 200) {
        const response = await result.json()
        setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: response }]);
      };

      setInput("");
    }
  };
  
  const parseMessage = (responseObj) => {
    if (responseObj.status == "success") {

    };

    if (responseObj.status != "success") {
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: responseObj.message }])
    };
  };

  const handleInputChange = (e) => {
    setInput(e.target.value)
  };

  return (
    <>
      <Typography color='white' variant='body2'>
        Hi, I'm SongQuestGPT. 
        I'm' trained to generate playlists from user requests.
      </Typography>
      <Typography color='white' variant='body2'>
        Ask me to generate a playlist with the themes, moods, 
        genres, eras, sonic qualities, and artist prominence of your choosing
      </Typography>
      <Box 
        display='flex'
        flexDirection='column'
        // alignItems='center'
        className={classes.openaiChatField}
      >
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {messages.map((message) => (
            <Box
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'bot' ? "flex-start" : 'flex-end',
                mb: 2,
              }}
            >
              <Paper
                variant='outlined'
                sx={{
                  p: 1,
                  backgroundColor: message.sender === 'bot' ? '#0b1c2c' : 'secondary.light',
                  borderRadius: message.sender === 'bot' ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
                  color: message.sender === 'bot' ? 'white' : 'black'
                }}
              >
                <Typography variant='body1' style={{ whiteSpace: 'pre-line'}}>
                  {message.text.response}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            p: 2,
            borderRadius: '8px',
            height: '10vh',
            backgroundColor: '#8c8c8c'
          }}
        >
          <Grid item xs={10}>
            <TextField 
              fullWidth
              placeholder='Type a message'
              value={input}
              onChange={handleInputChange}
              sx={{ 
                input: { 
                  color: 'white',
                  background: '#30313d',
                },
              }}
              InputProps={{
                sx: {
                  borderRadius: '8px'
                }
              }}
              InputLabelProps={{
                sx: {
                  borderRadius: '8px'
                }
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              fullWidth
              size='small'
              sx={{
                color: 'white',
                backgroundColor: '#0b1c2c', 
                border: '2px solid rgba(89, 149, 192, 0.5)',
                boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
                '&:hover, &:active, &.Mui-focusVisible': {
                  border: '2px solid rgba(89, 149, 192, 0.5)',
                  background: 'rgba(11,28,44, 0.9)',
                  boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
                  backdropFilter: 'blur(5.1px)',
                  WebkitBackdropFilter: 'blur(5.1px)',
                }
              }}
              variant='contained'
              endIcon={<SendIcon />}
              onClick={handleSend}
            >
              Send
            </Button>
          </Grid>
        </Box>
      </Box>
    </>
  )
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
    currentPlaylist,
    playlists,
    onAddToCurrentPlaylist,
    onRemoveFromCurrentPlaylist,
    onCreatePlaylist,
    onDeletePlaylist,
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

  const [songsToAdd, setSongsToAdd] = useState([]);
  const [songsToRemove, setSongsToRemove] = useState([]);
  
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

  const [model, setModel] = useState('spotify');


  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');

  useEffect(() => {
          // Define an async function inside the useEffect
          async function fetchData() {
              const spotify_connection = searchParams.get('spotify_connection');

              // Check if access_token and refresh_token exist, and then remove them from the URL
              if (spotify_connection) {
                dispatch(confirmSpotifyAccess(spotify_connection))
                // Create a new URLSearchParams without the tokens
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.delete('spotify_connection');

                // Replace the URL without the tokens
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
    setOpenModal(false);

    // const newQuery = {
    //   song: songValue,
    //   performer: performerValue,
    // };
    try {
      if (createPlaylist) {
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
    setOpenModal(false);
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

  const [openModal, setOpenModal] = useState(false);

  const handleSelectedOptions = (parameter, selectedOptions) => {
    setTargetParamLabels(prevLabels => ({
      ...prevLabels,
      [parameter]: selectedOptions,
    }))
  };

  const handleExploreMoreClick = () => {
    // Smoothly scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // setCreatePlaylist(false);
  };

  const handleAddToSpotify = (recommendation) => {
    onAddToSpotify(recommendation, user?.user.email);
  };

  const handleCreatePlaylist = () => {
    const newPlaylist = {
      name: playlistName, 
      tracks: currentPlaylist
    }

    onCreatePlaylist(newPlaylist)
  };

  const handleDeletePlaylist = (playlistId) => {
    onDeletePlaylist(playlistId)
  }

  const classes = useStyles();
  const discoveryRecommendations = recommendations?.tracks
  
  const showTracks = discoveryRecommendations && dataLoaded
  
  const handleSelectAll = () => {
    songsToAdd.length === 0 ?
    setSongsToAdd(discoveryRecommendations) :
    setSongsToAdd([])
  };

  const handleBulkAdd = () => {
   onAddToCurrentPlaylist(...songsToAdd);
  };

  const handleBulkRemove = () => {
    onRemoveFromCurrentPlaylist(...songsToRemove);
  }

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

  const playlistItemInSongsToRemove = (id) => {
    return songsToRemove.some(obj => obj.id === id)
  };

  const handlePlaylistSelectClick = (item) => {
    if (playlistItemInSongsToRemove(item.id)) {
      setSongsToRemove(songsToRemove.filter(song => song.id !== item.id));
    } else {
      setSongsToRemove([...songsToRemove, item])
    };
  };

  const handlePlaylistSelectAll = () => {
      if (songsToRemove.length === 0) {
          setSongsToRemove(currentPlaylist);
      } else {
          setSongsToRemove([]);
      }
  };

  const isPlaylistItemChecked = (item) => {
    return songsToRemove.some(song => song.id === item.id);
  };

  const getPlaylistItems = (playlist) => {
    return (
      playlist.tracks.map((track, index) => (
        <Typography>
          {`${track.name} - ${track.artists.map((a) => ` ${a.name}`)}`}
        </Typography>
      )
    ))
  };
  console.log(model)

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
        <form 
          className={classes.form} 
          onSubmit={handleFormSubmit}
          style={(model === 'openai') ? { alignItems: 'center' } : null}
        >
          <CardHeader
            title={"🎵 Discover New Music, Customize Playlists, and Share Unique Finds 🎶"}
            titleTypographyProps={{
              width: '100%',
              variant: isSmScreen || isXsScreen
                ? 'h6'
                : 'h5',
              textAlign: 'center',
              color: 'white',
            }}
            subheader={!isXsScreen &&
              "Begin your journey by selecting the AI model you would like to copilot your quest"}
            // "Discover music with Song Explorer. Uncover new tunes based on your preferences - from similar songs to unique genres. Begin your musical journey now!"}
            subheaderTypographyProps={{
              width: '100%',
              variant: isXlScreen || isLgScreen
                ? 'body1'
                : 'body2',
              textAlign: 'center',
              color: 'whitesmoke',
            }} 
            classes={{
              root: classes.root
            }}
          />
          <Box display='flex' justifyContent='center'>
            <ButtonGroup disableElevation>
              <Button className={classes.button} onClick={() => setModel('spotify')}>
                <img
                    width='75px'
                    style={{
                    margin: '0 auto',
                    display: 'block', 
                    }}
                    src={'/static/images/spotifyLogo.png'}
                />
              </Button>
              <Button className={classes.button} onClick={() => setModel('openai')}>
                <img
                    width='70px'
                    style={{
                    margin: '0 auto',
                    display: 'block', 
                    }}
                    src={'/static/images/openai-white-lockup.png'}
                />
              </Button>
            </ButtonGroup>
          </Box>
         {model === 'spotify' ? (
            <SpotifyForm 
              classes={classes}
              handleFormSubmit={handleFormSubmit}
              isSmScreen={isSmScreen}
              isXsScreen={isXsScreen}
              isLgScreen={isLgScreen}
              isXlScreen={isXlScreen}
              playlistName={playlistName}
              setPlaylistName={setPlaylistName}
              playlistDescription={playlistDescription}
              isPlaylistPublic={isPlaylistPublic}
              parameters={parameters}
              selectOpen={selectOpen}
              setSelectOpen={setSelectOpen}
              targetParams={targetParams}
              handleTargetParamChange={handleTargetParamChange}
              handleTargetParamDelete={handleTargetParamDelete}
              handleChange={handleChange}
              invalidSearch={invalidSearch}
              targetParamValues={targetParamValues}
              tracks={tracks}
              artists={artists}
              genres={genres}
              markets={markets}
              setTargetParamValues={setTargetParamValues}
              handleSelectedOptions={handleSelectedOptions}
              setParameters={setParameters}
              query={query}
              onSetQueryParameter={onSetQueryParameter}
              openModal={openModal}
              setOpenModal={setOpenModal}
              isMdScreen={isMdScreen}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              handleReset={handleReset}
            />
          ) : (
            <OpenAiForm 
              classes={classes}
              handleFormSubmit={handleFormSubmit}
              isSmScreen={isSmScreen}
              isXsScreen={isXsScreen}
              isLgScreen={isLgScreen}
              isXlScreen={isXlScreen}
              playlistName={playlistName}
              setPlaylistName={setPlaylistName}
              playlistDescription={playlistDescription}
              isPlaylistPublic={isPlaylistPublic}
              parameters={parameters}
              selectOpen={selectOpen}
              setSelectOpen={setSelectOpen}
              targetParams={targetParams}
              handleTargetParamChange={handleTargetParamChange}
              handleTargetParamDelete={handleTargetParamDelete}
              handleChange={handleChange}
              invalidSearch={invalidSearch}
              targetParamValues={targetParamValues}
              tracks={tracks}
              artists={artists}
              genres={genres}
              markets={markets}
              setTargetParamValues={setTargetParamValues}
              handleSelectedOptions={handleSelectedOptions}
              setParameters={setParameters}
              query={query}
              onSetQueryParameter={onSetQueryParameter}
              openModal={openModal}
              setOpenModal={setOpenModal}
              isMdScreen={isMdScreen}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              handleReset={handleReset}
            />
          )}
        </form>
      </Box>
      <Box
        display='flex'
        flexDirection='row'
        justifyContent='center'
        width='100%'
      >
        <Card className={classes.sidePanel}>
          <Box 
            display='flex' 
            alignItems='center' 
            justifyContent='space-between'
            padding='20px 0 20px 20px'
          >
            <Tooltip
              title='Select all playlists'
            >
              <Checkbox sx={{ padding: '0px', color: 'white' }}/>
            </Tooltip>
            <Typography variant='body1' textAlign='center' paddingLeft='20px'>
              Your Playlists
            </Typography>
            <Tooltip
              title='Delete selected playlists'
            >
              <Button
                sx={{ padding: '0 0 0 20px'}}
                onClick={() => handleDeletePlaylist()}
              >
                <PlaylistRemoveIcon />
              </Button>
            </Tooltip>
          </Box>
          {playlists.length === 0 ? (
            <>
              <Typography variant='subtitle2' textAlign='center' padding='20px'>
                You have not created any playlists. 
              </Typography>
              <Typography variant='subtitle2' textAlign='center' padding='20px'>
                Use tokens to create playlists and share your finds. 
              </Typography>
            </>
          ) : playlists.map((playlist) => {
            return (
              <Accordion
                sx={{
                  backgroundColor: 'transparent',
                  color: 'white',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color='primary' />}
                >
                  <Box display='flex' alignItems='center'>
                    <Checkbox 
                      onClick={(event) => event.stopPropagation()} 
                      sx={{
                        color: 'white',
                      }}
                    />
                    <Typography marginLeft='5px' variant='body2'>
                      {playlist.name}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {getPlaylistItems(playlist)}
                </AccordionDetails>
              </Accordion>
            )
          })}
        </Card>
          <Box backgroundColor='transparent' width='53%'>
            {isLoading && (
              <Box backgroundColor='transparent' width='100%' paddingBottom='5%'>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
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
              <Box backgroundColor='transparent' width='95%'>
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
                <Box 
                  display='flex' 
                  justifyContent='space-between' 
                  marginLeft='20px' 
                  width='100%'
                >
                  <Tooltip
                    title={songsToAdd.length === 0 ? 'Select all discovery results' : 'Deselect all discovery results'}
                  >
                    <Button onClick={handleSelectAll}>
                      <Typography 
                        color='white' 
                        variant='subtitle1'
                      >
                        {songsToAdd.length === 0 ? 'Select All' : 'Deselect All'}
                      </Typography>
                    </Button>
                  </Tooltip>
                  <Tooltip
                    title='Add selected to playlist'
                  >
                    <Button marginRight='-10px' onClick={handleBulkAdd}>
                      <PlaylistAddIcon fontSize='large' color='primary'/>
                    </Button>
                  </Tooltip>
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
                      currentPlaylist={currentPlaylist}
                      onAddToCurrentPlaylist={onAddToCurrentPlaylist}
                      onRemoveFromCurrentPlaylist={onRemoveFromCurrentPlaylist}
                      songsToAdd={songsToAdd}
                      setSongsToAdd={setSongsToAdd}
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
          </Box>
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
                        // icon={<CircleIcon color='primary' fontSize='small'/>}
                        // checkedIcon={<CheckCircleIcon fontSize='small'/>}
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
                  {/* <Tooltip
                    title='Remove from playlist'
                  >
                    <RemoveCircleIcon />
                  </Tooltip> */}
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
      </Box>
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
    currentPlaylist: state.playlist.currentPlaylist,
    playlists: state.playlist.playlists,
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
  handleCheckUsersTracks: (recommendation, email) => dispatch(checkUsersTracks(recommendation, email)),
  handleRemoveUsersTracks: (recommendation, spotify_access, spotify_refresh, spotify_expires_at) => dispatch(removeUsersTracks(recommendation, spotify_access, spotify_refresh, spotify_expires_at)),
  onAddToCurrentPlaylist: (...songs) => dispatch(addToCurrentPlaylist(...songs)),
  onRemoveFromCurrentPlaylist: (...songs) => dispatch(removeFromCurrentPlaylist(...songs)),
  onCreatePlaylist: (playlist) => dispatch(createPlaylist(playlist)),
  onDeletePlaylist: (plalistId) => {dispatch(deletePlaylist(plalistId))},
});

export default connect(mapStateToProps, mapDispatchToProps)(SongDiscovery);