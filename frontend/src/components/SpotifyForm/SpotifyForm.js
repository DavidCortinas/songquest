import { 
  Box, 
  Button, 
  CardHeader, 
  Chip, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem,  
  Select,  
  Tooltip, 
  Typography, 
  useMediaQuery
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import { SpotifyAuth, discoverSongRequest } from "../../thunks";
import theme from "theme";
import { SearchParameter } from "./SearchParameter";
import { lazy, useState } from "react";
import { connect } from "react-redux";
import { clearSeedsArray, resetDataLoaded, resetQueryParameter, setQueryParameter } from "actions";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { initialDiscoveryState } from "reducers";
import { toCapitalCase } from "utils";

const SliderModal = lazy(() => import('./SliderModal'));
const AutocompleteParameter = lazy(() => import('./AutocompleteParameter'));

export const autocompleteParam = ['songs', 'performers', 'genres', 'market']

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
  user,
  onSearchPressed,
  onClearSeedsArray,
  onSetQueryParameter,
  onResetDataLoaded,
  onResetQueryParameter,
}) => {
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

  const [openModal, setOpenModal] = useState(false);
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
    console.log('handleSelection')
    console.log(parameter)
    console.log(selectedOptions)
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

  const { handleSubmit } = useForm();

  const onSubmit = () => {
    console.log('submit parameters: ', parameters)
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
            title={"🎵 Discover New Music, Customize Playlists, and Share Unique Finds 🎶"}
            titleTypographyProps={{
              width: '100%',
              variant: isSmScreen || isXsScreen
                ? 'h6'
                : 'h5',
              textAlign: 'center',
              color: 'white',
              letterSpacing: '1px',
            }}
            // subheader={!isXsScreen &&
            //   "Begin your journey by selecting the AI model you would like to copilot your quest"}
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
                                letterSpacing='1px'
                              >
                                Choose the songs, artists, and genres you'd like to shape your recommendations.
                              </Typography>
                              <Box>
                                <Button>
                                  Saved Request Parameters
                                </Button>
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
                          color: 'white', 
                          borderRadius: '18px',
                          height: '55px',
                          border: '2px solid rgba(89, 149, 192, 0.5)',
                          boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
                          textTransform: 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          '&:hover, &:active, &.MuiFocusVisible': {
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
                    <Typography letterSpacing='1px'>
                      Fine Tune Your Recommendations
                    </Typography>
                    <Typography 
                      color='#f6f8fc' 
                      variant='caption' 
                      textAlign='end'
                      letterSpacing='1px'
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
});

export default connect(mapStateToProps, mapDispatchToProps)(SpotifyForm);