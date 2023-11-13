import { Box, Button, Card, CardHeader, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';
import theme from '../theme';

const useStyles = makeStyles(() => (
  {
  card: {
    backgroundImage: 'linear-gradient(to bottom right, #004b7f, #006f96, #0090c3)',
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
    
    return (
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
                        <Link
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                '&:hover': {
                                    backgroundColor: 'transparent !important',
                                },
                            }}
                            to='/request-authorization/'
                        >
                            <img
                                width='300em'
                                style={{
                                    margin: '0 auto',
                                    display: 'block', 
                                }}
                                src={'/static/images/spotifyLogo.png'}
                            />
                        </Link>
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
    )
}