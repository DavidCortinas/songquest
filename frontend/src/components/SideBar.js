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
import { useMediaQuery } from '@mui/material';
import { resetDataLoaded } from '../actions';
import { makeStyles } from '@mui/styles';
import theme from '../theme';
import '../App.css';

export const SideBar = ({ resetDataLoaded, collapse, onCollapse }) => {
  const [resizing, setResizing] = useState(false);
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const isLandscape = useMediaQuery('(orientation: landscape)');

export const SideBar = ({ resetDataLoaded, collapse, onCollapse }) => {
  const isLgScreen = useMediaQuery('(min-width: 1200px)')
  const viewHeight = window.outerHeight;

  useEffect(() => {
    function handleResize() {
      onCollapse(!isLgScreen);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isLgScreen]);

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
    <Sidebar
      style={{ 
        height: '100%', 
        position: 'fixed', 
        overflow: 'hidden',
      }}
      collapsed={collapse === false && isSmScreen ? 'true' : collapse}
      // backgroundColor="#012851d6"
      // backgroundImage={radioWall}
      collapsedWidth='64px'
      width='200px'
    >
      <Menu>
        <MenuItem
          onClick={onCollapse}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <MenuOpenIcon
            style={{
              transform: collapse ? 'scaleX(-1)' : 'scaleX(1)',
              transition: 'transform 0.3s ease',
              color: 'white',
            }}
          />
        </MenuItem>
        <MenuItem
          style={{ color: 'white' }}
          onClick={() => handleHomeNavigation('/')}
        >
          {collapse ? <HomeIcon style={{ color: 'white' }} /> : 'Home'}
        </MenuItem>
        <MenuItem disabled>
          {collapse ? <SavedSearchIcon /> : 'Saved Searches'}
        </MenuItem>
        {/* <MenuItem disabled>
          {collapse ? <WorkIcon /> : 'Licensing Projects'}
        </MenuItem> */}
      </Menu>
    </Sidebar>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetDataLoaded: () => {
      dispatch(resetDataLoaded());
    },
  };
};

export default connect(null, mapDispatchToProps)(SideBar);
