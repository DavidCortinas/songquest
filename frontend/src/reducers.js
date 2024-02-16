import { createSlice } from '@reduxjs/toolkit';
import {
  ADD_TO_CURRENT_PLAYLIST,
  ADD_TO_SAVED_PLAYLIST,
  CLEAR_RECOMMENDATIONS,
  CLEAR_SEARCH_SONG_ERROR,
  CLEAR_SEEDS_ARRAY,
  CONFIRM_SPOTIFY_ACCESS,
  CONFIRM_USER,
  CREATE_PLAYLIST,
  DELETE_PLAYLIST,
  DISCOVER_SONG,
  DISCOVER_SONG_SUCCESS,
  GET_USER_PLAYLISTS_FAILURE,
  GET_USER_PLAYLISTS_REQUEST,
  GET_USER_PLAYLISTS_SUCCESS,
  RECEIVE_LYRIC_RESULTS,
  RECEIVE_SPOTIFY_MARKETS,
  RECEIVE_SPOTIFY_PERFORMER_RESULTS,
  RECEIVE_SPOTIFY_SEED_GENRES,
  RECEIVE_SPOTIFY_SONG_RESULTS,
  REFRESH_SPOTIFY_ACCESS,
  REMOVE_FROM_CURRENT_PLAYLIST_BY_ID,
  RESET_CURRENT_PLAYLIST,
  RESET_DATA_LOADED,
  RESET_QUERY_PARAMETER,
  SAVE_PREVIOUS_QUERY,
  SAVE_QUERY,
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

export const initialDiscoveryState = {
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
  savedQueries: {
    previous: null,
    saved: [],
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
    case CONFIRM_USER:
      return {
        ...state,
        currentUser: {
          user: payload.user,
        },
        isRegistered: payload.isRegistered
      };
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
    case CONFIRM_SPOTIFY_ACCESS:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          user: {
            ...state.currentUser.user,
            spotify_connected: payload.spotifyConnected
          }
        }
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

export const playlist = (state = {playlists: [], currentPlaylist: []}, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_USER_PLAYLISTS_REQUEST:
      return { 
        ...state, 
        loading: true, 
        error: null 
      };
    case GET_USER_PLAYLISTS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        playlists: payload.playlists,
      };
    case GET_USER_PLAYLISTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.error,
      };
    case ADD_TO_CURRENT_PLAYLIST:
      return {
        ...state,
        currentPlaylist: [...state.currentPlaylist, ...payload.songs]
      };
    case REMOVE_FROM_CURRENT_PLAYLIST_BY_ID:
      const payloadSongIds = payload.songIds.map(songId => songId);
      return {
        ...state,
        currentPlaylist: state.currentPlaylist.filter(song =>
          payloadSongIds.includes(song)
        )
      };
    case CREATE_PLAYLIST:
      if (state.playlists.some(pl => pl.id === payload.playlist.id)) {
        console.log('Error: ' + 'A playlist with this ID already exists.');
        console.log('Please use a different ID for your new playlist.');
        return state;
      }
      return {
        ...state,
        playlists: [...state.playlists, payload.playlist]
      };
    case DELETE_PLAYLIST:
      return {
        ...state,
        playlists: state.playlists.filter(playlist => 
          !payload.playlists.includes(playlist.id))
      };
    case ADD_TO_SAVED_PLAYLIST:
      return {
        ...state,
        playlists: state.playlists.map(playlist => {
          if (playlist.id === payload.playlistId) {
            return {
              ...playlist,
              songs: [...playlist.songs, ...payload.songs]
            };
          }
          return playlist;
        })
      };
    case RESET_CURRENT_PLAYLIST:
      return {
        ...state,
        currentPlaylist: [],
      }
    default:
      return state;
  };
};

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
      case CLEAR_SEEDS_ARRAY:
        return {
          ...state,
          recommendations: {
            ...state.recommendations,
            seeds: [],
          },
        };
      case CLEAR_RECOMMENDATIONS:
        return {
          ...state,
          recommendations: {},
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
      case SAVE_PREVIOUS_QUERY:
        return {
          ...state,
          savedQueries: {
            ...state.savedQueries,
            previous: action.payload.previousQuery,
          },
        };
      case SAVE_QUERY:
        return {
          ...state,
          savedQueries: {
            ...state.savedQueries,
            saved: [...state.savedQueries.saved, action.payload.savedQuery],
          },
        };
    default:
      return state;
  }
}