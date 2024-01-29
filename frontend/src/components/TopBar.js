import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import { resetDataLoaded, setCurrentUser } from '../actions';
import { connect, useDispatch } from 'react-redux';
import '../App.css';
import { useTheme } from '@mui/styles';
import { authSlice } from '../reducers';

export const TopBar = ({ resetDataLoaded, collapse, user }) => {
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const dispatch = useDispatch()

  const navigate = useNavigate();

  const handleNavigate = () => {
    resetDataLoaded();
    navigate('/', { replace: true });
  };

  const handleLogout = () => {
    dispatch(authSlice.actions.logout());
    dispatch(setCurrentUser(null))
    navigate('/')
  }

  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      p={2}
      // backgroundColor='#013a57'
      className='topbar-nosidebar'
      // className={isXsScreen || isSmScreen
      //   ? 'topbar-nosidebar'
      //   : collapse || isSmScreen
      //   ? 'topbar-collapsed'
      //   : 'topbar'}
    >
      <Box
        display="flex"
        borderRadius="3px"
      >
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={handleNavigate}
        >
          <img
            src={'static/images/sq-logo-2.png'}
            alt="Logo"
            style={{ 
              width: '13%',
              paddingRight: '15px'
           }}
          />
          <Typography variant="h5" component="div" color='white' letterSpacing='2px'>
            SongQuest
          </Typography>
        </Link>
      </Box>
      <Box display='flex'>
        {/* <IconButton
          color="inherit"
          component={Link}
          to="/discover"
          style={{ 
            textDecoration: 'none', 
            color: 'white',
            marginRight: '50px',  
          }}
        > */}
          {/* <YoutubeSearchedForIcon /> */}
          {/* <Typography variant='body1'>Discover New Music</Typography> */}
        {/* </IconButton> */}
        {/* <IconButton
          color="inherit"
          component={Link}
          to="/discover"
          style={{ textDecoration: 'none', color: 'white' }}
        >
          {/* <YoutubeSearchedForIcon /> */}
          {/* <Typography>Discover New Music</Typography> */}
        {/* </IconButton> */}
        {!user ?
          <IconButton
            color="inherit"
            component={Link}
            to="/login"
            style={{ 
              textDecoration: 'none', 
              color: 'white',
            }}
          >
            {!isXsScreen && !isSmScreen && (
              <Typography variant='h6' letterSpacing='1px'>
                Login/SignUp
              </Typography>
            )}
            <LoginIcon />
          </IconButton>
        : 
          <IconButton
            color="inherit"
            component={Link}
            onClick={handleLogout}
            style={{ textDecoration: 'none', color: 'white' }}
          >
            {!isXsScreen && !isSmScreen && <Typography>Logout</Typography>}
            <LogoutIcon />
          </IconButton>
        }
        {/* <IconButton
          color="inherit"
          component={Link}
          to='/song-detector'
          style={{ textDecoration: 'none' }}
        >
          <SpatialAudioIcon />
        </IconButton> */}
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.account,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetDataLoaded: () => {
      dispatch(resetDataLoaded());
    },
  };
};

// export default connect(null, mapDispatchToProps)(TopBar);
export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
