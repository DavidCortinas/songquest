import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  searchSongSuccess, 
  searchSong, 
  searchSongFailure, 
  confirmUser, 
  discoverSong, 
  discoverSongSuccess, 
  receiveSongResults, 
  receivePerformerResults, 
  receiveSpotifySeedGenres, 
  receiveSpotifyMarkets, 
  // refreshSpotifyAccess, 
  updateUsername, 
  receiveLyricResults,
  createPlaylist,
  addToSavedPlaylist,
  getUserPlaylistsRequest,
  getUserPlaylistsSuccess,
  getUserPlaylistsFailure,
  savePreviousQuery,
  saveQuery,
  getRequestParametersRequest,
  getRequestParametersSuccess,
  getRequestParametersFailure,
  resendVerificationSuccess,
  resendVerificationFailure,
  resendVerificationRequest
} from './actions';
import getCSRFToken from './csrf';
import { authSlice, song } from './reducers';
import { transformResponseToQueryStructure } from 'utils';

// import { setAccount, setAuthTokens } from './actions/auth';

export const searchSongRequest = (query) => async (dispatch) => {
  try {
    const csrfToken = await getCSRFToken(); // Retrieve the CSRF token
    const body = JSON.stringify({
      song: query.song,
      performer: query.performer,
    });
    const response = await fetch('/search/', {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, // Include the CSRF token in the request headers
      },
      method: 'post',
      // credentials: 'include',
      body,
    });

    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }

    const songData = await response.json();

    // Update the front end with the received data
    // Dispatch both searchSong and searchSongSuccess actions
    dispatch(searchSong(songData, query, false));
    // Dispatch searchSong action
    dispatch(searchSongSuccess(songData, query)); // Dispatch searchSongSuccess action with the query
    return songData;
  } catch (error) {
    console.log('Error: ' + error.message);
    dispatch(searchSongFailure(error.message));
    // alert('We had trouble finding that song. Please make sure you are spelling the song correctly and enter the performer for the quickest and most accurate search result')
    dispatch(
      searchSongSuccess(
        { ascap_results: {}, bmi_results: {} },
        { song: '', performer: '' }
      )
    );
  }
};

export const checkRegistration = (user) => async (dispatch) => {
  console.log('checkRegistration: ', user.email)
  try {
    const csrfToken = await getCSRFToken();
    const response = await fetch('http://localhost:8000/user/', {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, // Include the CSRF token in the request headers
        'User-Email': user.email,
      },
      method: 'post',
    });

    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }

    const currentUser = await response.json();

    dispatch(confirmUser(currentUser));

    return currentUser;
  } catch (error) {
    console.log('Error: ' + error.message);
  }
}

export const registerUser = (email, password, username) => async (dispatch) => {
  try {
    const csrfToken = await getCSRFToken();
    const body = JSON.stringify({
      email: email,
      password: password,
      username: username,
    });
    const response = await fetch(`http://localhost:8000/api/auth/register/`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      method: 'post',
      body,
    });

    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }

    const res = await response.json();
    
    return res
  } catch (error) {
    console.log('Error: ' + error.message)
  }
}

export const login = (
  email,
  password, 
  username, 
) => async (dispatch) => {
  try {
    const csrfToken = await getCSRFToken();
    const body = JSON.stringify({
      email: email,
      password: password,
      username: username,
    });
    const response = await fetch(`http://localhost:8000/api/auth/login/`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, // Include the CSRF token in the request headers
      },
      method: 'post',
      // credentials: 'include',
      body,
    });

    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }

    const res = await response.json();

    dispatch(
      authSlice.actions.setAuthTokens({
        token: res.access,
        refreshToken: res.refresh,
      })
    );

    dispatch(authSlice.actions.setAccount(res.user));
    

    return res
  } catch (error) {
    console.log('Error: ' + error.message);
  }
};

export const handleUpload = (filelist) => async (filelist) => {
  const UPLOAD_URL = "/api/upload";
  const data =new FormData();
  for (let file of filelist) {
    data.append(file.name, file);
  }
  fetch(UPLOAD_URL, data)
}

export const discoverSongRequest = (parameters) => async (dispatch, getState) => {
  try {
    const csrfToken = await getCSRFToken(); // Retrieve the CSRF token
    const body = JSON.stringify(parameters);

    const response = await fetch('http://localhost:8000/api/discover/', {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      method: 'post',
      // credentials: 'include',
      body: body,
    });

    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }

    const discovery = await response.json();

    dispatch(discoverSong(discovery, false, parameters));

    const prevQuery = getState().discovery.query;
    dispatch(savePreviousQuery(prevQuery));
    
    dispatch(discoverSongSuccess(discovery, true));
    return discovery;
  } catch (error) {
    console.log('Error: ' + error.message);
  };
};

export const SpotifyAuth = ({ children }) => {
  const [accessToken, setAccessToken] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  // if (expiresAt <= Date.now()) {
  //   setExpired(true);
  // };

  useEffect(() => {
    async function fetchAccessToken() {
      try {
        const response = await fetch('http://localhost:8000/api/get-access-token/');
        const data = await response.json();
        const { access_token, expires_at } = data;
        setAccessToken(access_token);
        setExpiresAt(expires_at);
      } catch (error) {
        console.error('Error fetching access token: ', error);
      }
    }

    fetchAccessToken();
  }, []);

  return <>{children(accessToken, expiresAt)}</>
};

export const getSpotifyUserAuth = () => async (dispatch) => {
  try {
    const csrfToken = await getCSRFToken();
    // Your asynchronous logic here, e.g., making a network request
    const response = await fetch('http://localhost:8000/request-authorization/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      // credentials: 'include',
    });

      if (response.ok) {
          const data = await response.json();
          const authorizationUrl = data.authorization_url;

          // Redirect the user to the Spotify authorization URL
          window.location.href = authorizationUrl;
      } else {
          console.error('Authorization request failed');
      }
  } catch (error) {
      console.error('Error:', error);
  }
};


export const getSpotifySearchResult = (
  value, 
  parameter, 
  accessToken, 
  expiresAt
) => async (dispatch) => {
  const type = (parameter === 'songs' || parameter === 'lyrics') ? 'track' : 'artist';
  const lyricsQuery = parameter === 'lyrics' ? `track:${value.track_name} artist:${value.artist_name}` : null;

  const token = await checkTokenExpiration(accessToken, expiresAt);

  try {
    const API_URL = `https://api.spotify.com/v1/search?q=${
      parameter === 'lyrics' ? 
      encodeURIComponent(lyricsQuery) : 
      encodeURIComponent(value)
    }&type=${type}&include_external=audio`;

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = response.data;

    if (parameter === 'songs') {
      dispatch(receiveSongResults(result.tracks));
    }
    if (parameter === 'performers') {
      dispatch(receivePerformerResults(result.artists));
    }
    if (parameter === 'lyrics') {
      dispatch(receiveLyricResults(result.tracks));
    }
  } catch (error) {
    console.log('Error: ', error);
  }
};

export const getSpotifyGenres = (
  accessToken, 
  expiresAt
) => async (dispatch) => {
  try {
    const API_URL = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const result = response.data;
    dispatch(receiveSpotifySeedGenres(result.genres));
  } catch (error) {
    console.log('Error: ', error);
  }
};

export const getSpotifyMarkets = (
  accessToken,
  expiresAt,
) => async (dispatch) => {
  try {
    const API_URL = 'https://api.spotify.com/v1/markets';
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const result = response.data;
    dispatch(receiveSpotifyMarkets(result.markets));
  } catch (error) {
    console.log('Error: ', error);
  }
};


export const getSpotifyTracks = (userId, trackIds) => async (dispatch) => {

  try {
    const csrfToken = await getCSRFToken();
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
      'User-Id': userId,
    };

    const data = {
      spotifyIds: trackIds,
    };

    const response = await axios.post('http://localhost:8000/get-spotify-tracks/', data, { headers });

    if (response.status === 200) {
      return response.data['tracks'];
    } else {
      throw new Error('Request failed with status ' + response.status);
    }
  } catch (error) {
    console.error('Error fetching Spotify tracks:', error.message);
  }
};

export const getSpotifyArtists = (userId, artistIds) => async (dispatch) => {

  try {
    const csrfToken = await getCSRFToken();
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
      'User-Id': userId,
    };

    const data = {
      artistIds: artistIds,
    };

    const response = await axios.post('http://localhost:8000/get-spotify-artists/', data, { headers });

    if (response.status === 200) {
      return response.data['artists'];
    } else {
      throw new Error('Request failed with status ' + response.status);
    }
  } catch (error) {
    console.error('Error fetching Spotify tracks:', error.message);
  }
};

export const checkTokenExpiration = async (
  accessToken,
  refreshToken,
  expiresAt
) => {
  // Check if the token has expired
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime >= expiresAt) {
    try {
      const response = await fetch('http://localhost:8000/refresh-token/', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
        headers: {
          'Content-Type': 'application/json',
          // Add any other necessary headers here
        },
        credentials: 'include',
      });

      if (response.status === 200) {
        const tokenInfo = await response.json();
        const newAccessToken = tokenInfo.access_token;

        return newAccessToken;
      } else {
        console.error('Error refreshing access token');
        // Handle the error or throw an exception if needed
        throw new Error('Error refreshing access token');
      }
    } catch (error) {
      console.error('Error during token refresh:', error);
      // Handle the error or throw an exception if needed
      throw error;
    }
  }

  return accessToken;
};


export const handleUpdateUsername = (userId, newUsername) => async (dispatch) => {
  try {
    const csrfToken = await getCSRFToken();
    const data = { newUsername }; // Include the user ID and new username in an object
    const body = JSON.stringify(data);

    const response = await fetch(`http://localhost:8000/update-username/`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, // Include the CSRF token in the request headers
        'User-Id': userId,
      },
      method: 'PATCH', // Use the HTTP PATCH method
      body,
    });

    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }

    const res = await response.json();

    // You can dispatch an action if needed
    dispatch(updateUsername(newUsername));

    return res;
  } catch (error) {
    console.log('Error: ' + error.message);
  };

};

export const resendVerification = (userId) => async (dispatch) => {
  console.log('resend verification');
  dispatch(resendVerificationRequest());
  try {
    const csrfToken = await getCSRFToken();
    const response = await fetch('http://localhost:8000/resend-verification-email/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'User-Id': userId,
      },
    });

    // Check if the request was successful (status code 200)
    if (response.ok) {
      // Dispatch an action if the request was successful
      dispatch(resendVerificationSuccess());
    } else {
      // Handle errors if the request was not successful
      throw new Error('Failed to resend verification email');
    }
  } catch (error) {
    // Dispatch an action to handle errors
    dispatch(resendVerificationFailure(error.message));
  }
};

export const createPlaylistRequest = (
  userId, 
  playlist, 
) => async (dispatch) => {
  try {
    const csrfToken = await getCSRFToken();
    const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'User-Id': userId, 
    }

    const body = JSON.stringify(playlist);

    const response = await fetch(`http://localhost:8000/create-playlist/`, {
      headers: headers,
      method: 'POST', 
      body,
    });

    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }

    const res = await response.json(); 
    dispatch(createPlaylist(res));
    return res
  } catch (error) {
    console.log('Error: ' + error.message);
  };
};

export const addToSavedPlaylistRequest = (
  playlistId,
  userId,
  tracks,
) => async (dispatch) => {
  try {
    const csrfToken = await getCSRFToken();
    const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, 
    }

    const body = JSON.stringify({ 
      id: playlistId,  
      user: userId, 
      tracks: tracks 
    });

    const response = await fetch(`http://localhost:8000/add-to-playlist/${playlistId}/`, {
      headers: headers,
      method: 'POST', 
      body,
    });

    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }

    const res = await response.json();
    const playlist = res['playlist'] 

    dispatch(addToSavedPlaylist(playlist.id, playlist.songs));
    return playlist.songs
  } catch (error) {
    console.log('Error: ' + error.message);
  };
};

export const getUserPlaylists = (userId) => async (dispatch) => {
  dispatch(getUserPlaylistsRequest());

  try {
    const csrfToken = await getCSRFToken(); // Ensure you have a function like getCSRFToken
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
      'User-Id': userId,
    };

    const response = await axios.get(`http://localhost:8000/get-user-playlists/`, {
      headers,
    });

    const userPlaylists = response.data['playlists']

    dispatch(getUserPlaylistsSuccess(userPlaylists));
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    dispatch(getUserPlaylistsFailure(error.message));
  }
};

export const saveRequestParameters = (userId, query) => async (dispatch) => {
  try {
    const csrfToken = await getCSRFToken();

    const response = await axios.post('http://localhost:8000/save-request-parameters/', query, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'User-Id': userId,
      },
    });

    const res = response.data;

    const transformedQuery = transformResponseToQueryStructure(res['recommendation_request']);

    dispatch(saveQuery(transformedQuery));
  } catch (error) {
    console.log('Error: ' + error.message);
  }
};

export const getRequestParameters = (userId) => async (dispatch) => {
  dispatch(getRequestParametersRequest());

  try {
    const csrfToken = await getCSRFToken(); // Ensure you have a function like getCSRFToken
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
      'User-Id': userId,
    };

    const response = await axios.get(`http://localhost:8000/get-user-requests/`, {
      headers,
    });

    const userRequestParameters = response.data['requests'];
    const transformedUserRequestParameters = userRequestParameters.map((request) => {
      return transformResponseToQueryStructure(request);
    });
    dispatch(getRequestParametersSuccess(transformedUserRequestParameters));
  } catch (error) {
    console.error('Error fetching user request parameters:', error);
    dispatch(getRequestParametersFailure(error.message));
  }
};

export const getPricing = () => async (dispatch) => {
  try {
    const csrfToken = await getCSRFToken();
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    };

    const response = await axios.get(`http://localhost:8000/get-pricing/`, {
      headers,
    });

    return response.data['pricing_packages']
  } catch (error) {
    console.error('Error getting pricing packages: ', error);
  };
};

export const pushPrice = (price) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:8000/set-price/', { price });
    console.log(response.data)
    // return response.data; // Return the server's response if needed
  } catch (error) {
    console.log('Error pushing price to server: ', error);
    throw error; // Propagate the error to handle it elsewhere if needed
  }
};



