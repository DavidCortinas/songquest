import { Box, Button, CardHeader, FormControl, Grid, TextField, useMediaQuery } from "@mui/material";
import { makeStyles, useTheme } from '@mui/styles';
import { useEffect, useState } from "react";
import theme from '../theme'
import { SpotifyAuth, getSpotifySearchResult, sendLyricsToServer } from "../thunks";
import { useForm } from "react-hook-form";
import { connect, useDispatch } from "react-redux";

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
    width: '90%'
  },
  textField: {
    marginLeft: '8px',
    width: '66%',
    [theme.breakpoints.down('sm')]: {
      width: '80%',
    },
    backgroundColor: 'white',
    borderRadius: '5px',
  },
  resultsField: {
    width: '15%',
    [theme.breakpoints.down('md')]: {
      width: '80%',
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
      width: '80%',
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
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '2%',
  },
}));

export const LyricSearch = (lyricResults) => {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();

    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
    const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

    const [connnectToSpotify, setConnectToSpotify] = useState(false);
    const [lyrics, setLyrics] = useState('');

    const handleReset = () => {
        setLyrics('');
    };

    const onSubmit = async (accessToken) => {
        const tracks = await sendLyricsToServer(lyrics);

        // Extracting track_name and artist_name
        const extractedTracks = tracks.map((track) => {
            return `${track.track_name} - ${track.artist_name}`
        });

        if (extractedTracks) { 
            const spotifyResults = tracks.map((track) => {
                dispatch(getSpotifySearchResult(track, 'lyrics', accessToken))
            });
        };
    };

    const { handleSubmit } = useForm();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    }

    const searchResults = lyricResults?.tracks

    useEffect(() => {
        console.log('lyricResults: ', lyricResults)
        console.log('searchResults:', searchResults)
    }, [lyricResults, searchResults])

    return (
        <Box
            sx={{
            minHeight: '20rem',
            width: '100%',
            backgroundImage: 'linear-gradient(to bottom right, #004b7f, #006f96, #0090c3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            }}
        >
            <SpotifyAuth>
                {(accessToken) => (
                    <form className={classes.form} onSubmit={handleFormSubmit}>
                        <CardHeader
                            title={"🎵 Find Song by Lyrics 🎶"}
                            titleTypographyProps={{
                            width: '100%',
                            variant: isSmScreen || isXsScreen
                                ? 'h6'
                                : 'h5',
                            textAlign: 'center',
                            color: 'white',
                            paddingTop: '2%',
                            }}
                            subheader={"Have a song in your head but can't remember the name? Use the lyrics to finally find that song you've been looking for!"}
                            // "Discover music with Song Explorer. Uncover new tunes based on your preferences - from similar songs to unique genres. Begin your musical journey now!"}
                            subheaderTypographyProps={{
                            width: '100%',
                            variant: isXlScreen || isLgScreen
                                ? 'body1'
                                : 'body2',
                            textAlign: 'center',
                            color: 'whitesmoke',
                            }} 
                        />
                        <Box
                        display="flex"
                        flexDirection={(isXsScreen || isSmScreen) ? "column" : "row"}
                        justifyContent='center'
                        alignItems={(isXsScreen || isSmScreen) ? "center" : "flex-start"}
                        style={{ marginBottom: '1%' }}
                        >
                            <FormControl style={{ width: '50%' }}>
                                <TextField 
                                    label="Enter Song Lyrics"
                                    value={lyrics}
                                    style={{ 
                                        backgroundColor: 'white',
                                    }}
                                    onChange={(e) => setLyrics(e.target.value)}
                                />
                            </FormControl>
                        </Box>
                        <Grid className={classes.buttonsContainer}>
                            <Button
                            type="submit"
                            onClick={handleSubmit(() => onSubmit(accessToken))}
                            style={{ color: 'white', backgroundColor: 'transparent' }}
                            >
                            Submit
                            </Button>
                            <Button
                            onClick={handleReset}
                            style={{ color: 'white', backgroundColor: 'transparent' }}
                            >
                            Reset
                            </Button>
                        </Grid>
                    </form>
                )}
            </SpotifyAuth>
        </Box>
    )
};

const mapStateToProps = (state) => {
    console.log('state: ', state)
    return {
        lyricResults: state.discovery.lyricResults,
    };
};

export default connect(mapStateToProps)(LyricSearch);