import { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import SpatialAudioIcon from '@mui/icons-material/SpatialAudio'
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import { BottomNavigation, BottomNavigationAction, Box, useMediaQuery } from '@mui/material';
import { resetDataLoaded } from '../actions';
import { makeStyles } from '@mui/styles';
import '../App.css';

const useStyles = () => makeStyles(() => (
    {
        bottomLinks: {
            color: 'white',
        },
    }
))

export const BottomBar = ({ resetDataLoaded, collapse, onCollapse }) => {
  const isLgScreen = useMediaQuery('(min-width: 1200px)');
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const classes = useStyles();

  useEffect(() => {
    function handleResize() {
      if (isLgScreen && !collapse) {
        onCollapse(true);
      } else if (!isLgScreen && collapse) {
        onCollapse(false);
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isLgScreen, collapse]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== '/') {
      navigate('/search');
    }
  }, [location.pathname, navigate]);

  const handleNavigation = (path) => {
    resetDataLoaded();
    navigate(path);
  };

  return (
    <div className='bottombar'>
        <BottomNavigation
            sx={{
                // background: '#012140',
            }}
        >
            <BottomNavigationAction 
                label='Home' 
                icon={<HomeIcon />} 
                onClick={() => handleNavigation('/')}
                className={classes.bottomLinks}
                sx={{
                    color: '#0b0b0b',
                }}
            />
            <BottomNavigationAction 
                label='Song Search' 
                icon={<SearchIcon />} 
                onClick={() => handleNavigation('/search')}
                className={classes.bottomLinks}
                sx={{
                    color: '#0b0b0b',
                }}
            />
            <BottomNavigationAction 
                label='Detect Song' 
                icon={<SpatialAudioIcon />} 
                className={classes.bottomLinks}
                sx={{
                    color: '#0b0b0b',
                }}
            />
            <BottomNavigationAction 
                label='Saved Searches' 
                icon={<SavedSearchIcon />} 
                className={classes.bottomLinks}
                sx={{
                    color: '#0b0b0b',
                }}
            />
        </BottomNavigation>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetDataLoaded: () => {
      dispatch(resetDataLoaded());
    },
  };
};

export default connect(null, mapDispatchToProps)(BottomBar);