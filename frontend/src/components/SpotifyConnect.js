import { Box, Button, Card, CardHeader, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';
import theme from '../theme';
import { Body } from './Home';

const useStyles = makeStyles(() => (
  {
  card: {
    backgroundColor: "transparent",
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    color: "#007fbf",
    backgroundColor: "transparent",
  },
  box: {
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    color: "#007fbf",
    backgroundColor: "transparent",
    marginBottom: '5%',
  },
  textField: {
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
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
  description: {
    maxWidth: theme.breakpoints.up('xl') ? '65rem' : '50rem',
    color: '#6f6f71',
    paddingTop: '1rem',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
  },
  button: {
    color: 'white'
  },
  noBottomLine: {
    borderBottom: 'none',
  }
}));

export const SpotifyConnect = ({
    isSmScreen,
    isXsScreen,
    isXlScreen,
    isLgScreen,
    setConnectToSpotify,
}) => {
    const classes = useStyles();

        const handleConnectThroughSpotify = async (e) => {
        e.preventDefault();

        const authorizationUrl = `/request-authorization/`;

        // Redirect the user to Spotify for authorization
        window.location.href = authorizationUrl;
    };
    
    return (
        <>
          <Box display='flex' justifyContent='center' paddingTop='1rem'>
            <Box width='100%'>
                <Card className={classes.card}>
                    <Box className={classes.box}>
                        <CardHeader
                            title='Connect to Spotify'
                            titleTypographyProps={{
                                width: '100%',
                                variant: isSmScreen || isXsScreen
                                ? 'h6'
                                : 'h5',
                                textAlign: 'center',
                                color: 'white',
                                paddingTop: '1rem'
                            }}
                            subheader='Link to your Spotify library to add tracks, create playlists and more!'
                            subheaderTypographyProps={{ 
                                width: '100%', 
                                variant: isXlScreen || isLgScreen 
                                ? 'body1'
                                : 'body2',
                                textAlign: 'center',
                                alignItems: 'center',
                                color: 'whitesmoke',
                            }}
                        />
                        <Button
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                '&:hover': {
                                backgroundColor: 'transparent !important', // Add !important to override other styles
                                },
                            }}
                            onClick={handleConnectThroughSpotify} // Call the handleConnectThroughSpotify function
                            >
                            <img
                                width='150em'
                                style={{
                                margin: '0 auto',
                                display: 'block', 
                                }}
                                src={'/static/images/spotifyLogo.png'}
                            />
                            </Button>
                        <br />
                        <Grid className={classes.buttonsContainer}>
                            <Button
                                type="submit"
                                className={classes.button}
                                onClick={() => setConnectToSpotify(false)}
                            >
                                Back to recommendations
                                <NavigateNextIcon />
                            </Button>
                        </Grid>
                        <br />
                    </Box>
                </Card>
            </Box>
          </Box>
        <Body isSmScreen={isSmScreen} isXsScreen={isXsScreen} />
        </>
      )
  }