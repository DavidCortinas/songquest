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
import { Box, Tooltip, useMediaQuery } from '@mui/material';
import { resetDataLoaded } from '../actions';
import { makeStyles } from '@mui/styles';
import theme from '../theme';
import '../App.css';

export const SideBar = ({ currentUser, resetDataLoaded, collapse, onCollapse }) => {
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    resetDataLoaded();
    navigate(path);
  };

  const isSubscribed = false;

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
            {currentUser ? 
            <MenuItem
              style={{ color: '#006f96' }}
              onClick={() => handleNavigation('/song-detector')}
            >
              <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <SpatialAudioIcon style={{ paddingRight: '5%'}}/>
                {!collapse && 'Detect Song'}
              </Box>
            </MenuItem> :
            <Tooltip title='Login to access song detection' arrow enterTouchDelay={0}>
              <span>
                <MenuItem disabled>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    <SpatialAudioIcon style={{ paddingRight: '5%'}}/>
                    {!collapse && 'Detect Song'}
                  </Box>
                </MenuItem>                 
              </span>  
            </Tooltip>}
            {isSubscribed ? 
            <MenuItem
              style={{ color: '#006f96' }}
              onClick={() => handleNavigation('/song-detector')}
            >
              <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <SavedSearchIcon style={{ paddingRight: '5%'}}/>
                {!collapse && 'Saved Searches'}
              </Box>
            </MenuItem> :
            <Tooltip title='Upgrade to access saved searches' arrow enterTouchDelay={0}>
              <span>
                <MenuItem disabled>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    <SavedSearchIcon style={{ paddingRight: '5%'}}/>
                    {!collapse && 'Saved Searches'}
                  </Box>
                </MenuItem>                 
              </span>  
            </Tooltip>}
            {/* <MenuItem disabled>
              {collapse ? <WorkIcon /> : 'Licensing Projects'}
            </MenuItem> */}
          </Menu>
        </div>
      </div>
    </Sidebar>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser?.user,
});

const mapDispatchToProps = (dispatch) => {
  return {
    resetDataLoaded: () => {
      dispatch(resetDataLoaded());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
