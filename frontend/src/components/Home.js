import { 
    Box, 
    Button, 
    Card, 
    Paper, 
    MobileStepper, 
    Tooltip, 
    Typography, 
    useMediaQuery, 
    Grid,
    CardHeader} from "@mui/material"
import { makeStyles } from '@mui/styles';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import SpatialAudioIcon from '@mui/icons-material/SpatialAudio'
import SearchIcon from '@mui/icons-material/Search';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { Link } from "react-router-dom";
import theme from "../theme";
import { connect } from "react-redux";
import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import SongDiscovery from "./SongDiscovery";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => (
    {
        root: {
            flexGrow: 1,
        },
        cardGrid: {
            padding: '3% 0 3% 5%',
            // [theme.breakpoints.down('sm')]: {
            //     padding: '3% 3% 5% 2%',
            //     width: '95%',
            // }
        },
        card: {
            padding: theme.spacing(2),
            textAlign: 'center',
            width: '75%',
            height: '95%',
            [theme.breakpoints.down('sm')]: {
                width: '90%',
                height: '250px',
                padding: 10
            }
        },
        fourthCard: {
            marginTop: '2%',
            width: '92%',
            height: '200px',
            [theme.breakpoints.down('sm')]: {
                width: '90%',
                height: '250px'
            }
        },
        introBox: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            // paddingBottom: '1rem',
        },
        intro: {
            color: 'white',
            // paddingTop: '1rem',
            // justifyContent: 'center',
            textAlign: 'center',
            width: '70%',
            [theme.breakpoints.down('sm')]: {
                width: '85%',
            },
            // marginTop: '15px',
        },
          link: {
            textDecoration: 'none', // Remove underline
            color: 'inherit', // Inherit text color from the parent
            '&:hover': {
            textDecoration: 'none', // Remove underline on hover
            },
        },
        subIntro: {
            color: 'white',
            width: '70%',
            textAlign: 'center',
            [theme.breakpoints.down('sm')]: {
                width: '85%',
            },
            marginTop: '15px',
        },
        optionsContainerColumns: {
            display: 'flex',
            justifyContent: 'space-around',
            width: '35rem',
            margin: 'auto',
            padding: '0',
            height: '15rem',
        },  
        optionsContainerRows: {
            display: 'inline-flex',
            justifyContent: 'space-between',
            width: '70%',
            margin: '5% auto',
            height: '200px',
            paddingLeft: '1%',
        }, 
        optionsBox: {
            // textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            width: '80%', // Adjust as needed
            margin: '0 2%', // Add some margin between the boxes
        },
        optionsBar: {
            textAlign: 'center',
            // display: 'flex',
            width: '90%',
            margin: 'auto',
            height: '75px'
        },
        optionsLink: {
            textDecoration: 'none',
            width: '100%',
            display: 'flex',
        },
        optionsLinkDisabled: {
            textDecoration: 'none',
            width: '100%',
            display: 'flex',
            opacity: '0.5',
        },
        optionsCard: {
            width: '100%',
            backgroundColor: 'white',
            flexDirection: 'column',
            border: '1px solid #b0b0b0',
        },
        optionsCardDisabled: {
            width: '100%',
            backgroundColor: 'white',
            flexDirection: 'column',
            border: '1px solid #b0b0b0',
            opacity: '0.5',
        },
        optionsText: {
            color: '#006f96',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50%',
            padding: '5px',
        },      
        optionsIcon: {
            color: '#000000',
        },      
    }
))

const copy = {
    section: [
        {
            emoji: "🔮",
            header: "Unlock a World of Music",
            description: "Discover a universe of melodies, beats, and harmonies, all thoughtfully curated for you. We leverage Spotify's powerful recommendation algorithm to handpick selections based on your unique tastes, ensuring you find the perfect tunes for your search.",
            mobileDescription: "We leverage Spotify's powerful recommendation algorithm to handpick selections based on your unique tastes, ensuring you find the perfect tunes for your search.",
        },
        {
            emoji: "🎸",
            header: "Fine-Tune Your Sound Journey",
            description: "Take control of your musical adventure like never before. With SongQuest, you have the power to fine-tune your recommendations. Want tracks with a touch of acoustic warmth? Or perhaps something that'll get you grooving on the dance floor? You're in charge!",
            mobileDescription: 'Take control of your musical adventure like never before. With SongQuest, you have the power to fine-tune your recommendations.',
        },
        {
            emoji: "📊",
            header: "Set Your Musical Parameters",
            description: "Explore the musical spectrum with parameters like acousticness, danceability, duration, energy, instrumentalness, key, liveliness, loudness, mode, popularity, speechiness, tempo, time signature, and valence. Customize your music discovery experience down to the finest detail.",
            mobileDescription: 'Customize your music discovery experience down to the finest detail.',
        },
        {
            emoji: "🎉",
            header: "Your Journey Starts Here",
            description: "Ready to embark on a musical journey like no other? Enter up to five recommendation sources, including songs, artists, and genres, above and activate the fine tuning parameters to dial up just the right sound you are looking for and let your musical journey begin.",
            mobileDescription: 'Enter up to five recommendation sources above and activate the fine tuning parameters to discover new music.',
        },
    ]
};

export const Body = ({ 
    isSmScreen, 
    isXsScreen, 
    isMdScreen,
    isLgScreen, 
    isXlScreen 
}) => {
    const classes = useStyles();

    return (
        <Box flex="row" backgroundColor="#f6f8fc">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                paddingTop='5%'
            >
                <Typography variant="h4" textAlign='center'>
                    Advanced Features
                </Typography>
                <Typography 
                    textAlign='center' 
                    variant={isXsScreen || isSmScreen ? "body1" : "h6"} 
                    width='80%'
                >
                    {
                        isXsScreen || isSmScreen ?
                        "Discover music effortlessly. Explore recommendations based on song, artist, genre, or a blend of sources. Use Spotify's audio analysis tools to pinpoint the desired sound." : 
                        "Discover music effortlessly by exploring recommendations based on song, artist, genre, or a blend of sources. Utilize Spotify's audio analysis tools to pinpoint the desired sound."
                    }
                </Typography>
            </Box>
            <Grid container spacing={2} className={classes.cardGrid}>
                {copy.section.slice(0, 3).map((item, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Card className={classes.card}>
                            <Typography variant="h2">{item.emoji}</Typography>
                            <CardHeader 
                            title={item.header}
                            subheader={!isSmScreen && !isXsScreen ? 
                                item.description : 
                                item.mobileDescription
                        }
                            />
                        </Card>
                    </Grid>
                ))}
                {isXsScreen ? (
                    <Grid item xs={12} sm={4}>
                        <Card className={classes.card}>
                            <Typography variant="h2">{copy.section[3].emoji}</Typography>
                            <CardHeader 
                            title={copy.section[3].header}
                            subheader={!isSmScreen && !isXsScreen ? 
                                copy.section[3].description : 
                                copy.section[3].mobileDescription 
                            }
                            />
                        </Card>
                    </Grid>
                ) : (
                    <Grid item xs={12} sm={12}>
                        <Card className={`${classes.card} ${classes.fourthCard}`} style={{ display: 'flex' }}>
                            <div style={{ display: 'flex', alignItems: 'center', padding: '5%' }}>
                                <Typography variant="h1">{copy.section[3].emoji}</Typography>
                                <div>
                                <CardHeader 
                                    title={copy.section[3].header}
                                    subheader={!isSmScreen && !isXsScreen ? 
                                        copy.section[3].description : 
                                        copy.section[3].mobileDescription 
                                    }
                                    style={{ textAlign: 'left', paddingLeft: '10%' }}
                                />
                                </div>
                            </div>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export const Carousel = ({ isSmScreen, isXsScreen }) => {
  const theme = useTheme();
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = copy.section.length;

  // Function to increment the active step in a loop
  const autoPlay = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  useEffect(() => {
    // Set up an interval to auto-increment the active step
    const interval = setInterval(autoPlay, 15000); // Change slide every 15 seconds (adjust as needed)

    return () => {
      // Clear the interval on component unmount to prevent memory leaks
      clearInterval(interval);
    };
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box sx={{ width: '100%', flexGrow: 1 }}>
        <Link to='/' className={classes.link}>
            <Box
                sx={{
                height: '20rem',
                // backgroundImage: 'linear-gradient(to bottom right, #004b7f, #006f96, #0090c3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 5%'
                }}
            >
                <Typography 
                    variant={isSmScreen || isXsScreen ? 'h6' : 'h5'} 
                    sx={isXsScreen ? { padding: '1em 0', color: 'white' } : { padding: '1em 0 1em', color: 'white' }}
                >
                    {copy.section[activeStep].header}
                </Typography>
                <Typography 
                    sx={isXsScreen ? 
                        {
                           padding: '0 5em 1em', 
                            color: 'whitesmoke',
                            height: '20%' 
                        } : 
                        { 
                            padding: '0 5em', 
                            color: 'whitesmoke',
                            height: '20%' 
                        }
                    }
                    variant={isSmScreen || isXsScreen ? 'body2' : 'body1'}
                >
                    {isXsScreen ? 
                    copy.section[activeStep].mobileDescription :
                    copy.section[activeStep].description}
                </Typography>
                <Typography variant='h6' textAlign='center' sx={{ color: 'whitesmoke' }}>🚀 Start Your Discovery Now</Typography>
                <Typography textAlign='center' padding='0.5rem'>
                <Button variant="contained">Get Started</Button>
                </Typography>
                <Typography 
                    textAlign='center' 
                    variant='body2' 
                    sx={{ 
                        color: 'white',
                        paddingBottom: '2em',
                    }}
                >
                Join the revolution in music discovery and elevate your listening experience today!
                </Typography>
            </Box>
        </Link>
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
          >
            Next
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={handleBack}
          >
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Back
          </Button>
        }
      />
    </Box>
  );
};

export const Home = ({ currentUser, onSearchPressed, onDataLoaded }) => {
    const classes = useStyles();
    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const isSubscribed = false;

    return (
        <Box display='flex' flexDirection='column'>
            <Box className={classes.introBox}>
                <Typography className={classes.intro} variant={isXsScreen || isSmScreen ? "h6" : "h4"}>
                    🎵 Discover The Perfect Music For Any Occassion! 🎶
                </Typography>
                <Typography className={classes.subIntro} variant={isXsScreen || isSmScreen ? "body1" : "h6"}>
                    {isXsScreen || isSmScreen ?
                        "Welcome to the future of music discovery!" : 
                        "Welcome to the future of music discovery! At SongQuest, we're revolutionizing the way you explore and connect with the music you love."}
                </Typography>
                {/* <Carousel isSmScreen={isSmScreen} isXsScreen={isXsScreen}/> */}
                <SongDiscovery 
                    onSearchPressed={onSearchPressed}
                    onDataLoaded={onDataLoaded}
                />
            </Box>
        </Box>
    )
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser?.user,
});

export default connect(mapStateToProps)(Home);