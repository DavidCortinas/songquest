import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PaidIcon from '@mui/icons-material/Paid';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { deletePlaylist, removeFromCurrentPlaylistById, resetDataLoaded, setCurrentUser } from '../actions';
import { connect } from 'react-redux';
import '../App.css';
import theme from 'theme';
import { authSlice } from '../reducers';
import { withStyles } from '@mui/styles';

const StyledLinearProgress = withStyles({
  colorPrimary: {
    backgroundColor: "rgb(216,44,139, 0.5)"
  },
  barColorPrimary: {
    backgroundColor: theme.palette.primary.triadic2
  },
})(LinearProgress);

export const TopBar = ({ 
  onResetDataLoaded,
  onDeletePlaylist,
  onRemoveFromCurrentPlaylistById,
  onSetCurrentUser,
  onLogout,  
  user,
  currentUser,
  userPlaylists,
  currentPlaylist, 
}) => {
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const handleNavigate = () => {
    onResetDataLoaded();
    navigate('/', { replace: true });
  };

  const handleLogout = () => {
    setAnchorEl(null);
    onLogout();
    onSetCurrentUser(null);
    onDeletePlaylist(...userPlaylists.map(playlist => playlist.id));
    onRemoveFromCurrentPlaylistById(...currentPlaylist.map(song => song));
    onResetDataLoaded();
    navigate('/');
  };

  // try moving 'lvl 1' above achievement bar and reducing bar size by about 10%

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={(isXsScreen || isSmScreen) ? 1 : 2}
      id='topBar'
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
              width: (isXsScreen || isSmScreen) ? '10%' : '13%',
              paddingRight: (isXsScreen || isSmScreen) ? '2%' : '15px',
            }}
          />
          <Typography variant={(isXsScreen || isSmScreen) ? "h6" : "h5"} component="div" color='white' letterSpacing='2px'>
            SongQuest
          </Typography>
        </Link>
      </Box>
      <Box display='flex'>
        {!user ? (
              <Tooltip
                  arrow
                  title={
                    <div
                      style={{
                        maxHeight: '25vh',
                        overflowY: 'auto',
                        padding: '8px',
                        borderRadius: '8px',
                      }}
                    > 
                      <Typography variant='body2' letterSpacing='1px'>
                        {'Create account or login'}
                      </Typography>
                    </div>
                  }
              >
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
                    Login/Register
                  </Typography>
                )}
                <LoginIcon />
              </IconButton>             
            </Tooltip>
          ) : (
            <Box 
              display='flex' 
              alignItems='center' 
              width={'500px'} 
              justifyContent='flex-end'
            >
              <Tooltip
                title={
                  <div
                    style={{
                      maxHeight: '25vh',
                      overflowY: 'auto',
                      padding: '8px',
                      borderRadius: '8px',
                    }}
                  > 
                    <Typography variant='caption' letterSpacing='1px'>
                      {`Tokens: ${0}`}
                    </Typography>
                    <Typography variant='body2' letterSpacing='1px'>
                      {`Get More Tokens`}
                    </Typography>
                  </div>
                }
              >
                <Box display='flex'>
                  <PaidIcon
                    fontSize='medium' 
                    sx={{ color: '#c4a537' }} 
                  />
                  <PriorityHighIcon 
                    color='warning'
                    sx={{
                      height: '15px',
                      marginLeft: '-8px'
                    }}
                  />
                </Box>                
              </Tooltip>
              <Box sx={{ width: '100px', height: '8px' }}>
                <StyledLinearProgress 
                  variant='determinate' 
                  value={78} 
                  sx={{ borderRadius: '5px', height: '8px', marginRight: '10%' }}
                />
              </Box>
              <Typography letterSpacing='1px' color='whitesmoke' paddingRight='1%'>
                lvl 1
              </Typography>
              <Tooltip
                  arrow
                  title={
                    <div
                      style={{
                        maxHeight: '25vh',
                        overflowY: 'auto',
                        padding: '8px',
                        borderRadius: '8px',
                      }}
                    > 
                      <Typography variant='body2' letterSpacing='1px'>
                        {`Account menu`}
                      </Typography>
                    </div>
                  }
              >  
                <AccountCircleIcon
                  onClick={handleMenuClick}
                  fontSize='large'
                  sx={{
                    paddingRight: '1%',
                    color: theme.palette.primary.white
                  }}
                /> 
              </Tooltip>
              <Menu
                open={open}
                onClose={handleClose}
                anchorEl={anchorEl}
              >
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon
                    color="inherit"
                    component={Link}
                    style={{ textDecoration: 'none', color: 'black' }}
                    >
                    <LogoutIcon fontSize='small'/>
                  </ListItemIcon> 
                  {!isXsScreen && !isSmScreen && (
                    <Typography variant='body1' letterSpacing='1px'>
                      Logout
                    </Typography>
                  )}
                </MenuItem>
              </Menu>
            </Box>
          )
        }
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.account,
    currentUser: state.user.currentUser,
    currentPlaylist: state.playlist.currentPlaylist,
    userPlaylists: state.playlist.playlists,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onResetDataLoaded: () => dispatch(resetDataLoaded()),
    onSetCurrentUser: (user) => dispatch(setCurrentUser(user)),
    onDeletePlaylist: (...playlistIds) => dispatch(deletePlaylist(...playlistIds)),
    onRemoveFromCurrentPlaylistById: (...songs) => dispatch(removeFromCurrentPlaylistById(...songs)),
    onLogout: () => dispatch(authSlice.actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
