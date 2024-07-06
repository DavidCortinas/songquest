// export const SEARCH_SONG = 'SEARCH_SONG';
// export const searchSong = (songData, query, dataLoaded) => {
// 	return {
// 		type: SEARCH_SONG,
// 		payload: { songData, query, dataLoaded }
// 	};
// };

// export const SEARCH_SONG_SUCCESS = 'SEARCH_SONG_SUCCESS';
// export const searchSongSuccess = (songData, query, dataLoaded) => {
// 	return {
// 		type: SEARCH_SONG_SUCCESS,
// 		payload: { songData, query, dataLoaded }
// 	};
// };

// export const SEARCH_SONG_FAILURE = 'SEARCH_SONG_FAILURE';
// export const searchSongFailure = error => ({
// 	type: SEARCH_SONG_FAILURE,
// 	payload: error
// });

// export const CLEAR_SEARCH_SONG_ERROR = 'CLEAR_SEARCH_SONG_ERROR';
// export const clearSearchSongError = () => ({
// 	type: CLEAR_SEARCH_SONG_ERROR
// });

export const RESET_DATA_LOADED = 'RESET_DATA_LOADED';
export const resetDataLoaded = () => ({
	type: RESET_DATA_LOADED
});

export const CONFIRM_USER = 'CONFIRM_USER';
export const confirmUser = user => ({
	type: CONFIRM_USER,
	payload: { user }
});

export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const setCurrentUser = user => ({
	type: SET_CURRENT_USER,
	payload: { user }
});

export const REFRESH_SPOTIFY_ACCESS = 'REFRESH_SPOTIFY_ACCESS';
export const refreshSpotifyAccess = (newAccessToken, expiresAt) => ({
	type: REFRESH_SPOTIFY_ACCESS,
	payload: { newAccessToken, expiresAt }
});

export const CONFIRM_SPOTIFY_ACCESS = 'CONFIRM_SPOTIFY_ACCESS';
export const confirmSpotifyAccess = spotifyConnected => ({
	type: CONFIRM_SPOTIFY_ACCESS,
	payload: { spotifyConnected }
});

export const GET_USER_PROFILE_REQUEST = 'GET_USER_PROFILE_REQUEST';
export const getUserProfileRequest = () => ({
	type: GET_USER_PROFILE_REQUEST
});

export const GET_USER_PROFILE_SUCCESS = 'GET_USER_PROFILE_SUCCESS';
export const getUserProfileSuccess = profile => ({
	type: GET_USER_PROFILE_SUCCESS,
	payload: { profile }
});

export const GET_USER_PROFILE_FAILURE = 'GET_USER_PROFILE_FAILURE';
export const getUserProfileFailure = error => ({
	type: GET_USER_PROFILE_FAILURE,
	payload: { error }
});

export const UPDATE_USER_PROFILE_REQUEST = 'UPDATE_USER_PROFILE_REQUEST';
export const updateUserProfileRequest = () => ({
	type: UPDATE_USER_PROFILE_REQUEST
});

export const UPDATE_USER_PROFILE_SUCCESS = 'UPDATE_USER_PROFILE_SUCCESS';
export const updateUserProfileSuccess = user => ({
	type: UPDATE_USER_PROFILE_SUCCESS,
	payload: { user }
});

export const UPDATE_USER_PROFILE_FAILURE = 'UPDATE_USER_PROFILE_FAILURE';
export const updateUserProfileFailure = error => ({
	type: UPDATE_USER_PROFILE_FAILURE,
	payload: { error }
});

export const UPDATE_DISPLAY_NAME_REQUEST = 'UPDATE_DISPLAY_NAME_REQUEST';
export const updateDisplayNameRequest = () => ({
	type: UPDATE_DISPLAY_NAME_REQUEST
});

export const UPDATE_DISPLAY_NAME_SUCCESS = 'UPDATE_DISPLAY_NAME_SUCCESS';
export const updateDisplayNameSuccess = newDisplayName => ({
	type: UPDATE_DISPLAY_NAME_SUCCESS,
	payload: { newDisplayName }
});

export const UPDATE_DISPLAY_NAME_FAILURE = 'UPDATE_DISPLAY_NAME_FAILURE';
export const updateDisplayNameFailure = error => ({
	type: UPDATE_DISPLAY_NAME_FAILURE,
	payload: { error }
});

export const UPDATE_BIRTHDAY = 'UPDATE_BIRTHDAY';
export const updateBirthday = birthday => ({
	type: UPDATE_BIRTHDAY,
	payload: { birthday }
});

export const UPDATE_PREFERRED_GENRES = 'UPDATE_PREFERRED_GENRES';
export const updatePreferredGenres = genres => ({
	type: UPDATE_PREFERRED_GENRES,
	payload: { genres }
});

export const UPDATE_USER_TYPE = 'UPDATE_USER_TYPE';
export const updateUserType = user_type => ({
	type: UPDATE_USER_TYPE,
	payload: { user_type }
});

export const UPDATE_USER_PROFESSION = 'UPDATE_USER_PROFESSION';
export const updateUserProfession = profession => ({
	type: UPDATE_USER_PROFESSION,
	payload: { profession }
});

export const UPDATE_PROFILE_IMAGE = 'UPDATE_PROFILE_IMAGE';
export const updateProfileImage = imageUrl => ({
	type: UPDATE_PROFILE_IMAGE,
	payload: { imageUrl }
});

export const UPDATE_EMAIL = 'UPDATE_EMAIL';
export const updateEmail = newEmail => ({
	type: UPDATE_EMAIL,
	payload: { newEmail }
});

export const RESEND_VERIFICATION_REQUEST = 'RESEND_VERIFICATION_REQUEST';
export const resendVerificationRequest = () => ({
	type: RESEND_VERIFICATION_REQUEST
});

export const RESEND_VERIFICATION_SUCCESS = 'RESEND_VERIFICATION_SUCCESS';
export const resendVerificationSuccess = () => ({
	type: RESEND_VERIFICATION_SUCCESS
});

export const RESEND_VERIFICATION_FAILURE = 'RESEND_VERIFICATION_FAILURE';
export const resendVerificationFailure = error => ({
	type: RESEND_VERIFICATION_FAILURE,
	payload: { error }
});

export const EMAIL_VERIFICATION_SUCCESS = 'EMAIL_VERIFICATION_SUCCESS';
export const emailVerificationSuccess = emailVerified => ({
	type: EMAIL_VERIFICATION_SUCCESS,
	payload: { emailVerified }
});

export const EMAIL_VERIFICATION_FAILURE = 'EMAIL_VERIFICATION_FAILURE';
export const emailVerificationFailure = (emailVerified, error) => ({
	type: EMAIL_VERIFICATION_FAILURE,
	payload: { emailVerified, error }
});

export const DISCOVER_SONG = 'DISCOVER_SONG';
export const discoverSong = (dataLoaded, query) => {
	return {
		type: DISCOVER_SONG,
		payload: { dataLoaded, query }
	};
};

export const DISCOVER_SONG_SUCCESS = 'DISCOVER_SONG_SUCCESS';
export const discoverSongSuccess = (recommendations, dataLoaded) => {
	return {
		type: DISCOVER_SONG_SUCCESS,
		payload: { recommendations, dataLoaded }
	};
};

export const RESET_QUERY_PARAMETER = 'RESET_QUERY_PARAMETER';
export const resetQueryParameter = () => ({
	type: RESET_QUERY_PARAMETER
});

export const SET_QUERY_PARAMETER = 'SET_QUERY_PARAMETER';
export const setQueryParameter = (query, parameter, newValues) => ({
	type: SET_QUERY_PARAMETER,
	payload: { query, parameter, newValues }
});

export const CLEAR_SEEDS_ARRAY = 'CLEAR_SEEDS_ARRAY';
export const clearSeedsArray = () => ({
	type: CLEAR_SEEDS_ARRAY
});

export const CLEAR_RECOMMENDATIONS = 'CLEAR_RECOMMENDATIONS';
export const clearRecommendations = () => ({
	type: CLEAR_RECOMMENDATIONS
});

export const RECEIVE_LYRIC_RESULTS = 'RECEIVE_LYRIC_RESULTS';
export const receiveLyricResults = tracks => {
	return {
		type: RECEIVE_LYRIC_RESULTS,
		payload: { tracks }
	};
};

export const RECEIVE_SPOTIFY_SONG_RESULTS = 'RECEIVE_SPOTIFY_SONG_RESULTS';
export const receiveSongResults = tracks => ({
	type: RECEIVE_SPOTIFY_SONG_RESULTS,
	payload: { tracks }
});

export const RECEIVE_SPOTIFY_PERFORMER_RESULTS = 'RECEIVE_SPOTIFY_PERFORMER_RESULTS';
export const receivePerformerResults = artists => ({
	type: RECEIVE_SPOTIFY_PERFORMER_RESULTS,
	payload: { artists }
});

export const RECEIVE_SPOTIFY_SEED_GENRES = 'RECEIVE_SPOTIFY_SEED_GENRES';
export const receiveSpotifySeedGenres = genres => ({
	type: RECEIVE_SPOTIFY_SEED_GENRES,
	payload: { genres }
});

export const RECEIVE_SPOTIFY_MARKETS = 'RECEIVE_SPOTIFY_MARKETS';
export const receiveSpotifyMarkets = markets => ({
	type: RECEIVE_SPOTIFY_MARKETS,
	payload: { markets }
});

export const SAVE_PREVIOUS_QUERY = 'SAVE_PREVIOUS_QUERY';
export const savePreviousQuery = previousQuery => ({
	type: SAVE_PREVIOUS_QUERY,
	payload: { previousQuery }
});

export const SAVE_QUERY = 'SAVE_QUERY';
export const saveQuery = query => ({
	type: SAVE_QUERY,
	payload: { query }
});

export const DELETE_QUERY = 'DELETE_QUERY';
export const deleteQuery = queryId => ({
	type: DELETE_QUERY,
	payload: { queryId }
});

export const REQUEST_SPOTIFY_USER_AUTH = 'REQUEST_SPOTIFY_USER_AUTH';
export const requestSpotifyUserAuth = () => ({
	type: REQUEST_SPOTIFY_USER_AUTH
});

export const ADD_TO_CURRENT_PLAYLIST = 'ADD_TO_CURRENT_PLAYLIST';
export const addToCurrentPlaylist = (...tracks) => ({
	type: ADD_TO_CURRENT_PLAYLIST,
	payload: { tracks }
});

export const ADD_TO_PLAYLIST_TO_EDIT = 'ADD_TO_PLAYLIST_TO_EDIT';
export const addToPlaylistToEdit = (...tracks) => ({
	type: ADD_TO_PLAYLIST_TO_EDIT,
	payload: {
		tracks: tracks.map(track => ({
			...track,
			isNew: true
		}))
	}
});

export const REORDER_PLAYLIST_TRACKS = 'REORDER_PLAYLIST_TRACKS';
export const reorderPlaylistTracks = (playlistId, newOrderTracks) => ({
	type: REORDER_PLAYLIST_TRACKS,
	payload: { playlistId, newOrderTracks }
});

export const REMOVE_FROM_PLAYLIST_TO_EDIT = 'REMOVE_FROM_PLAYLIST_TO_EDIT';
export const removeFromPlaylistToEdit = (...tracks) => ({
	type: REMOVE_FROM_PLAYLIST_TO_EDIT,
	payload: { tracks }
});

export const SET_CREATE_PLAYLIST = 'SET_CREATE_PLAYLIST';
export const setCreatePlaylist = () => ({
	type: SET_CREATE_PLAYLIST
});

export const SET_EDIT_PLAYLIST = 'SET_EDIT_PLAYLIST';
export const setEditPlaylist = () => ({
	type: SET_EDIT_PLAYLIST
});

export const SET_PLAYLIST_TO_EDIT = 'SET_PLAYLIST_TO_EDIT';
export const setPlaylistToEdit = playlistId => ({
	type: SET_PLAYLIST_TO_EDIT,
	payload: { playlistId }
});

export const SET_SELECTED_PLAYLIST = 'SET_SELECTED_PLAYLIST';
export const setSelectedPlaylist = playlistId => ({
	type: SET_SELECTED_PLAYLIST,
	payload: { playlistId }
});

export const REMOVE_FROM_CURRENT_PLAYLIST_BY_ID = 'REMOVE_FROM_CURRENT_PLAYLIST_BY_ID';
export const removeFromCurrentPlaylistById = (...trackIds) => {
	return {
		type: REMOVE_FROM_CURRENT_PLAYLIST_BY_ID,
		payload: { trackIds }
	};
};

export const REMOVE_FROM_CURRENT_PLAYLIST_BY_SPOTIFY_ID =
	'REMOVE_FROM_CURRENT_PLAYLIST_BY_SPOTIFY_ID';
export const removeFromCurrentPlaylistBySpotifyId = (...songSpotifyIds) => ({
	type: REMOVE_FROM_CURRENT_PLAYLIST_BY_SPOTIFY_ID,
	payload: { songSpotifyIds }
});

export const CREATE_PLAYLIST = 'CREATE_PLAYLIST';
export const createPlaylist = playlist => ({
	type: CREATE_PLAYLIST,
	payload: { playlist }
});

export const ADD_TO_SAVED_PLAYLIST = 'ADD_TO_SAVED_PLAYLIST';
export const addToSavedPlaylist = () => ({
	type: ADD_TO_SAVED_PLAYLIST
});

export const ADD_TO_SAVED_PLAYLIST_SUCCESS = 'ADD_TO_SAVED_PLAYLIST_SUCCESS';
export const addToSavedPlaylistSuccess = (playlistId, songs) => ({
	type: ADD_TO_SAVED_PLAYLIST_SUCCESS,
	payload: {
		playlistId,
		tracks: Array.isArray(songs) ? songs : [songs]
	}
});

export const ADD_TO_SAVED_PLAYLIST_FAILURE = 'ADD_TO_SAVED_PLAYLIST_FAILURE';
export const addToSavedPlaylistFailure = error => ({
	type: ADD_TO_SAVED_PLAYLIST_FAILURE,
	payload: { error }
});

export const STORE_PREVIOUS_PLAYLIST_STATE = 'STORE_PREVIOUS_PLAYLIST_STATE';
export const storePreviousPlaylistState = (playlistId, prevState) => ({
	type: STORE_PREVIOUS_PLAYLIST_STATE,
	payload: { playlistId, prevState }
});

export const UPDATE_PLAYLIST_ORDER_REQUEST = 'UPDATE_PLAYLIST_ORDER_REQUEST';
export const updatePlaylistOrderRequest = () => ({
	type: UPDATE_PLAYLIST_ORDER_REQUEST
});

export const UPDATE_PLAYLIST_ORDER_SUCCESS = 'UPDATE_PLAYLIST_ORDER_SUCCESS';
export const updatePlaylistOrderSuccess = (playlistId, orderedTracks, snapshotId) => ({
	type: UPDATE_PLAYLIST_ORDER_SUCCESS,
	payload: { playlistId, orderedTracks, snapshotId }
});

export const UPDATE_PLAYLIST_ORDER_FAILURE = 'UPDATE_PLAYLIST_ORDER_FAILURE';
export const updatePlaylistOrderFailure = error => ({
	type: UPDATE_PLAYLIST_ORDER_FAILURE,
	payload: { error }
});

export const REMOVE_FROM_SAVED_PLAYLIST = 'REMOVE_FROM_SAVED_PLAYLIST';
export const removeFromSavedPlaylist = (playlistId, songs) => ({
	type: REMOVE_FROM_SAVED_PLAYLIST,
	payload: {
		playlistId,
		tracks: Array.isArray(songs) ? songs : [songs]
	}
});

export const DELETE_PLAYLIST = 'DELETE_PLAYLIST';
export const deletePlaylist = (...playlistIds) => ({
	type: DELETE_PLAYLIST,
	payload: { playlists: playlistIds }
});

export const RESET_CURRENT_PLAYLIST = 'RESET_CURRENT_PLAYLIST';
export const resetCurrentPlaylist = () => ({
	type: RESET_CURRENT_PLAYLIST
});

export const GET_USER_PLAYLISTS_REQUEST = 'GET_USER_PLAYLISTS_REQUEST';
export const getUserPlaylistsRequest = () => ({
	type: GET_USER_PLAYLISTS_REQUEST
});

export const GET_USER_PLAYLISTS_SUCCESS = 'GET_USER_PLAYLISTS_SUCCESS';
export const getUserPlaylistsSuccess = playlists => ({
	type: GET_USER_PLAYLISTS_SUCCESS,
	payload: { playlists }
});

export const GET_USER_PLAYLISTS_FAILURE = 'GET_USER_PLAYLISTS_FAILURE';
export const getUserPlaylistsFailure = error => ({
	type: GET_USER_PLAYLISTS_FAILURE,
	payload: { error }
});

export const GET_REQUEST_PARAMETERS_REQUEST = 'GET_REQUEST_PARAMETERS_REQUEST';
export const getRequestParametersRequest = () => ({
	type: GET_REQUEST_PARAMETERS_REQUEST
});

export const GET_REQUEST_PARAMETERS_SUCCESS = 'GET_REQUEST_PARAMETERS_SUCCESS';
export const getRequestParametersSuccess = userRequestParameters => ({
	type: GET_REQUEST_PARAMETERS_SUCCESS,
	payload: { userRequestParameters }
});

export const GET_REQUEST_PARAMETERS_FAILURE = 'GET_REQUEST_PARAMETERS_FAILURE';
export const getRequestParametersFailure = error => ({
	type: GET_REQUEST_PARAMETERS_FAILURE,
	payload: { error }
});

export const GET_USER_TOKENS_REQUEST = 'GET_USER_TOKENS_REQUEST';
export const getUserTokensRequest = () => ({
	type: GET_USER_TOKENS_REQUEST
});

export const GET_USER_TOKENS_SUCCESS = 'GET_USER_TOKENS_SUCCESS';
export const getUserTokensSuccess = userTokens => ({
	type: GET_USER_TOKENS_SUCCESS,
	payload: { userTokens }
});

export const GET_USER_TOKENS_FAILURE = 'GET_USER_TOKENS_FAILURE';
export const getUserTokensFailure = error => ({
	type: GET_USER_TOKENS_FAILURE,
	payload: { error }
});

export const GET_USER_KARMA_REQUEST = 'GET_USER_KARMA_REQUEST';
export const getUserKarmaRequest = () => ({
	type: GET_USER_KARMA_REQUEST
});

export const GET_USER_KARMA_SUCCESS = 'GET_USER_KARMA_SUCCESS';
export const getUserKarmaSuccess = userKarma => ({
	type: GET_USER_KARMA_SUCCESS,
	payload: { userKarma }
});

export const GET_USER_KARMA_FAILURE = 'GET_USER_KARMA_FAILURE';
export const getUserKarmaFailure = error => ({
	type: GET_USER_KARMA_FAILURE,
	payload: { error }
});
