import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { deletePlaylist, removeFromCurrentPlaylistById, resetDataLoaded, setCurrentUser } from '../actions';
import { connect } from 'react-redux';
import '../App.css';
import { useTheme } from '@mui/styles';
import { authSlice } from '../reducers';

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
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const navigate = useNavigate();

  const handleNavigate = () => {
    onResetDataLoaded();
    navigate('/', { replace: true });
  };

  const handleLogout = () => {
    onLogout();
    onSetCurrentUser(null);
    onDeletePlaylist(...userPlaylists.map(playlist => playlist.id));
    onRemoveFromCurrentPlaylistById(...currentPlaylist.map(song => song));
    navigate('/');
  }

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
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
                  {user ? `Sign out as ${currentUser.user?.username}` : 'Create account or login'}
                </Typography>
              </div>
            }
        >  
          {!user ? (
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
            ) : (
              <IconButton
                color="inherit"
                component={Link}
                onClick={handleLogout}
                style={{ textDecoration: 'none', color: 'white' }}
              >
                {!isXsScreen && !isSmScreen && (
                  <Typography variant='h6' letterSpacing='1px'>
                    Logout
                  </Typography>
                )}
                <LogoutIcon />
              </IconButton>
            )
          }
        </Tooltip>
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
