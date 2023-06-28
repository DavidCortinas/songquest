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
import { Box, useMediaQuery } from '@mui/material';
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
      <div className='sidebar-container'>
        <div className='image-overlay'>
          <Menu menuItemStyles={{
            button: {
              '&:hover': {
                // backgroundColor: '#18395c',
              },
            },
          }}>
            {!isSmScreen && 
              <MenuItem
                onClick={onCollapse}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <MenuOpenIcon
                  style={{
                    transform: collapse ? 'scaleX(-1)' : 'scaleX(1)',
                    transition: 'transform 0.3s ease',
                    // color: 'white',
                  }}
                />
              </MenuItem>
            }
            <MenuItem
              style={{ color: '#006f96' }}
              onClick={() => handleNavigation('/')}
            >
              <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <HomeIcon style={{ color: '#006f96', paddingRight: '5%' }} />
                {!collapse && 'Home'}
              </Box>
            </MenuItem>
            <MenuItem
              style={{ color: '#006f96' }}
              onClick={() => handleNavigation('/search')}
            >
              <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <SearchIcon style={{ color: '#006f96', paddingRight: '5%' }} />
                {!collapse && 'Search Song'}
              </Box>
            </MenuItem>
            <MenuItem disabled>
              <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <SpatialAudioIcon style={{ paddingRight: '5%'}}/>
                {!collapse && 'Detect Song'}
              </Box>
            </MenuItem>
            <MenuItem disabled>
              <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <SavedSearchIcon style={{ paddingRight: '5%'}}/>
                {!collapse && 'Saved Searches'}
              </Box>
            </MenuItem>
            {/* <MenuItem disabled>
              {collapse ? <WorkIcon /> : 'Licensing Projects'}
            </MenuItem> */}
          </Menu>
        </div>
      </div>
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
