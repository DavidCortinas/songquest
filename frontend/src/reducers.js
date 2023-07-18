import { createSlice } from '@reduxjs/toolkit';
import {
  CLEAR_SEARCH_SONG_ERROR,
  CONFIRM_USER,
  RESET_DATA_LOADED,
  SEARCH_SONG,
  SEARCH_SONG_FAILURE,
  SEARCH_SONG_SUCCESS,
  SET_CURRENT_USER,
} from './actions';

const initialSongState = {
  query: { song: '', performer: '' },
  songData: { ascap_results: {}, bmi_results: {} },
  dataLoaded: false,
  error: null,
  user: {
    email: '',
    isRegistered: false,
  },
};

const initialAuthState = {
    token: null,
    refreshToken: null,
    account: null,
};

export const song = (state = initialSongState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_SONG: {
      return {
        ...state,
        query: payload.query,
        dataLoaded: false,
      };
    }
    case SEARCH_SONG_SUCCESS: {
      return {
        ...state,
        songData: payload.songData,
        query: payload.query,
        dataLoaded: true,
      };
    }
    case SEARCH_SONG_FAILURE: {
      return {
        ...state,
        error: payload,
      };
    }
    case CLEAR_SEARCH_SONG_ERROR:
      return {
        ...state,
        error: null,
      };
    case RESET_DATA_LOADED:
      return {
        ...state,
        dataLoaded: false,
      };
    case CONFIRM_USER:
      return {
        ...state,
        user: payload.user,
        isRegistered: payload.isRegistered
      };
    default:
      return {
        ...state,
        dataLoaded: false,
      };
  }
};

export const user = (state = { currentUser: null }, action) => {
    const { type, payload } = action;
    switch (type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: payload.user,
      };
    default:
      return state;
  }
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setAuthTokens(state, action) {
      return {
        ...state,
        refreshToken: action.payload.refreshToken,
        token: action.payload.token,
      };
    },
    setAccount(state, action) {
      return {
        ...state,
        account: action.payload,
      };
    },
    logout() {
      return initialAuthState;
    },
  },
});