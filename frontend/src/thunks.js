import { useEffect, useState } from 'react';
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
  refreshSpotifyAccess, 
  updateUsername, 
  receiveLyricResults
} from './actions';
import getCSRFToken from './csrf';
import { authSlice, song } from './reducers';
// import { setAccount, setAuthTokens } from './actions/auth';

export const searchSongRequest = (query) => async (dispatch) => {
  try {
    const csrfToken = await getCSRFToken(); // Retrieve the CSRF token
    const body = JSON.stringify({
      song: query.song,
      performer: query.performer,
    });
    const response = await fetch('http://localhost:8000/search/', {
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
  try {
    const csrfToken = await getCSRFToken();
    const body = JSON.stringify({
      email: user.email,
    });
    const response = await fetch('http://localhost:8000/user/', {
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

    const currentUser = await response.json();

    // Update the front end with the received data
    // Dispatch both searchSong and searchSongSuccess actions
    dispatch(confirmUser(currentUser));
    // Dispatch searchSong action
    // dispatch(searchSongSuccess(songData, query)); // Dispatch searchSongSuccess action with the query
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
  spotify_access_token, 
  spotify_refresh_token, 
  spotify_expires_at
) => async (dispatch) => {
  try {
    const csrfToken = await getCSRFToken();
    const body = JSON.stringify({
      email: email,
      password: password,
      spotify_access_token: spotify_access_token,
      spotify_refresh_token: spotify_refresh_token,
      spotify_expires_at: spotify_expires_at,
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
}

export const handleUpload = (filelist) => async (filelist) => {
  const UPLOAD_URL = "http://localhost:8000/api/upload";
  const data =new FormData();
  for (let file of filelist) {
    data.append(file.name, file);
  }
  fetch(UPLOAD_URL, data)
}

export const discoverSongRequest = (parameters) => async (dispatch) => {
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

    dispatch(discoverSong(discovery, false, parameters))
    dispatch(discoverSongSuccess(discovery, true))

    // Update the front end with the received data
    // Dispatch both searchSong and searchSongSuccess actions
    // dispatch(searchSong(songData, query, false));
    // Dispatch searchSong action
    // dispatch(searchSongSuccess(songData, query)); // Dispatch searchSongSuccess action with the query
    return discovery;
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
}

export const SpotifyAuth = ({ children }) => {
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    async function fetchAccessToken() {
      try {
        const response = await fetch('http://localhost:8000/api/get-access-token/');
        const data = await response.json();
        const { access_token } = data;
        setAccessToken(access_token);
      } catch (error) {
        console.error('Error fetching access token: ', error);
      }
    }

    fetchAccessToken();
  }, []);

  return <>{children(accessToken)}</>
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


export const getSpotifySearchResult = (value, parameter, accessToken) => async (dispatch) => {

  const type = (parameter === 'songs' || parameter === 'lyrics') 
    ? 'track' 
    : 'artist'

  const lyricsQuery = parameter === 'lyrics' ? `track:${value.track_name} artist:${value.artist_name}` : null

  try {
    const API_URL =  `https://api.spotify.com/v1/search?q=${
      parameter === 'lyrics' ? 
      encodeURIComponent(lyricsQuery) : 
      encodeURIComponent(value)
    }&type=${type}&include_external=audio`;

    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }
    const result = await response.json();
    if (parameter === 'songs') {
      dispatch(receiveSongResults(result.tracks))
    }
    if (parameter === 'performers') {
      dispatch(receivePerformerResults(result.artists))
    };
    if (parameter === 'lyrics') {
      dispatch(receiveLyricResults(result.tracks))
    }
  } catch (error) {
    console.log('Error: ', error);
  };
};

export const getSpotifyGenres = (accessToken) => async (dispatch) => {
  try {
    const API_URL = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
    }
  });
  const result = await response.json();
  dispatch(receiveSpotifySeedGenres(result.genres))
  } catch (error) {
    console.log('Error: ', error);
  };
}

export const getSpotifyMarkets = (accessToken) => async (dispatch) => {
  try {
    const API_URL = 'https://api.spotify.com/v1/markets';
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    const result = await response.json();
    dispatch(receiveSpotifyMarkets(result.markets))
  } catch (error) {
    console.log('Error: ', error);
  };
}

export const addToSpotify = (
  recommendation, 
  spotify_access, 
  spotify_refresh, 
  spotify_expires_at
) => async (dispatch) => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  if (!spotify_access) {
    const newTokenInfo = ''
  };

  try {
    const csrfToken = getCookie('csrftoken');
    const headers = {
      // 'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    };

    const new_spotify_access = await checkTokenExpiration(headers, spotify_access, spotify_refresh, spotify_expires_at)

    const response = await fetch('http://localhost:8000/add-to-spotify/', {
      method: 'POST',
      body: JSON.stringify({ 
        'recommendation': recommendation,
        'spotify_access': new_spotify_access ? new_spotify_access : spotify_access,
        'spotify_refresh': spotify_refresh,
        'spotify_expires_at': spotify_expires_at,
      }),
      headers: headers,
      credentials: 'include',
    });

    if (response.status === 200) {
      // Authorization request was successful, you can handle the response here
      console.log('Authorization request successful');
    } else {
      // Handle other response statuses here (e.g., error handling)
      console.error('Authorization request failed');
    }
  } catch (error) {
    // Handle any network errors or exceptions here
    console.error('Error:', error);
  }
}

export const checkTokenExpiration = async(
  headers, 
  spotify_access, 
  spotify_refresh, 
  spotify_expires_at
) => {
      // Check if the token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime >= spotify_expires_at) {
      // Token has expired, refresh it
      const response = await fetch('http://localhost:8000/refresh-token/', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: spotify_refresh }),
        headers: headers,
        credentials: 'include',
      });

      if (response.status === 200) {
        // Successfully refreshed the access token
        const tokenInfo = await response.json();
        const newAccessToken = tokenInfo.access_token;

        // Continue your API requests using the new access token
        spotify_access = newAccessToken;
        
        return spotify_access
      } else {
        // Handle token refresh error, e.g., log out the user or show an error message
        console.error('Error refreshing access token');
        return; // Return or handle the error as needed
      }
    }
}

export const checkUsersTracks = (
  recommendation,
  spotify_access,
  spotify_refresh,
  spotify_expires_at
) => async (dispatch) => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  try {
    const csrfToken = getCookie('csrftoken');
    const headers = {
      // 'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    };

    // Check if the token has expired
    const new_spotify_access = await checkTokenExpiration(headers, spotify_access, spotify_refresh, spotify_expires_at)

    // Continue with your API requests using the current or refreshed access token
    const apiResponse = await fetch('http://localhost:8000/check-users-tracks/', {
      method: 'POST', // Adjust the method and endpoint as needed
      body: JSON.stringify({
        'recommendation': recommendation,
        'spotify_access': new_spotify_access ? new_spotify_access : spotify_access,
        'spotify_refresh': spotify_refresh,
        'spotify_expires_at': spotify_expires_at,
      }),
      headers: headers,
      credentials: 'include',
    });

    if (apiResponse.status === 200) {
      // Request was successful, you can handle the response here
      console.log('API request successful');
      const responseData = await apiResponse.json();

      return responseData;
    } else {
      // Handle other response statuses here (e.g., error handling)
      console.error('API request failed');
    }
  } catch (error) {
    // Handle any network errors or exceptions here
    console.error('Error:', error);
  }
};


export const removeUsersTracks = (
  recommendation, 
  spotify_access, 
  spotify_refresh,
  spotify_expires_at
) => async (dispatch) => {

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  try {
    const csrfToken = getCookie('csrftoken');
    const headers = {
      // 'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    };

    const new_spotify_access = await checkTokenExpiration(headers, spotify_access, spotify_refresh, spotify_expires_at)

    const response = await fetch('http://localhost:8000/remove-users-tracks/', {
      method: 'POST',
      body: JSON.stringify({ 
        'recommendation': recommendation,
        'spotify_access': new_spotify_access ? new_spotify_access : spotify_access,
        'spotify_refresh': spotify_refresh,
        'spotify_expires_at': spotify_expires_at,
      }),
      headers: headers,
      credentials: 'include',
    });

    if (response.status === 200) {
      // request was successful, you can handle the response here
      console.log('Remove users tracks request successful');
      const responseData = await response.json();

      return responseData
    } else {
      // Handle other response statuses here (e.g., error handling)
      console.error('Remove users tracks request failed');
    }
  } catch (error) {
    // Handle any network errors or exceptions here
    console.error('Error:', error);
  };
};

export const handleUpdateUsername = (userId, newUsername) => async (dispatch) => {
  try {
    const csrfToken = await getCSRFToken();
    const data = { userId, newUsername }; // Include the user ID and new username in an object
    const body = JSON.stringify(data);

    const response = await fetch(`http://localhost:8000/update-username/${userId}/`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, // Include the CSRF token in the request headers
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

export const createPlaylistRequest = async (
  userId, 
  playlistName, 
  playlistDescription, 
  isPublic, 
  spotify_access,
  spotify_refresh,
  spotify_expires_at,
) => {
  try {
    const csrfToken = await getCSRFToken();
    const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, 
    }
    const new_spotify_access = await checkTokenExpiration(headers, spotify_access, spotify_refresh, spotify_expires_at)
    const data = { 
      user_id: userId, 
      name: playlistName, 
      description: playlistDescription, 
      public: isPublic,
      spotify_access: new_spotify_access ? new_spotify_access : spotify_access,
    };
    const body = JSON.stringify(data);

    const response = await fetch(`http://localhost:8000/create-playlist/${userId}/`, {
      headers: headers,
      method: 'POST', 
      body,
    });

    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }

    const res = await response.json();    
  } catch (error) {
    console.log('Error: ' + error.message);
  };

};

export const sendLyricsToServer = async (lyrics) => {
  try {
    const csrfToken = await getCSRFToken();

    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    };

    const response = await fetch('http://localhost:8000/search-lyrics/', {
      method: 'POST',
      headers: headers,
      body: lyrics,
    });

    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }

    const result = await response.json();
    const tracks = result['combined_tracks_info']
    
    return tracks
  } catch (error) {
    console.error('Error:', error);
  }
};



