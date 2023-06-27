import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  Alert,
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  Grid,
  Snackbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { makeStyles, useTheme } from '@mui/styles';
import { searchSongRequest } from '../thunks';
import { clearSearchSongError, searchSongSuccess } from '../actions';
import '../App.css';
import { LoadingState } from './LoadingState';

const useStyles = makeStyles((theme) => (
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
    backgroundColor: "white",
  },
  textField: {
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '40%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '50%',
    },
    backgroundColor: 'white',
    borderRadius: '5px',
  },
  subHeader: {
    width: '40%',
    [theme.breakpoints.up('sm')]: {
      width: '25rem',
    },
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
  },
  noBottomLine: {
    borderBottom: 'none',
  }
}));

export const SongForm = ({ error, onSearchPressed, onDataLoaded }) => {
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));


  const { handleSubmit } = useForm();
  const [songValue, setSongValue] = useState('');
  const [performerValue, setPerformerValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [invalidSearch, setInvalidSearch] = useState(false);

  const dispatch = useDispatch();

  const handleSnackbarClose = () => {
    dispatch(clearSearchSongError());
  };

  const onSubmit = async () => {
    if (songValue === '') {
      // Empty song value, set invalidSearch to true and exit the onSubmit process
      setInvalidSearch(true);
      return;
    }
    setIsLoading(true);

    const newQuery = {
      song: songValue,
      performer: performerValue,
    };
    try {
      const songData = await onSearchPressed(newQuery);
      onDataLoaded(songData, newQuery);
      setIsLoading(false);
    } catch (error) {
      console.log('Error: ', error);
      setIsLoading(false);
    }
  };

  const handleSongChange = (e) => {
    setInvalidSearch(false);
    setSongValue(e.target.value);
  };
  const handlePerformerChange = (e) => setPerformerValue(e.target.value);
  const handleReset = () => {
    setInvalidSearch(false);
    setSongValue('');
    setPerformerValue('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    onSubmit(); // Call the onSubmit function manually
  };

  const classes = useStyles();

  return isLoading && !invalidSearch ? (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="30vh"
      >
        <CardHeader
          title="Loading Results"
          titleTypographyProps={{ color: 'black' }}
          subheader="Be sure to include the name of the artist who performs the song for the quickest and most accurate search result..."
          subheaderTypographyProps={{ color: 'black' }}
        />
      </Box>
      <LoadingState />
    </>
  ) : (
    <>
      <Box display="flex" justifyContent="center" paddingTop='1rem'>
        <Box width={isSmScreen || isXsScreen ? "75%" : "50%"}>
          <Card className={classes.card}>
            <form className={classes.form} onSubmit={handleFormSubmit}>
              {/* <FormControl> */}
                <CardHeader
                  title="Song Search"
                  titleTypographyProps={{
                    width: isSmScreen ? '100%' : '28rem',
                    variant: isSmScreen || isXsScreen
                    ? 'h6'
                    : 'h5',
                    textAlign: 'center',
                    color: 'black',
                  }}
                  subheader={!isXsScreen && "Be sure to include the name of the artist who performs the song for the quickest and most accurate search result"}
                  subheaderTypographyProps={{ 
                    width: isSmScreen || isXsScreen ? '100%' : '28rem', 
                    variant: isXlScreen || isLgScreen 
                      ? 'body1'
                      : 'body2',
                    textAlign: 'center',
                    color: 'black',
                    }}
                />
                <Box display="flex" justifyContent="center" style={{ marginBottom: '4%' }}>
                  <TextField
                    autoFocus
                    variant='outlined'
                    InputLabelProps={{ style: { margin: '2px 5px' }}}
                    InputProps={{ disableUnderline: 'true', style: { margin: '5px', padding: '5px 0' } }}
                    error={invalidSearch}
                    required
                    className={classes.textField}
                    onChange={handleSongChange}
                    value={songValue}
                    label={invalidSearch ? 'Error' : 'Song'}
                  />
                </Box>
                <Box display="flex" justifyContent="center">
                  <TextField
                    variant='outlined'
                    InputLabelProps={{ style: { margin: '2px 5px' }}}
                    InputProps={{ disableUnderline: 'true', style: { margin: '5px', padding: '5px 0' } }}
                    className={classes.textField}
                    onChange={handlePerformerChange}
                    value={performerValue}
                    label="Performer"
                  />
                </Box>
                <br />
                <br />
                <Grid className={classes.buttonsContainer}>
                  <Button
                    type="submit"
                    className={classes.button}
                    onClick={handleSubmit(onSubmit)}
                  >
                    Submit
                  </Button>
                  <Button className={classes.button} onClick={handleReset}>
                    Reset
                  </Button>
                </Grid>
                <br />
              {/* </FormControl> */}
            </form>
          </Card>
        </Box>
      </Box>
      {/* Snackbar for displaying errors */}
      <Snackbar
        open={!!error}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          elevation={6}
          variant="filled"
        >
          <Typography>
            {
              "There were no results returned for your search, please make sure the song's spelling is correct and enter the performer for more accurate search results"
            }
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    songData: state.song.songData,
    query: state.song.query || {},
    error: state.song.error,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSearchPressed: (query) => dispatch(searchSongRequest(query)),
  onDataLoaded: (songData, query) =>
    dispatch(searchSongSuccess(songData, query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SongForm);
