import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import SpatialAudioIcon from '@mui/icons-material/SpatialAudio'
import SearchIcon from '@mui/icons-material/Search';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import { BottomNavigation, BottomNavigationAction, Tooltip, useMediaQuery } from '@mui/material';
import { resetDataLoaded } from '../actions';
import '../App.css';

export const BottomBar = ({ currentUser, resetDataLoaded, collapse, onCollapse }) => {
  const isLgScreen = useMediaQuery('(min-width: 1200px)');

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

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    resetDataLoaded();
    navigate(path);
  };

  const isSubscribed = false;

  return (
    <div className='bottombar'>
        <BottomNavigation
            sx={{
                // background: '#012140',
            }}
        >
            <BottomNavigationAction 
                label='Home' 
                icon={
                <img
                  src="/static/images/sq-logo-2.png"
                  alt="Logo"
                  style={{ width: '25%' }}
                />
                } 
                onClick={() => handleNavigation('/')}
                sx={{
                    color: '#006f96',
                }}
            />
            <BottomNavigationAction 
                label='Disocover Music' 
                icon={<YoutubeSearchedForIcon />} 
                onClick={() => handleNavigation('/discover')}
                sx={{
                    color: '#006f96',
                }}
            />
            {/* <BottomNavigationAction 
                label='Song Search' 
                icon={<SearchIcon />} 
                onClick={() => handleNavigation('/search')}
                sx={{
                    color: '#006f96',
                }}
            /> */}
            {/* {currentUser ? <BottomNavigationAction 
                label='Detect Song' 
                icon={<SpatialAudioIcon />} 
                onClick={() => handleNavigation('/song-detector')}
                sx={{
                    color: '#006f96',
                }}
            /> :
            <Tooltip title='Login to access song detection' arrow enterTouchDelay={0}>
              <span>
                <BottomNavigationAction 
                    label='Detect Song' 
                    icon={<SpatialAudioIcon />} 
                    sx={{
                        color: '#006f96',
                        opacity: '0.5',
                    }}
                    disabled
                  />  
              </span>  
            </Tooltip>}
            {isSubscribed ? <BottomNavigationAction 
                label='Saved Searches' 
                icon={<SavedSearchIcon />} 
                sx={{
                    color: '#006f96',
                }}
            /> :
            <Tooltip title='Upgrade to access saved searches' arrow enterTouchDelay={0}>
              <span>
                <BottomNavigationAction 
                  label='Saved Searches' 
                  icon={<SavedSearchIcon />} 
                  sx={{
                      color: '#006f96',
                      opacity: '0.5',
                  }}
                  disabled
                />  
              </span>  
            </Tooltip>} */}
        </BottomNavigation>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);