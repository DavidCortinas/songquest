import { 
    Box, 
    Button, 
    Card, 
    Paper, 
    MobileStepper, 
    Tooltip, 
    Typography, 
    useMediaQuery } from "@mui/material"
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

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => (
    {
        introBox: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: '1rem',
        },
        intro: {
            color: '#3d3d3d',
            // paddingTop: '1rem',
            // justifyContent: 'center',
            textAlign: 'center',
            width: '70%',
            [theme.breakpoints.down('sm')]: {
                width: '85%',
            },
            marginTop: '20px',
        },
          link: {
            textDecoration: 'none', // Remove underline
            color: 'inherit', // Inherit text color from the parent
            '&:hover': {
            textDecoration: 'none', // Remove underline on hover
            },
        },
        subIntro: {
            color: '#3d3d3d',
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
            header: "🔮 Unlock a World of Music",
            description: "Discover a universe of melodies, beats, and harmonies, all thoughtfully curated for you. We leverage Spotify's powerful recommendation algorithm to handpick selections based on your unique tastes, ensuring you find the perfect tunes for your search.",
            mobileDescription: "We leverage Spotify's powerful recommendation algorithm to handpick selections based on your unique tastes, ensuring you find the perfect tunes for your search.",
        },
        {
            header: "🎸 Fine-Tune Your Sound Journey",
            description: "Take control of your musical adventure like never before. With SongQuest, you have the power to fine-tune your recommendations. Want tracks with a touch of acoustic warmth? Or perhaps something that'll get you grooving on the dance floor? You're in charge!",
            mobileDescription: 'Take control of your musical adventure like never before. With SongQuest, you have the power to fine-tune your recommendations.',
        },
        {
            header: "📊 Set Your Musical Parameters",
            description: "Explore the musical spectrum with parameters like acousticness, danceability, duration, energy, instrumentalness, key, liveliness, loudness, mode, popularity, speechiness, tempo, time signature, and valence. Customize your music discovery experience down to the finest detail.",
            mobileDescription: 'Customize your music discovery experience down to the finest detail.',
        },
        {
            header: "🎉 Your Journey Starts Here",
            description: "Ready to embark on a musical journey like no other? Click below to start discovering your new favorite songs. Let the rhythm of SongQuest guide you to sonic bliss.",
            mobileDescription: 'Click below to start discovering your new favorite songs.',
        },
    ]
};

const Carousel = ({ isSmScreen, isXsScreen }) => {
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
        <Link to='/discover' className={classes.link}>
            <Box
                sx={{
                height: '20rem',
                backgroundImage: 'linear-gradient(to bottom right, #004b7f, #006f96, #0090c3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                }}
            >
                <Typography 
                    variant={isSmScreen || isXsScreen ? 'h6' : 'h5'} 
                    sx={isXsScreen ? { padding: '1em 0', color: 'white' } : { padding: '1em 0 2em', color: 'white' }}
                >
                    {copy.section[activeStep].header}
                </Typography>
                <Typography 
                    sx={isXsScreen ? 
                        {
                           padding: '0 5em 1em', 
                            color: 'whitesmoke',
                            height: '50em' 
                        } : 
                        { 
                        padding: '0 5em', 
                        color: 'whitesmoke',
                        height: '50em' 
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

export const Home = ({ currentUser }) => {
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
                    Welcome to the future of music discovery! At SongQuest, we're revolutionizing the way you explore and connect with the music you love.
                </Typography>
                <Carousel isSmScreen={isSmScreen} isXsScreen={isXsScreen}/>
            </Box>
        </Box>
    )
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser?.user,
});

export default connect(mapStateToProps)(Home);