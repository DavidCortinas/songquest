export const SEARCH_SONG = 'SEARCH_SONG';
export const searchSong = (songData, query, dataLoaded) => {
  return {
    type: SEARCH_SONG,
    payload: { songData, query, dataLoaded },
  };
};

export const SEARCH_SONG_SUCCESS = 'SEARCH_SONG_SUCCESS';
export const searchSongSuccess = (songData, query, dataLoaded) => {
  return {
    type: SEARCH_SONG_SUCCESS,
    payload: { songData, query, dataLoaded },
  };
};

export const SEARCH_SONG_FAILURE = 'SEARCH_SONG_FAILURE';
export const searchSongFailure = (error) => ({
  type: SEARCH_SONG_FAILURE,
  payload: error,
});

export const CLEAR_SEARCH_SONG_ERROR = 'CLEAR_SEARCH_SONG_ERROR';
export const clearSearchSongError = () => ({
  type: CLEAR_SEARCH_SONG_ERROR,
});

export const RESET_DATA_LOADED = 'RESET_DATA_LOADED';
export const resetDataLoaded = () => ({
  type: RESET_DATA_LOADED,
});

export const CONFIRM_USER = "CONFIRM_USER";
export const confirmUser = (user) => ({
  type: CONFIRM_USER,
  payload: { user },
})

export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const setCurrentUser = (user) => ({
  type: SET_CURRENT_USER,
  payload: { user },
});

export const DISCOVER_SONG= 'DISCOVER_SONG';
export const discoverSong = (recommendations, dataLoaded, query) => {
  return {
    type: DISCOVER_SONG,
    payload: { recommendations, dataLoaded, query },
  };
};

export const DISCOVER_SONG_SUCCESS = 'DISCOVER_SONG_SUCCESS';
export const discoverSongSuccess = (recommendations, dataLoaded) => {
  return {
    type: DISCOVER_SONG_SUCCESS,
    payload: { recommendations, dataLoaded },
  };
};

export const DISCOVER_SONG_FAILURE = 'DISCOVER_SONG_FAILURE';
export const discoverSongFailure = (error) => ({
  type: DISCOVER_SONG_FAILURE,
  payload: error,
}); 

export const RESET_QUERY_PARAMETER = 'RESET_QUERY_PARAMETER';
export const resetQueryParameter = () => ({
  type: RESET_QUERY_PARAMETER,
});

export const SET_QUERY_PARAMETER = 'SET_QUERY_PARAMETER';
export const setQueryParameter = (query, parameter, newValues) => ({
  type: SET_QUERY_PARAMETER,
  payload: { query, parameter, newValues },
})

export const RECEIVE_SPOTIFY_SONG_RESULTS = 'RECEIVE_SPOTIFY_SONG_RESULTS';
export const receiveSongResults = (tracks) => ({
  type: RECEIVE_SPOTIFY_SONG_RESULTS,
  payload: { tracks },
})

export const RECEIVE_SPOTIFY_PERFORMER_RESULTS = 'RECEIVE_SPOTIFY_PERFORMER_RESULTS';
export const receivePerformerResults = (artists) => ({
  type: RECEIVE_SPOTIFY_PERFORMER_RESULTS,
  payload: { artists },
})

export const RECEIVE_SPOTIFY_SEED_GENRES = 'RECEIVE_SPOTIFY_SEED_GENRES';
export const receiveSpotifySeedGenres = (genres) => ({
  type: RECEIVE_SPOTIFY_SEED_GENRES,
  payload: { genres },
}) 

export const RECEIVE_SPOTIFY_MARKETS = 'RECEIVE_SPOTIFY_MARKETS';
export const receiveSpotifyMarkets = (markets) => ({
  type: RECEIVE_SPOTIFY_MARKETS,
  payload: { markets },
})

export const REQUEST_SPOTIFY_USER_AUTH = 'REQUEST_SPOTIFY_USER_AUTH';
export const requestSpotifyUserAuth = () => ({
  type: REQUEST_SPOTIFY_USER_AUTH
})


