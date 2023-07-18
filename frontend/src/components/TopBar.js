import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  useMediaQuery,
  useScrollTrigger,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import SpatialAudioIcon from '@mui/icons-material/SpatialAudio'
import SearchIcon from '@mui/icons-material/Search';
import { resetDataLoaded, setCurrentUser } from '../actions';
import { connect, useDispatch, useSelector } from 'react-redux';
import '../App.css';
import { useTheme } from '@mui/styles';
import { authSlice } from '../reducers';

export const TopBar = ({ resetDataLoaded, collapse, user }) => {
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

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
      backgroundColor='white'
      className={isXsScreen
        ? 'topbar-nosidebar'
        : collapse || isSmScreen
        ? 'topbar-collapsed'
        : 'topbar'}
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
          <Typography variant="h6" component="div" color='#006f96'>
            SongQuest
          </Typography>
        </Link>
      </Box>
      <Box display='flex'>
        <IconButton
          color="inherit"
          component={Link}
          to="/search"
          style={{ textDecoration: 'none', color: 'black' }}
        >
          <SearchIcon />
        </IconButton>
        {!user ?
          <IconButton
            color="inherit"
            component={Link}
            to="/login"
            style={{ textDecoration: 'none', color: 'darkcyan' }}
          >
            {!isXsScreen && <Typography>Login/SignUp</Typography>}
            <LoginIcon />
          </IconButton>
        : 
          <IconButton
            color="inherit"
            component={Link}
            onClick={handleLogout}
            style={{ textDecoration: 'none', color: 'darkcyan' }}
          >
            {!isXsScreen && <Typography>Logout</Typography>}
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
