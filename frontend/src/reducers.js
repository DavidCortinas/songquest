import { createSlice } from '@reduxjs/toolkit';
import {
  CLEAR_SEARCH_SONG_ERROR,
  CONFIRM_USER,
  DISCOVER_SONG,
  DISCOVER_SONG_SUCCESS,
  RECEIVE_LYRIC_RESULTS,
  RECEIVE_SPOTIFY_MARKETS,
  RECEIVE_SPOTIFY_PERFORMER_RESULTS,
  RECEIVE_SPOTIFY_SEED_GENRES,
  RECEIVE_SPOTIFY_SONG_RESULTS,
  RECEIVE_SPOTIFY_TRACK,
  REFRESH_SPOTIFY_ACCESS,
  RESET_DATA_LOADED,
  RESET_QUERY_PARAMETER,
  SEARCH_SONG,
  SEARCH_SONG_FAILURE,
  SEARCH_SONG_SUCCESS,
  SET_CURRENT_USER,
  SET_QUERY_PARAMETER,
  UPDATE_EMAIL,
  UPDATE_USERNAME,
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

const initialDiscoveryState = {
        query: {
          limit: null,
          songs: [], 
          performers: [], 
          genres: [],
          market: '',
          acousticness: {
            min: null,
            target: null,
            max: null,
            label: 'acousticness',  
          },
          danceability: {
            min: null,
            target: null, 
            max: null,
            label: 'danceability',  
          },
          duration_ms: {
            min: null,
            target: null, 
            max: null, 
            label: 'length', 
          },
          energy: {
            min: null, 
            target: null, 
            max: null,
            label: 'energy', 
          },
          instrumentalness: {
            min: null, 
            target: null, 
            max: null,
            label: 'instrumentalness', 
          },
          key: {
            min: null, 
            target: null,
            max: null, 
            label: 'key', 
          },
          liveness: {
            min: null, 
            target: null, 
            max: null, 
            label: 'liveness', 
          },
          loudness: {
            min: null,
            target: null,
            max: null, 
            label: 'loudness', 
          }, 
          mode: {
            min: null, 
            target: null, 
            max: null,
            label: 'modality', 
          },
          popularity: {
            min: null, 
            target: null, 
            max: null,
            label: 'popularity', 
          },
          speechiness: {
            min: null, 
            target: null,
            max: null,
            label: 'speechiness', 
          }, 
          tempo: {
            min: null, 
            target: null,
            max: null,
            label: 'tempo',  
          },
          time_signature: {
            min: null, 
            target: null, 
            max: null,
            label: 'time-signature', 
          },
          valence: {
            min: null, 
            target: null,
            max: null,
            label: 'positiveness', 
          }
        },
        tracks: {
            href: '',
            items: [],
            limit: 0,
            next: '',
            offset: 0,
            previous: null,
            total: 0,
        },
        artists: {
            href: '',
            items: [],
            limit: 0,
            next: '',
            offset: 0,
            previous: null,
            total: 0,
        },
        genres: [],
        markets: [],
    }

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
    case REFRESH_SPOTIFY_ACCESS:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          spotify_access: payload.newAccessToken,
          spotify_expires_at: payload.expiresAt,
        },
      };
    case UPDATE_USERNAME:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          user: {
            ...state.currentUser.user,
            username: payload.newUsername,
          },
        },
      };
    case UPDATE_EMAIL:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          user: {
            ...state.currentUser.user,
            email: payload.newEmail,
          },
        },
      };
    default:
      return state;
  };
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

export const discovery = (state = initialDiscoveryState, action) => {
    const { type, payload } = action;
    switch (type) {
      case DISCOVER_SONG:
        return {
          ...state,
          query: payload.query,
          recommendations: payload.recommendations,
          dataLoaded: false,
        };
      case DISCOVER_SONG_SUCCESS:
        return {
          ...state,
          recommendations: payload.recommendations,
          dataLoaded: true,
        };
      case RESET_QUERY_PARAMETER:
        return {
          ...state,
          query: initialDiscoveryState.query,
        };
      case RESET_DATA_LOADED:
        return {
          ...state,
          dataLoaded: false,
        };
      case SET_QUERY_PARAMETER:
        const { parameter, newValues } = action.payload;
        return {
          ...state,
          query: {
            ...state.query,
            [parameter]: {
              ...state.query[parameter],
              min: newValues[0],
              max: newValues[1],
              target: newValues[2],
            }
            }
        };
      case RECEIVE_LYRIC_RESULTS:
        return {
          ...state,
          lyricResults: payload.tracks,
        };
      case RECEIVE_SPOTIFY_SONG_RESULTS:
        return {
          ...state,
          tracks: payload.tracks,
        };
      case RECEIVE_SPOTIFY_PERFORMER_RESULTS:
        return {
          ...state,
          artists: payload.artists,
        };
      case RECEIVE_SPOTIFY_SEED_GENRES:
        return {
          ...state,
          genres: payload.genres,
        };
      case RECEIVE_SPOTIFY_MARKETS:
        return {
          ...state,
          markets: payload.markets,
        };
    default:
      return state;
  }
}