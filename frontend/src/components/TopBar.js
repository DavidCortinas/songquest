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
import SpatialAudioIcon from '@mui/icons-material/SpatialAudio'
import SearchIcon from '@mui/icons-material/Search';
import { resetDataLoaded } from '../actions';
import { connect } from 'react-redux';
import '../App.css';
import { useTheme } from '@mui/styles';

export const TopBar = ({ resetDataLoaded, collapse }) => {
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

  const navigate = useNavigate();

  const handleNavigate = () => {
    resetDataLoaded();
    navigate('/', { replace: true });
  };

  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      p={2}
      backgroundColor='white'
      className={isXsScreen
        ? 'topbar-nosidebar'
        : collapse 
        ? 'topbar-collapsed'
        : 'topbar'}
    >
      <Box
        display="flex"
        // backgroundColor={colors.primary[400]}
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
          {/* <Typography variant="h6" component="div" color='#007fbf'> */}
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
        <IconButton
          color="inherit"
          component={Link}
          to="/"
          style={{ textDecoration: 'none' }}
          disabled
        >
          <SpatialAudioIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetDataLoaded: () => {
      dispatch(resetDataLoaded());
    },
  };
};

export default connect(null, mapDispatchToProps)(TopBar);
