import { 
  Box, 
  Button, 
  Card, 
  CardHeader, 
  Chip, 
  FormControl, 
  Grid, 
  InputLabel, 
  Menu, 
  MenuItem,  
  Select,  
  Tooltip, 
  Typography, 
  useMediaQuery
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { SpotifyAuth, discoverSongRequest, getRequestParameters, getSpotifyArtists, getSpotifyTracks } from "../../thunks";
import theme from "theme";
import { SearchParameter } from "./SearchParameter";
import { lazy, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { clearSeedsArray, resetDataLoaded, resetQueryParameter, setQueryParameter } from "actions";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { initialDiscoveryState } from "reducers";
import { toCapitalCase } from "utils";
import { getCode } from "iso-3166-1-alpha-2";

const SliderModal = lazy(() => import('./SliderModal'));
const AutocompleteParameter = lazy(() => import('./AutocompleteParameter'));

export const autocompleteParam = ['songs', 'performers', 'genres', 'market']

const labelMapping = {
  acousticness: 'acousticness',
  danceability: 'danceability',
  duration_ms: 'length',
  energy: 'energy',
  instrumentalness: 'instrumentalness',
  key: 'key',
  liveness: 'liveness',
  loudness: 'loudness',
  mode: 'modality',
  popularity: 'popularity',
  speechiness: 'speechiness',
  tempo: 'tempo',
  time_signature: 'time-signature',
  valence: 'positiveness',
  // Add more mappings as needed
};

const SpotifyForm = ({
  classes,
  parameters,
  setIsLoading,
  tracks,
  artists,
  genres,
  markets,
  setParameters,
  query,
  savedQueries,
  user,
  onSearchPressed,
  onClearSeedsArray,
  onSetQueryParameter,
  onResetDataLoaded,
  onResetQueryParameter,
  onGetRequestParameters,
}) => {
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [selectOpen, setSelectOpen] = useState(false);
  const [invalidSearch, setInvalidSearch] = useState(false);
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
  const [selectedOptions, setSelectedOptions] = useState({
    songs: [],
    performers: [],
    genres: [],
    markets: [],
  });
  const [localSelectedOptions, setLocalSelectedOptions] = useState(selectedOptions);


  const handleTargetParamChange = (e) => {
    setSelectOpen(!selectOpen);
    setTargetParams(e.target.value);
  };

  const handleTargetParamDelete = (value) => {
    setTargetParams((prevTargetParam) =>
      prevTargetParam.filter((param) => param !== value)
    )
  };

  const handleSelectedOptions = (parameter, selectedOptions) => {
    setTargetParamLabels(prevLabels => ({
      ...prevLabels,
      [parameter]: selectedOptions,
    }));

    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [parameter]: selectedOptions,
    }));
  };

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

  const handleReset = () => {
    setInvalidSearch(false);
    setParameters(initialDiscoveryState.query);
    setTargetParams([]);
    setTargetParamLabels({
        songs: [],
        performers: [],
        genres: [],
    });
    setTargetParamValues({
        songs: [],
        performers: [],
        genres: [],
    });
    onResetDataLoaded();
    onResetQueryParameter(); 
  };

  const { handleSubmit } = useForm();

  const onSubmit = () => {
    setIsLoading(true);
    setLocalSelectedOptions({
      songs: [],
      performers: [],
      genres: [],
      markets: [],
    });
    startTransition(() => {
      onSearchPressed(parameters)
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.log('Error: ', error);
      })
      .finally(() => {
        setIsLoading(false);
        setParameters(initialDiscoveryState.query);
        onResetQueryParameter();
        onClearSeedsArray();
      })
    })
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); 
    onSubmit();
  };

  const handleViewSavedRequests = (e) => {
    onGetRequestParameters(user?.user.id);
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();

  const handleSelectSavedQuery = async (savedQuery) => {
    handleCloseMenu();
    const fetchData = async (ids, actionCreator) => {
      try {
        const data = await dispatch(actionCreator(user?.user.id, ids));
        return data || [];
      } catch (error) {
        console.error('Error fetching Spotify data:', error.message);
        return [];
      }
    };

    const fetchedTracks = await fetchData(savedQuery.query.songs, getSpotifyTracks);
    const formattedTracks = fetchedTracks.map(track => `${track.name} - ${track.artists[0].name}`);

    const fetchedArtists = await fetchData(savedQuery.query.performers, getSpotifyArtists);
    const formattedArtists = fetchedArtists.map(artist => artist.name);

    setLocalSelectedOptions({
      songs: formattedTracks || [],
      performers: formattedArtists || [],
      genres: savedQuery.query.genres || [],
      market: savedQuery.query.market ? [getCode(savedQuery.query.market)] : [],
    });

    setTargetParamValues({
      songs: formattedTracks || [],
      performers: formattedArtists || [],
      genres: savedQuery.query.genres || [],
      market: savedQuery.query.market ? [getCode(savedQuery.query.market)] : [],
    });

    setParameters((prevParameters) => ({
      ...prevParameters,
      songs: savedQuery.query.songs || [],
      performers: savedQuery.query.performers || [],
      genres: savedQuery.query.genres || [],
      market: savedQuery.query.market ? [getCode(savedQuery.query.market)] : [],
      limit: savedQuery.query.limit || 10,
    }));

    Object.keys(savedQuery.query).forEach((param) => {
      const paramValue = savedQuery.query[param];

      if (paramValue && typeof paramValue === 'object' && 'min' in paramValue) {
        const { min, target, max, label } = paramValue;
        const mappedLabel = labelMapping[param] || param;

        setParameters((prevParameters) => ({
          ...prevParameters,
          [param]: {
            min: min,
            target: target,
            max: max,
            label: mappedLabel,
          },
        }));

        onSetQueryParameter(savedQuery.query, param, [min, target, max]);
      }
    });

  };
  
  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <form className={classes.form} onSubmit={handleFormSubmit}>
          <CardHeader
            title={"Unearth New Music, Find Hidden Gems, and Build Your Collection"}
            // title={"🎵 Discover New Music, Customize Playlists, and Share Unique Finds 🎶"}
            titleTypographyProps={{
              width: '100%',
              variant: isXsScreen ?
                'subtitle1' :
                isSmScreen ? 
                'h6' : 
                'h5',
              textAlign: 'center',
              color: 'white',
              letterSpacing: '1px',
            }}
            // subheader={!isXsScreen &&
            //   "Begin your journey by selecting the AI model you would like to copilot your quest"}
            subheaderTypographyProps={{
              width: '100%',
              variant: isXsScreen ?
                'caption' :
                isSmScreen ? 
                'body2' :
                'body1',
              textAlign: 'center',
              color: theme.palette.primary.triadic2,
            }} 
            classes={{
              root: classes.root
            }}
          />
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
                                color={'whitesmoke'}
                                letterSpacing='1px'
                              >
                                Choose the songs, artists, and genres you'd like to shape your recommendations.
                              </Typography>
                              <Box display='flex' justifyContent='center'>
                              {user?.user && (
                                <Tooltip
                                  arrow
                                  placement="top"
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
                                        {'View your saved requests'}
                                      </Typography>
                                    </div>
                                  }
                                >
                                  <Card 
                                    className={classes.panelCard}
                                    onClick={handleViewSavedRequests}
                                  >
                                    <Box display='flex'>
                                      <BookmarkIcon 
                                        style={{ 
                                          color: theme.palette.primary.analogous1
                                        }} 
                                        fontSize='small' 
                                      />
                                      <Typography  
                                        variant={isXsScreen ? 'body2' : 'subtitle2' }
                                        color='white'
                                        letterSpacing='1px'
                                        sx={{
                                          fontWeight: isXsScreen ? 'normal' : 'bold',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        Saved Requests
                                      </Typography>
                                    </Box>
                                  </Card>                               
                                </Tooltip>
                              )}
                              <Menu
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleCloseMenu}
                                anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'center',
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'center',
                                }}
                                classes={{ paper: classes.paper }}
                              >
                                {savedQueries.saved.map((savedQuery) => (
                                  <MenuItem onClick={() => handleSelectSavedQuery(savedQuery)} sx={{ color: 'white' }}>
                                    {savedQuery.name}
                                  </MenuItem>
                                ))}
                              </Menu>
                              </Box>
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
                                              height: isXsScreen ? '24px' : null,
                                              fontSize: isXsScreen ? '0.75rem' : null,
                                              padding: isXsScreen ? '0' : null,
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
                                letterSpacing='1px'
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
                          ) : autocompleteParam.includes(parameter) && 
                            targetParams.includes(parameter) && (
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
                                  onSelectedOptions={handleSelectedOptions}
                                  localSelectedOptions={localSelectedOptions}
                                  setLocalSelectedOptions={setLocalSelectedOptions}
                                />
                              </Box>
                            )}
                        </Box>
                      </Box>
                    ) : null;
                  })}
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
                            {'Adjust your discovery settings'}
                          </Typography>
                        </div>
                      }
                  >
                    <Button 
                      sx={{
                          alignSelf: 'center', 
                          color: 'white', 
                          borderRadius: '18px',
                          background: `rgb(121, 44, 216, 0.3)`,
                          height: isXsScreen ? '50px' : '55px',
                          border: `2px solid ${theme.palette.primary.triadic1}`,
                          boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
                          textTransform: 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '2%',
                          width: (isLgScreen || isXlScreen) ? '66%' : '100%',
                          '&:hover, &:active, &.MuiFocusVisible': {
                            border: `2px solid ${theme.palette.primary.triadic1}`,
                            background: `rgb(121, 44, 216, 0.5)`,
                            boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
                          },
                      }} 
                      // fullWidth
                      variant='outlined'
                      onClick={() => setOpenModal(true)}
                      disableRipple
                    >
                      <Typography letterSpacing='1px' variant={isXsScreen ? 'body2' : "body1"}>
                        Fine Tune Your Recommendations
                      </Typography>
                      <Typography 
                        color={'#f6f8fc'} 
                        variant='caption' 
                        textAlign='end'
                        letterSpacing='1px'
                        sx={{
                          ...(isXsScreen && {
                            fontSize: '0.675rem', // Example of making the font size smaller for xs screens
                            // Add any other style adjustments here
                          })
                        }}
                      >
                        {
                          isXsScreen || isSmScreen ? 
                          "* activate parameters and set the min, target, and max values" : 
                          "* activate additional parameters and set the min, target, and max values to refine your recommendations"
                        }
                      </Typography>
                      <SettingsSuggestIcon />
                    </Button>
                  </Tooltip>
                  <Box className={classes.modal}>
                    <SliderModal
                      autocompleteParam={autocompleteParam}
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
                      classes={classes}
                    />
                  </Box>
                </>
              )
            }}
          </SpotifyAuth>
          <Grid className={classes.buttonsContainer}>
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
                    {'Discover New Music'}
                  </Typography>
                </div>
              }
              arrow
              >
              <Button
                type="submit"
                variant='contained'
                onClick={handleSubmit(onSubmit)}
                className={classes.button}
              >
                {user?.user ? 'Discover' : 'Try For Free'}
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
                    {'Reset discovery parameters'}
                  </Typography>
                </div>
              }
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
        </form>
      </Box>
    </>
  )
};

const mapStateToProps = (state) => {
  return {
    tracks: state.discovery.tracks,
    artists: state.discovery.artists,
    markets: state.discovery.markets,
    genres: state.discovery.genres,
    query: state.discovery.query,
    savedQueries: state.discovery.savedQueries,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSearchPressed: (query) => dispatch(discoverSongRequest(query)),
  onClearSeedsArray: () => dispatch(clearSeedsArray()),
  onResetQueryParameter: () =>
    dispatch(resetQueryParameter()),
  onResetDataLoaded: () =>
    dispatch(resetDataLoaded()),
  onSetQueryParameter: (query, parameter, newValues) => dispatch(setQueryParameter(query, parameter, newValues)),
  onGetRequestParameters: (userId) => dispatch(getRequestParameters(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpotifyForm);