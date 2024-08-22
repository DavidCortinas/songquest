/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
	// searchSongSuccess,
	// searchSong,
	// searchSongFailure,
	confirmUser,
	discoverSong,
	discoverSongSuccess,
	receiveSongResults,
	receivePerformerResults,
	receiveSpotifySeedGenres,
	receiveSpotifyMarkets,
	updateDisplayNameSuccess,
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
	resendVerificationRequest,
	getUserTokensRequest,
	getUserTokensFailure,
	getUserTokensSuccess,
	getUserKarmaSuccess,
	deletePlaylist,
	removeFromSavedPlaylist,
	updatePlaylistOrderSuccess,
	updatePlaylistOrderFailure,
	updatePlaylistOrderRequest,
	updateDisplayNameRequest,
	updateDisplayNameFailure,
	updateUserProfileRequest,
	updateUserProfileSuccess,
	updateUserProfileFailure,
	getUserProfileRequest,
	getUserProfileSuccess,
	getUserProfileFailure,
	addToSavedPlaylistSuccess,
	addToSavedPlaylistFailure,
	deleteQuery,
	updateBirthdaySuccess,
	updateBirthdayFailure,
	updateBirthdayRequest,
	updatePreferredGenresFailure,
	updatePreferredGenresSuccess,
	updatePreferredGenresRequest,
	updateUserTypeRequest,
	updateUserTypeSuccess,
	updateUserTypeFailure,
	updateUserProfessionFailure,
	updateUserProfessionSuccess,
	updateUserProfessionRequest,
	updateProfileImageRequest,
	updateProfileImageSuccess,
	updateProfileImageFailure
} from './actions';
import getCSRFToken from './csrf';
import { authSlice } from './reducers';
import { transformResponseToQueryStructure } from './utils';
import { withAuth } from './components/auth/utils';

// export const searchSongRequest = query => async dispatch => {
// 	try {
// 		const csrfToken = await getCSRFToken(); // Retrieve the CSRF token
// 		const body = JSON.stringify({
// 			song: query.song,
// 			performer: query.performer
// 		});
// 		const response = await fetch('/search/', {
// 			headers: {
// 				'Content-Type': 'application/json',
// 				'X-CSRFToken': csrfToken // Include the CSRF token in the request headers
// 			},
// 			method: 'post',
// 			// credentials: 'include',
// 			body
// 		});

// 		if (!response.ok) {
// 			throw new Error('Request failed with status ' + response.status);
// 		}

// 		const songData = await response.json();

// 		// Update the front end with the received data
// 		// Dispatch both searchSong and searchSongSuccess actions
// 		dispatch(searchSong(songData, query, false));
// 		// Dispatch searchSong action
// 		dispatch(searchSongSuccess(songData, query)); // Dispatch searchSongSuccess action with the query
// 		return songData;
// 	} catch (error) {
// 		console.log('Error: ' + error.message);
// 		dispatch(searchSongFailure(error.message));
// 		// alert('We had trouble finding that song. Please make sure you are spelling the song correctly and enter the performer for the quickest and most accurate search result')
// 		dispatch(
// 			searchSongSuccess({ ascap_results: {}, bmi_results: {} }, { song: '', performer: '' })
// 		);
// 	}
// };

export const checkRegistration = user => async dispatch => {
	try {
		const csrfToken = await getCSRFToken();
		const response = await fetch('api/user/', {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
				'User-Email': user.email
			},
			method: 'post'
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
};

export const registerUser = (email, password) => async () => {
	try {
		const normalizedEmail = email.trim().toLowerCase();
		const csrfToken = await getCSRFToken();
		const body = JSON.stringify({
			email: normalizedEmail,
			password: password
		});
		const response = await fetch(`/api/auth/register/`, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken
			},
			method: 'post',
			body
		});

		if (!response.ok) {
			throw new Error('Request failed with status ' + response.status);
		}

		const res = await response.json();

		return res;
	} catch (error) {
		console.log('Error: ' + error.message);
	}
};

export const login = (email, password) => async dispatch => {
	try {
		const normalizedEmail = email.trim().toLowerCase();
		const csrfToken = await getCSRFToken();
		const body = JSON.stringify({
			email: normalizedEmail,
			password: password
		});
		const response = await fetch(`/api/auth/login/`, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken
			},
			method: 'post',
			body
		});

		if (!response.ok) {
			const errorData = await response.json();
			const errorMessage = errorData.non_field_errors
				? errorData.non_field_errors.join(' ')
				: 'Request failed with status ' + response.status;
			throw new Error(errorMessage);
		}

		const res = await response.json();

		dispatch(
			authSlice.actions.setAuthTokens({
				token: res.access,
				refreshToken: res.refresh
			})
		);

		dispatch(authSlice.actions.setAccount(res.user));

		return res;
	} catch (error) {
		dispatch(authSlice.actions.setError(error.message));
	}
};

export const refreshAccessToken = refreshToken => async dispatch => {
	const csrfToken = await getCSRFToken();

	const response = await fetch('/api/auth/refresh/', {
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken
		},
		method: 'post',
		body: JSON.stringify({ refresh: refreshToken })
	});

	if (!response.ok) {
		const responseText = await response.text();
		console.log('Failed to refresh token response:', responseText);
		throw new Error('Failed to refresh token');
	}

	const res = await response.json();
	dispatch(authSlice.actions.refreshAccessToken(res.access));
	return res.access;
};

export const logoutThunk = async (dispatch, accessToken, refreshToken) => {
	const csrfToken = await getCSRFToken();
	const body = { refresh: refreshToken };

	const response = await fetch('/api/auth/logout/', {
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			Authorization: `Bearer ${accessToken}`
		},
		method: 'POST',
		body: JSON.stringify(body)
	});

	if (response.status === 205) {
		dispatch(authSlice.actions.logout());
	}

	return response;
};

export const logout = withAuth(logoutThunk);

export const resetPassword = email => async dispatch => {
	try {
		const csrfToken = await getCSRFToken();
		const body = JSON.stringify({ email });
		const response = await fetch(`/api/auth/password-reset/`, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken
			},
			method: 'post',
			body
		});

		if (!response.ok) {
			const errorData = await response.json();
			const errorMessage = errorData.non_field_errors
				? errorData.non_field_errors.join(' ')
				: 'Request failed with status ' + response.status;
			throw new Error(errorMessage);
		}

		const res = await response.json();
		dispatch(authSlice.actions.setSuccessMessage(res.detail));
		return res;
	} catch (error) {
		dispatch(authSlice.actions.setError(error.message));
	}
};

export const resetPasswordConfirm = (uid, token, newPassword) => async dispatch => {
	try {
		const csrfToken = await getCSRFToken();
		const body = JSON.stringify({ uid, token, new_password: newPassword });
		const response = await fetch(`/api/auth/password-reset-confirm/`, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken
			},
			method: 'post',
			body
		});

		if (!response.ok) {
			const errorData = await response.json();
			const errorMessage =
				errorData.detail || 'Request failed with status ' + response.status;
			throw new Error(errorMessage);
		}

		const res = await response.json();
		dispatch(authSlice.actions.setSuccessMessage(res.detail));
		return res;
	} catch (error) {
		dispatch(authSlice.actions.setError(error.message));
	}
};

// export const handleUpload = (filelist) => async (filelist) => {
//   const UPLOAD_URL = "/api/upload";
//   const data =new FormData();
//   for (let file of filelist) {
//     data.append(file.name, file);
//   }
//   fetch(UPLOAD_URL, data)
// }

export const discoverSongRequest = (parameters, userId) => async (dispatch, getState) => {
	dispatch(discoverSong(false, parameters));
	try {
		const csrfToken = await getCSRFToken(); // Retrieve the CSRF token
		const body = JSON.stringify({
			action: 'dig',
			parameters: parameters
		});

		let headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken
		};

		// Conditionally add the 'User-Id' header if 'userId' is present
		if (userId) {
			headers['User-Id'] = userId;
		}

		const response = await fetch('/api/discover/', {
			headers: headers,
			method: 'post',
			body: body
		});

		if (!response.ok) {
			throw new Error(`Request failed with status ${response.status}`);
		}

		const res = await response.json();

		const discovery = res['recommendations'];
		const userTokens = res['updated_tokens'];
		const userKarma = res['updated_karma'];

		if (typeof userTokens === 'number') {
			dispatch(getUserTokensSuccess(userTokens));
		}

		if (typeof userKarma === 'number') {
			dispatch(getUserKarmaSuccess(userKarma));
		}

		const prevQuery = getState().discovery.query;
		dispatch(savePreviousQuery(prevQuery));

		dispatch(discoverSongSuccess(discovery, true));
		return discovery;
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
};

export const SpotifyAuth = ({ children }) => {
	const [accessToken, setAccessToken] = useState('');
	const [expiresAt, setExpiresAt] = useState('');

	useEffect(() => {
		async function fetchAccessToken() {
			try {
				const response = await fetch('/api/get-access-token/');
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

	return <>{children(accessToken, expiresAt)}</>;
};

export const getSpotifyUserAuth = (userId, source) => async () => {
	try {
		const csrfToken = await getCSRFToken();
		const response = await fetch('/api/request-authorization/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken
			},
			body: JSON.stringify({ source })
		});

		if (response.ok) {
			const data = await response.json();
			const authorizationUrl = data.authorization_url;

			window.location.href = authorizationUrl; // Perform the redirect on the client side
		} else {
			console.error('Authorization request failed');
		}
	} catch (error) {
		console.error('Error:', error);
	}
};

export const getSpotifySearchResult =
	(value, parameter, accessToken, expiresAt) => async dispatch => {
		const type = parameter === 'songs' || parameter === 'lyrics' ? 'track' : 'artist';
		const lyricsQuery =
			parameter === 'lyrics' ? `track:${value.track_name} artist:${value.artist_name}` : null;

		const token = await checkTokenExpiration(accessToken, expiresAt);

		try {
			const API_URL = `https://api.spotify.com/v1/search?q=${
				parameter === 'lyrics' ? encodeURIComponent(lyricsQuery) : encodeURIComponent(value)
			}&type=${type}&include_external=audio`;

			const response = await axios.get(API_URL, {
				headers: {
					Authorization: `Bearer ${token}`
				}
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

export const getSpotifyGenres = accessToken => async dispatch => {
	try {
		const API_URL = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';
		const response = await axios.get(API_URL, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});

		const result = response.data;
		dispatch(receiveSpotifySeedGenres(result.genres));
		return result.genres;
	} catch (error) {
		console.log('Error: ', error);
	}
};

export const getSpotifyMarkets = accessToken => async dispatch => {
	try {
		const API_URL = 'https://api.spotify.com/v1/markets';
		const response = await axios.get(API_URL, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});

		const result = response.data;
		dispatch(receiveSpotifyMarkets(result.markets));
	} catch (error) {
		console.log('Error: ', error);
	}
};

export const getSpotifyTracks = (userId, trackIds) => async () => {
	try {
		const csrfToken = await getCSRFToken();
		const headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'User-Id': userId
		};

		const data = {
			spotifyIds: trackIds
		};

		const response = await axios.post('/api/get-spotify-tracks/', data, {
			headers
		});

		if (response.status === 200) {
			return response.data['tracks'];
		} else {
			throw new Error('Request failed with status ' + response.status);
		}
	} catch (error) {
		console.error('Error fetching Spotify tracks:', error.message);
	}
};

export const getSpotifyArtists = (userId, artistIds) => async () => {
	try {
		const csrfToken = await getCSRFToken();
		const headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'User-Id': userId
		};

		const data = {
			artistIds: artistIds
		};

		const response = await axios.post('/api/get-spotify-artists/', data, {
			headers
		});

		if (response.status === 200) {
			return response.data['artists'];
		} else {
			throw new Error('Request failed with status ' + response.status);
		}
	} catch (error) {
		console.error('Error fetching Spotify tracks:', error.message);
	}
};

export const checkTokenExpiration = async (accessToken, refreshToken, expiresAt) => {
	// Check if the token has expired
	const currentTime = Math.floor(Date.now() / 1000);
	if (currentTime >= expiresAt) {
		try {
			const response = await fetch('/api/refresh-token/', {
				method: 'POST',
				body: JSON.stringify({ refresh_token: refreshToken }),
				headers: {
					'Content-Type': 'application/json'
					// Add any other necessary headers here
				},
				credentials: 'include'
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

export const handleUpdateDisplayNameThunk = async (
	dispatch,
	accessToken,
	refreshToken,
	newDisplayName
) => {
	dispatch(updateDisplayNameRequest());

	try {
		const csrfToken = await getCSRFToken();
		const data = { new_display_name: newDisplayName };

		const response = await axios.patch(`/api/update-display-name/`, data, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
				Authorization: `Bearer ${accessToken}`
			}
		});

		const { user } = response.data;
		if (user && user.display_name) {
			dispatch(updateDisplayNameSuccess(user.display_name));
		}

		return response.data.user.display_name;
	} catch (error) {
		let errorMessage = 'An unexpected error occurred';

		if (error.response && error.response.data && error.response.data.error) {
			errorMessage = error.response.data.error;
		} else if (error.message) {
			errorMessage = error.message;
		}

		console.error(`Error: ${errorMessage}`);
		dispatch(updateDisplayNameFailure(errorMessage));
		throw error;
	}
};

export const handleUpdateDisplayName = withAuth(handleUpdateDisplayNameThunk);

export const handleUpdateBirthdayThunk = async (dispatch, accessToken, refreshToken, date) => {
	dispatch(updateBirthdayRequest());
	try {
		const csrfToken = await getCSRFToken();
		console.log('csrf: ', csrfToken);
		const data = { date };

		const response = await axios.patch(`/api/update-birthday/`, data, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
				Authorization: `Bearer ${accessToken}`
			}
		});

		const { birthday } = response.data;
		if (birthday) {
			dispatch(updateBirthdaySuccess(birthday));
		}

		return birthday;
	} catch (error) {
		let errorMessage = 'An unexpected error occurred';

		if (error.response && error.response.data && error.response.data.error) {
			errorMessage = error.response.data.error;
		} else if (error.message) {
			errorMessage = error.message;
		}

		console.error(`Error: ${errorMessage}`);
		dispatch(updateBirthdayFailure(errorMessage));
		throw error;
	}
};

export const handleUpdateBirthday = withAuth(handleUpdateBirthdayThunk);

export const handleUpdatePreferredGenresThunk = async (
	dispatch,
	accessToken,
	refreshToken,
	genres
) => {
	dispatch(updatePreferredGenresRequest());
	try {
		const csrfToken = await getCSRFToken();
		const data = { genres };

		const response = await axios.patch(`/api/update-preferred-genres/`, data, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
				Authorization: `Bearer ${accessToken}`
			}
		});

		const { preferred_genres } = response.data;
		if (preferred_genres) {
			dispatch(updatePreferredGenresSuccess(preferred_genres));
		}

		return preferred_genres;
	} catch (error) {
		let errorMessage = 'An unexpected error occurred';

		if (error.response && error.response.data && error.response.data.error) {
			errorMessage = error.response.data.error;
		} else if (error.message) {
			errorMessage = error.message;
		}

		console.error(`Error: ${errorMessage}`);
		dispatch(updatePreferredGenresFailure(errorMessage));

		throw error;
	}
};

export const handleUpdatePreferredGenres = withAuth(handleUpdatePreferredGenresThunk);

export const handleUpdateUserTypeThunk = async (dispatch, accessToken, refreshToken, userType) => {
	dispatch(updateUserTypeRequest());
	try {
		const csrfToken = await getCSRFToken();
		const data = { userType };

		const response = await axios.patch(`/api/update-user-type/`, data, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
				Authorization: `Bearer ${accessToken}`
			}
		});

		const { user_type, profession } = response.data;
		if (user_type) {
			dispatch(updateUserTypeSuccess(user_type));
		}

		dispatch(updateUserProfessionSuccess(profession));

		return user_type;
	} catch (error) {
		let errorMessage = 'An unexpected error occurred';

		if (error.response && error.response.data && error.response.data.error) {
			errorMessage = error.response.data.error;
		} else if (error.message) {
			errorMessage = error.message;
		}

		console.error(`Error: ${errorMessage}`);
		dispatch(updateUserTypeFailure(errorMessage));
		throw error;
	}
};

export const handleUpdateUserType = withAuth(handleUpdateUserTypeThunk);

export const handleUpdateUserProfessionThunk = async (
	dispatch,
	accessToken,
	refreshToken,
	profession
) => {
	dispatch(updateUserProfessionRequest());
	try {
		const csrfToken = await getCSRFToken();
		const data = { profession };

		const response = await axios.patch(`/api/update-user-profession/`, data, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
				Authorization: `Bearer ${accessToken}`
			}
		});

		const { saved_profession } = response.data;
		if (saved_profession) {
			dispatch(updateUserProfessionSuccess(saved_profession));
		}

		return saved_profession;
	} catch (error) {
		let errorMessage = 'An unexpected error occurred';

		if (error.response && error.response.data && error.response.data.error) {
			errorMessage = error.response.data.error;
		} else if (error.message) {
			errorMessage = error.message;
		}

		console.error(`Error: ${errorMessage}`);
		dispatch(updateUserProfessionFailure(errorMessage));
		throw error;
	}
};

export const handleUpdateUserProfession = withAuth(handleUpdateUserProfessionThunk);

export const handleUpdateProfileImageThunk = async (
	dispatch,
	accessToken,
	refreshToken,
	imageFile
) => {
	dispatch(updateProfileImageRequest());
	try {
		const csrfToken = await getCSRFToken();
		const formData = new FormData();
		formData.append('imageFile', imageFile);

		const response = await axios.patch(`/api/update-profile-image/`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'X-CSRFToken': csrfToken,
				Authorization: `Bearer ${accessToken}`
			}
		});

		const { profile_image } = response.data;
		if (profile_image) {
			dispatch(updateProfileImageSuccess(profile_image));
		}

		return profile_image;
	} catch (error) {
		let errorMessage = 'An unexpected error occurred';

		if (error.response && error.response.data && error.response.data.error) {
			errorMessage = error.response.data.error;
		} else if (error.message) {
			errorMessage = error.message;
		}

		console.error(`Error: ${errorMessage}`);
		dispatch(updateProfileImageFailure(errorMessage));

		throw error;
	}
};

export const handleUpdateProfileImage = withAuth(handleUpdateProfileImageThunk);

export const getUserProfileThunk = (accessToken, refreshToken) => async dispatch => {
	dispatch(getUserProfileRequest());
	try {
		const response = await axios.get(`/api/get-user-profile/`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});

		const { profile } = response.data;
		dispatch(getUserProfileSuccess(profile));

		return profile;
	} catch (error) {
		let errorMessage = 'An unexpected error occurred';
		if (error.response && error.response.data && error.response.data.error) {
			errorMessage = error.response.data.error;
		} else if (error.message) {
			errorMessage = error.message;
		}

		console.error(`Error: ${errorMessage}`);
		dispatch(getUserProfileFailure(errorMessage));

		throw error;
	}
};

export const getUserProfile = withAuth(getUserProfileThunk);

export const handleUpdateUserProfileThunk = async (
	dispatch,
	accessToken,
	refreshToken,
	userInfo
) => {
	dispatch(updateUserProfileRequest());

	try {
		const csrfToken = await getCSRFToken();
		const data = userInfo;

		const response = await axios.patch(`/api/update-user-profile/`, data, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
				Authorization: `Bearer ${accessToken}`
			}
		});

		const { user } = response.data;
		dispatch(updateUserProfileSuccess(user));

		// Return the response so it can be handled by withAuth
		return response;
	} catch (error) {
		let errorMessage = 'An unexpected error occurred';

		if (error.response && error.response.data && error.response.data.error) {
			errorMessage = error.response.data.error;
		} else if (error.message) {
			errorMessage = error.message;
		}

		console.error(`Error: ${errorMessage}`);
		dispatch(updateUserProfileFailure(errorMessage));

		// Throw the error to be caught by withAuth
		throw error;
	}
};

export const handleUpdateUserProfile = withAuth(handleUpdateUserProfileThunk);

export const resendVerification = userId => async dispatch => {
	dispatch(resendVerificationRequest());
	try {
		const csrfToken = await getCSRFToken();
		const response = await fetch('/api/resend-verification-email/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
				'User-Id': userId
			}
		});

		if (response.ok) {
			dispatch(resendVerificationSuccess());
		} else {
			throw new Error('Failed to resend verification email');
		}
	} catch (error) {
		dispatch(resendVerificationFailure(error.message));
	}
};

export const createPlaylistRequest = (userId, playlist) => async dispatch => {
	try {
		const csrfToken = await getCSRFToken();
		const headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'User-Id': userId
		};

		const body = JSON.stringify({ playlist: playlist, action: 'collect' });

		const response = await fetch(`/api/create-playlist/`, {
			headers: headers,
			method: 'POST',
			body
		});

		if (!response.ok) {
			throw new Error('Request failed with status ' + response.status);
		}

		const res = await response.json();

		const playlistData = res['playlistData'];
		const userTokens = res['updatedTokens'];
		const userKarma = res['updatedKarma'];

		dispatch(createPlaylist(playlistData));
		dispatch(getUserTokensSuccess(userTokens));
		dispatch(getUserKarmaSuccess(userKarma));

		return playlistData;
	} catch (error) {
		console.log('Error: ' + error.message);
	}
};

export const deletePlaylistRequest = (playlistIds, userId, onSuccess) => async dispatch => {
	try {
		const csrfToken = await getCSRFToken();
		const headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'User-Id': userId
		};

		const body = { playlist_ids: playlistIds };

		const response = await axios.post('/api/delete-playlist/', body, {
			headers
		});

		if (response.status === 200) {
			// const res = response.data;

			if (onSuccess) {
				onSuccess();
			}

			dispatch(deletePlaylist(...playlistIds));
		} else {
			throw new Error('Request failed with status ' + response.status);
		}
	} catch (error) {
		console.log('Error: ' + error.message);
	}
};

export const addToSavedPlaylistRequest = (playlistId, userId, tracks) => async dispatch => {
	dispatch(addToSavedPlaylist());

	try {
		const csrfToken = await getCSRFToken();
		const headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'User-Id': userId
		};

		const body = {
			id: playlistId,
			tracks: tracks
		};

		const response = await axios.post(`/api/add-to-playlist/${playlistId}/`, body, { headers });

		const playlist = response.data['playlist'];

		dispatch(addToSavedPlaylistSuccess(playlist.id, playlist.tracks, playlist.snapshot));
		return playlist.tracks;
	} catch (error) {
		dispatch(addToSavedPlaylistFailure(error.message));
		console.error('Error: ', error.message);
	}
};

export const removeFromPlaylistRequest = (playlistId, userId, tracks) => async dispatch => {
	try {
		const csrfToken = await getCSRFToken();
		const headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'User-Id': userId
		};

		// Note: Axios delete method does not natively support body as a second parameter,
		// so we use the `data` field in the config parameter to send the body.
		const config = {
			method: 'delete',
			url: `/api/remove-from-playlist/${playlistId}/`,
			headers: headers,
			data: JSON.stringify({
				id: playlistId,
				tracks: tracks
			})
		};

		const response = await axios(config);

		const playlist = response.data['playlist'];

		dispatch(removeFromSavedPlaylist(playlist.id, playlist.tracks));
	} catch (error) {
		console.error('Error: ', error.message);
	}
};

export const updatePlaylistItemsRequest = (userId, playlistId, updatedData) => async dispatch => {
	try {
		dispatch(updatePlaylistOrderRequest());
		const csrfToken = await getCSRFToken();
		const headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'User-Id': userId
		};

		// Directly return the Axios call, which returns a promise
		return axios
			.put(`/api/update-playlist-items/${playlistId}/`, updatedData, {
				headers
			})
			.then(response => {
				// Success path
				if (response.status === 200) {
					const reorderedTracks = response.data['tracks'];
					const snapshotId = response.data['snapshotId'];
					dispatch(updatePlaylistOrderSuccess(playlistId, reorderedTracks, snapshotId));

					return Promise.resolve(reorderedTracks);
				} else {
					const error = new Error('Request failed with status ' + response.status);
					dispatch(updatePlaylistOrderFailure(error.toString()));
					return Promise.reject(error);
				}
			})
			.catch(error => {
				console.error('Error: ' + error.message);
				dispatch(updatePlaylistOrderFailure(error.toString()));
				return Promise.reject(error);
			});
	} catch (error) {
		console.error('Setup Error: ' + error.message);
		dispatch(updatePlaylistOrderFailure(error.toString()));
		return Promise.reject(error);
	}
};

export const getUserPlaylists = userId => async dispatch => {
	dispatch(getUserPlaylistsRequest());

	try {
		const csrfToken = await getCSRFToken();
		const headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'User-Id': userId
		};

		const response = await axios.get(`/api/get-user-playlists/`, {
			headers
		});

		const userPlaylists = response.data['playlists'];

		dispatch(getUserPlaylistsSuccess(userPlaylists));
	} catch (error) {
		console.error('Error fetching user playlists:', error);
		dispatch(getUserPlaylistsFailure(error.message));
	}
};

export const saveRequestParameters = (userId, query) => async dispatch => {
	try {
		const csrfToken = await getCSRFToken();

		const response = await axios.post('/api/save-request-parameters/', query, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
				'User-Id': userId
			}
		});

		const res = response.data;

		const transformedQuery = transformResponseToQueryStructure(res['recommendation_request']);

		dispatch(saveQuery(transformedQuery));
	} catch (error) {
		console.log('Error: ' + error.message);
	}
};

export const deleteRequestParameters = (userId, requestId) => async dispatch => {
	try {
		const csrfToken = await getCSRFToken();

		const response = await axios.delete('/api/delete-request-parameters/', {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
				'User-Id': userId
			},
			data: {
				id: requestId
			}
		});

		const res = response.data;

		if (res.success) {
			dispatch(deleteQuery(requestId));
		} else {
			console.log('Error: ' + res.error);
		}
	} catch (error) {
		console.log('Error: ' + error.message);
	}
};

export const getRequestParameters = userId => async dispatch => {
	dispatch(getRequestParametersRequest());

	try {
		const csrfToken = await getCSRFToken();
		const headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'User-Id': userId
		};

		const response = await axios.get(`/api/get-user-requests/`, {
			headers
		});

		const userRequestParameters = response.data['requests'];
		const transformedUserRequestParameters = userRequestParameters.map(request => {
			return transformResponseToQueryStructure(request);
		});
		dispatch(getRequestParametersSuccess(transformedUserRequestParameters));
	} catch (error) {
		console.error('Error fetching user request parameters:', error);
		dispatch(getRequestParametersFailure(error.message));
	}
};

export const getPricing = () => async () => {
	try {
		const csrfToken = await getCSRFToken();
		const headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken
		};

		const response = await axios.get(`/api/get-pricing/`, {
			headers
		});

		return response.data['pricing_packages'];
	} catch (error) {
		console.error('Error getting pricing packages: ', error);
	}
};

export const getUserTokens = userId => async dispatch => {
	dispatch(getUserTokensRequest());

	try {
		const csrfToken = await getCSRFToken();
		const headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'User-Id': userId
		};

		const response = await axios.get('/api/get-user-tokens/', {
			headers
		});

		const tokens = response.data['tokens'];
		dispatch(getUserTokensSuccess(tokens));
	} catch (error) {
		console.error('Error fetching users tokens: ', error);
		dispatch(getUserTokensFailure(error));
	}
};

export const addToSpotify = async (recommendation, userId) => {
	try {
		const csrfToken = await getCSRFToken();
		const headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'User-Id': userId
		};

		const response = await axios.post(
			'/api/add-to-spotify/',
			{ recommendation },
			{ headers: headers }
		);

		if (response.status === 200) {
			console.log('Track successfully added to Spotify library');
		} else {
			console.error('There was an error with trying to add the track to Spotify');
		}
	} catch (error) {
		console.error('Error:', error);
	}
};

export const checkUsersTracks = async (recommendations, userId) => {
	try {
		const csrfToken = await getCSRFToken();
		const headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'User-Id': userId
		};

		const response = await axios.post(
			'/api/check-users-tracks/',
			{ recommendations },
			{ headers: headers }
		);

		if (response.status === 200) {
			return response.data;
		} else {
			console.error('API request failed');
		}
	} catch (error) {
		console.error('Error:', error);
	}
};

export const removeUsersTracks = async (recommendation, userId) => {
	try {
		const csrfToken = await getCSRFToken();
		const headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'User-Id': userId
		};

		const response = await axios.post(
			'/api/remove-users-tracks/',
			{ recommendation },
			{ headers: headers }
		);

		if (response.status === 200) {
			return response.data;
		} else {
			console.error('Remove users tracks request failed');
		}
	} catch (error) {
		console.error('Error:', error);
	}
};

export const followArtistsOnSpotify = async (artistIds, userId) => {
	try {
		const csrfToken = await getCSRFToken();
		const headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'User-Id': userId
		};

		const response = await axios.put(
			'/api/follow-artists/',
			{ ids: artistIds },
			{ headers: headers }
		);

		if (response.status === 204) {
			console.log('Artists successfully followed on Spotify');
		} else {
			console.error('There was an error with trying to follow the artists on Spotify');
		}
	} catch (error) {
		console.error('Error:', error);
	}
};

export const checkIfUserFollowsArtists = async (artistIds, userId) => {
	try {
		const headers = {
			'User-Id': userId
		};

		const response = await axios.get(`/api/user-follows-artists/?ids=${artistIds.join(',')}`, {
			headers: headers
		});

		if (response.status === 200) {
			return response.data;
		} else {
			console.error('Failed to check follow status');
		}
	} catch (error) {
		console.error('Error:', error);
	}
};

export const unfollowArtists = async (artistIds, userId) => {
	try {
		const csrfToken = await getCSRFToken();
		const headers = {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'User-Id': userId
		};

		const response = await axios.delete('/api/unfollow-artists/', {
			data: { ids: artistIds },
			headers: headers
		});

		if (response.status === 204) {
			console.log('Successfully unfollowed artists');
		} else {
			console.error('Failed to unfollow artists');
		}
	} catch (error) {
		console.error('Error:', error);
	}
};
