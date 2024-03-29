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

export const REFRESH_SPOTIFY_ACCESS = 'REFRESH_SPOTIFY_ACCESS';
export const refreshSpotifyAccess = (newAccessToken, expiresAt) => ({
  type: REFRESH_SPOTIFY_ACCESS,
  payload: { newAccessToken, expiresAt },
});

export const CONFIRM_SPOTIFY_ACCESS = 'CONFIRM_SPOTIFY_ACCESS';
export const confirmSpotifyAccess = (spotifyConnected) => ({
  type: CONFIRM_SPOTIFY_ACCESS,
  payload: { spotifyConnected },
});

export const UPDATE_USERNAME = 'UPDATE_USERNAME';
export const updateUsername = (newUsername) => ({
  type: UPDATE_USERNAME,
  payload: { newUsername },
});

export const UPDATE_EMAIL = 'UPDATE_EMAIL';
export const updateEmail = (newEmail) => ({
  type: UPDATE_EMAIL,
  payload: { newEmail },
});

export const RESEND_VERIFICATION_REQUEST = 'RESEND_VERIFICATION_REQUEST';
export const resendVerificationRequest = () => ({
  type: RESEND_VERIFICATION_REQUEST,
})

export const RESEND_VERIFICATION_SUCCESS = 'RESEND_VERIFICATION_SUCCESS';
export const resendVerificationSuccess = () => ({
  type: RESEND_VERIFICATION_SUCCESS,
});

export const RESEND_VERIFICATION_FAILURE = 'RESEND_VERIFICATION_FAILURE';
export const resendVerificationFailure = (error) => ({
  type: RESEND_VERIFICATION_FAILURE,
  payload: { error },
});

export const EMAIL_VERIFICATION_SUCCESS = 'EMAIL_VERIFICATION_SUCCESS';
export const emailVerificationSuccess = (emailVerified) => ({
  type: EMAIL_VERIFICATION_SUCCESS,
  payload: { emailVerified }
});

export const EMAIL_VERIFICATION_FAILURE = 'EMAIL_VERIFICATION_FAILURE';
export const emailVerificationFailure = (emailVerified, error) => ({
  type: EMAIL_VERIFICATION_FAILURE,
  payload: { emailVerified, error }
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

export const RESET_QUERY_PARAMETER = 'RESET_QUERY_PARAMETER';
export const resetQueryParameter = () => ({
  type: RESET_QUERY_PARAMETER,
});

export const SET_QUERY_PARAMETER = 'SET_QUERY_PARAMETER';
export const setQueryParameter = (query, parameter, newValues) => ({
  type: SET_QUERY_PARAMETER,
  payload: { query, parameter, newValues },
});

export const CLEAR_SEEDS_ARRAY = 'CLEAR_SEEDS_ARRAY';
export const clearSeedsArray = () => ({
  type: CLEAR_SEEDS_ARRAY,
});

export const CLEAR_RECOMMENDATIONS = 'CLEAR_RECOMMENDATIONS';
export const clearRecommendations = () => ({
  type: CLEAR_RECOMMENDATIONS,
});

export const RECEIVE_LYRIC_RESULTS = 'RECEIVE_LYRIC_RESULTS';
export const receiveLyricResults = (tracks) => {
  return ({
  type: RECEIVE_LYRIC_RESULTS,
  payload: { tracks },
})};

export const RECEIVE_SPOTIFY_SONG_RESULTS = 'RECEIVE_SPOTIFY_SONG_RESULTS';
export const receiveSongResults = (tracks) => ({
  type: RECEIVE_SPOTIFY_SONG_RESULTS,
  payload: { tracks },
});

export const RECEIVE_SPOTIFY_PERFORMER_RESULTS = 'RECEIVE_SPOTIFY_PERFORMER_RESULTS';
export const receivePerformerResults = (artists) => ({
  type: RECEIVE_SPOTIFY_PERFORMER_RESULTS,
  payload: { artists },
});

export const RECEIVE_SPOTIFY_SEED_GENRES = 'RECEIVE_SPOTIFY_SEED_GENRES';
export const receiveSpotifySeedGenres = (genres) => ({
  type: RECEIVE_SPOTIFY_SEED_GENRES,
  payload: { genres },
}) ;

export const RECEIVE_SPOTIFY_MARKETS = 'RECEIVE_SPOTIFY_MARKETS';
export const receiveSpotifyMarkets = (markets) => ({
  type: RECEIVE_SPOTIFY_MARKETS,
  payload: { markets },
});

export const SAVE_PREVIOUS_QUERY = 'SAVE_PREVIOUS_QUERY';
export const savePreviousQuery = (previousQuery) => ({
  type: SAVE_PREVIOUS_QUERY,
  payload: { previousQuery },
});

export const SAVE_QUERY = 'SAVE_QUERY';
export const saveQuery = (query) => ({
  type: SAVE_QUERY,
  payload: { query },
});

export const REQUEST_SPOTIFY_USER_AUTH = 'REQUEST_SPOTIFY_USER_AUTH';
export const requestSpotifyUserAuth = () => ({
  type: REQUEST_SPOTIFY_USER_AUTH
});

export const ADD_TO_CURRENT_PLAYLIST = 'ADD_TO_CURRENT_PLAYLIST';
export const addToCurrentPlaylist = (...songs) => ({
  type: ADD_TO_CURRENT_PLAYLIST,
  payload: { songs },
});

export const REMOVE_FROM_CURRENT_PLAYLIST_BY_ID = 'REMOVE_FROM_CURRENT_PLAYLIST_BY_ID';
export const removeFromCurrentPlaylistById = (...songIds) => ({
  type: REMOVE_FROM_CURRENT_PLAYLIST_BY_ID,
  payload: { songIds },
});

export const REMOVE_FROM_CURRENT_PLAYLIST_BY_SPOTIFY_ID = 'REMOVE_FROM_CURRENT_PLAYLIST_BY_SPOTIFY_ID';
export const removeFromCurrentPlaylistBySpotifyId = (...songSpotifyIds) => ({
  type: REMOVE_FROM_CURRENT_PLAYLIST_BY_SPOTIFY_ID,
  payload: { songSpotifyIds },
});

export const CREATE_PLAYLIST = 'CREATE_PLAYLIST';
export const createPlaylist = (playlist) => ({
  type: CREATE_PLAYLIST,
  payload: { playlist },
});

export const ADD_TO_SAVED_PLAYLIST = 'ADD_TO_SAVED_PLAYLIST';
export const addToSavedPlaylist = (playlistId, songs) => ({
  type: ADD_TO_SAVED_PLAYLIST,
  payload: { 
    playlistId, 
    songs: Array.isArray(songs) ? songs : [songs] 
  },
});

export const GET_USER_PLAYLISTS_REQUEST = 'GET_USER_PLAYLISTS_REQUEST';
export const getUserPlaylistsRequest = () => ({
 type: GET_USER_PLAYLISTS_REQUEST,
}); 

export const GET_USER_PLAYLISTS_SUCCESS = 'GET_USER_PLAYLISTS_SUCCESS';
export const getUserPlaylistsSuccess = (playlists) => ({
 type: GET_USER_PLAYLISTS_SUCCESS,
 payload: { playlists },
});

export const GET_USER_PLAYLISTS_FAILURE = 'GET_USER_PLAYLISTS_FAILURE';
export const getUserPlaylistsFailure = (error) => ({
 type: GET_USER_PLAYLISTS_FAILURE,
 payload: { error },
});

export const DELETE_PLAYLIST = 'DELETE_PLAYLIST';
export const deletePlaylist = (...playlistIds) => ({
  type: DELETE_PLAYLIST,
  payload: { playlists: playlistIds },
});

export const RESET_CURRENT_PLAYLIST = 'RESET_CURRENT_PLAYLIST';
export const resetCurrentPlaylist = () => ({
  type: RESET_CURRENT_PLAYLIST,
});

export const GET_REQUEST_PARAMETERS_REQUEST = 'GET_REQUEST_PARAMETERS_REQUEST';
export const getRequestParametersRequest = () => ({
  type: GET_REQUEST_PARAMETERS_REQUEST,
});

export const GET_REQUEST_PARAMETERS_SUCCESS = 'GET_REQUEST_PARAMETERS_SUCCESS';
export const getRequestParametersSuccess = (userRequestParameters) => ({
  type: GET_REQUEST_PARAMETERS_SUCCESS,
  payload: { userRequestParameters },
});

export const GET_REQUEST_PARAMETERS_FAILURE = 'GET_REQUEST_PARAMETERS_FAILURE';
export const getRequestParametersFailure = (error) => ({
  type: GET_REQUEST_PARAMETERS_FAILURE,
  payload: { error },
});




