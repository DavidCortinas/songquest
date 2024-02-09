import { 
  Box, 
  Button, 
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
import SettingsIcon from '@mui/icons-material/Settings';
import { SpotifyAuth } from "../../thunks";
import { AutocompleteParameter } from "./AutocompleteParameter";
import theme from "theme";
import { SearchParameter } from "./SearchParameter";
import { lazy, useState } from "react";
import { connect } from "react-redux";
import { resetDataLoaded, resetQueryParameter, setQueryParameter } from "actions";

const SliderModal = lazy(() => import('./SliderModal'));

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

const SpotifyForm = ({
  classes,
  parameters,
  tracks,
  artists,
  genres,
  markets,
  setParameters,
  query,
  onSetQueryParameter,
  onResetDataLoaded,
  onResetQueryParameter,
  openModal,
  setOpenModal,
  handleSubmit,
  onSubmit,
}) => {
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

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
    }))
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
                            letterSpacing='1px'
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
                              onSelectedOptions={handleSelectedOptions} />
                          </Box>
                        )}
                    </Box>
                  </Box>
                ) : null;
              })}
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
                <SettingsIcon />
                </Button>
            </Tooltip>
              <Box className={classes.accordion}>
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
            '&:hover, &:active, &.MuiFocusVisible': {
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
  onResetQueryParameter: () =>
    dispatch(resetQueryParameter()),
  onResetDataLoaded: () =>
    dispatch(resetDataLoaded()),
  onSetQueryParameter: (query, parameter, newValues) => dispatch(setQueryParameter(query, parameter, newValues)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpotifyForm);