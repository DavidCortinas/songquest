import { searchSongSuccess, searchSong, searchSongFailure, confirmUser } from './actions';
import getCSRFToken from './csrf';
import { authSlice } from './reducers';
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

export const login = (email, password) => async (dispatch) => {
  try {
    const csrfToken = await getCSRFToken();
    const body = JSON.stringify({
      email: email,
      password: password,
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
  const UPLOAD_URL = "/api/upload";
  const data =new FormData();
  for (let file of filelist) {
    data.append(file.name, file);
  }
  console.log('handleUpload')
  fetch(UPLOAD_URL, data)
}
