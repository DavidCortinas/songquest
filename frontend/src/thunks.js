import { useEffect, useState } from 'react';
import { searchSongSuccess, searchSong, searchSongFailure, confirmUser, discoverSong, discoverSongSuccess, receiveSongResults, receivePerformerResults, receiveSpotifySeedGenres, receiveSpotifyMarkets } from './actions';
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
  console.log('check registration: ', user)
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

export const login = (email, password, spotify_access_token, spotify_refresh_token) => async (dispatch) => {
  try {
    const csrfToken = await getCSRFToken();
    const body = JSON.stringify({
      email: email,
      password: password,
      spotify_access_token: spotify_access_token,
      spotify_refresh_token: spotify_refresh_token,
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
    console.log('login res: ', res)

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
  const UPLOAD_URL = "/api/upload";
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

export const getSpotifyUserAuth = ()=> async (dispatch) => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  
  console.log('getSpotifyUserAuth')
      try {
      const csrfToken = getCookie('csrftoken');
      const headers = {
        // 'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      };

      const response = await fetch('http://localhost:8000/request-authorization/', {
        method: 'POST',
        headers: headers,
        credentials: 'include',
      });
      console.log(response)

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

export const refreshAccessToken =(refreshToken) => async (dispatch) => {
  try {
    const response = await fetch(`/refresh_token/?refresh_token=${refreshToken}`);
    const { access_token } = response.data;

    console.log('Refreshed Access Token: ', access_token);

    return access_token;
  } catch (error) {
    console.lerror('Error refreshing access token: ', error);
    throw error;
  }
};

export const checkTokenExpiration = (token) => {
  const expirationTime = token.expiresAt;
  const currentTime = Date.now() / 1000;

  const timeUntilExpiration = expirationTime - currentTime;

  const refreshThreshold = 60;

  if (timeUntilExpiration < refreshThreshold) {
    // Call the refreshAccessToken function when token is about to expire
    // Pass the refresh token to it
    refreshAccessToken(token.refreshToken)
      .then((newAccessToken) => {
        // Handle the refreshed access token, e.g., update it in your state or perform API requests
        console.log('Refreshed Access Token: ', newAccessToken);
      })
      .catch((error) => {
        // Handle the error, e.g., log out the user or show an error message
        console.error('Error refreshing access token: ', error);
      });
  }
};


export const getSpotifySearchResult = (value, parameter, accessToken) => async (dispatch) => {
  const type = parameter === 'songs' ? 'track' : 'artist'
  console.log('Search Access Token: ', accessToken)
  try {
    const API_URL =  `https://api.spotify.com/v1/search?q=${encodeURIComponent(value)}&type=${type}&include_external=audio`;
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