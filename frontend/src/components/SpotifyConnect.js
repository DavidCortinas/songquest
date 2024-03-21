import { Box, Button, Card, CardHeader, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';
import theme from '../theme';
import { Body } from './Body';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import getCSRFToken from '../csrf';

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
    width: '100%',
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

const SpotifyConnect = ({
    isSmScreen,
    isXsScreen,
    isMdScreen,
    isXlScreen,
    isLgScreen,
    userId,
  }) => {
    const navigate = useNavigate();
    const classes = useStyles();

    const handleConnectThroughSpotify = async (e) => {
      e.preventDefault();

      const authorizationUrl = `http://localhost:8000/request-authorization/`;

      // Redirect the user to Spotify for authorization
      window.location.href = authorizationUrl;
    };
    
    return (
        <Box display='flex' justifyContent='center' paddingTop='1rem'>
          <Box width='100%'>
                  <Box className={classes.box}>
                      <CardHeader
                          title='Connect to Spotify'
                          titleTypographyProps={{
                              width: '100%',
                              letterSpacing: '1px',
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
                              letterSpacing: '1px', 
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
                              backgroundColor: 'transparent !important',
                              },
                          }}
                          onClick={handleConnectThroughSpotify}
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
                              onClick={() => navigate('/pricing')}
                          >
                              Skip
                              <NavigateNextIcon />
                          </Button>
                      </Grid>
                      <br />
                  </Box>
          </Box>
      </Box>
      )
  };

  const mapStateToProps = (state) => {
  return {
    userId: state.user.currentUser?.user.id,
  };
};

export default connect(mapStateToProps)(SpotifyConnect);