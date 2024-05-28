import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
	updateBirthday,
	updatePreferredGenres,
	updateUserType,
	updateUserProfession,
	updateProfileImage,
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
	deleteQuery
} from './actions';
import getCSRFToken from './csrf';
import { authSlice } from './reducers';
import { transformResponseToQueryStructure } from './utils';

export const searchSongRequest = query => async dispatch => {
	try {
		const csrfToken = await getCSRFToken(); // Retrieve the CSRF token
		const body = JSON.stringify({
			song: query.song,
			performer: query.performer
		});
		const response = await fetch('/search/', {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken // Include the CSRF token in the request headers
			},
			method: 'post',
			// credentials: 'include',
			body
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
			searchSongSuccess({ ascap_results: {}, bmi_results: {} }, { song: '', performer: '' })
		);
	}
};

export const checkRegistration = user => async dispatch => {
	try {
		const csrfToken = await getCSRFToken();
		const response = await fetch('http://localhost:8000/user/', {
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
		const csrfToken = await getCSRFToken();
		const body = JSON.stringify({
			email: email,
			password: password
		});
		const response = await fetch(`http://localhost:8000/api/auth/register/`, {
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
		const csrfToken = await getCSRFToken();
		const body = JSON.stringify({
			email: email,
			password: password
		});
		const response = await fetch(`http://localhost:8000/api/auth/login/`, {
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

		dispatch(
			authSlice.actions.setAuthTokens({
				token: res.access,
				refreshToken: res.refresh
			})
		);

		dispatch(authSlice.actions.setAccount(res.user));

		return res;
	} catch (error) {
		console.log('Error: ' + error.message);
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

		const response = await fetch('http://localhost:8000/api/discover/', {
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
				const response = await fetch('http://localhost:8000/api/get-access-token/');
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
		const response = await fetch('http://localhost:8000/request-authorization/', {
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

		const response = await axios.post('http://localhost:8000/get-spotify-tracks/', data, {
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

		const response = await axios.post('http://localhost:8000/get-spotify-artists/', data, {
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
			const response = await fetch('http://localhost:8000/refresh-token/', {
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

export const handleUpdateDisplayName = (userId, newDisplayName) => async dispatch => {
	dispatch(updateDisplayNameRequest());

	try {
		const csrfToken = await getCSRFToken();
		const data = { new_display_name: newDisplayName };

		const response = await axios.patch(`http://localhost:8000/update-display-name/`, data, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
				'User-Id': userId
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
	}
};

export const handleUpdateBirthday = (userId, date) => async dispatch => {
	try {
		const csrfToken = await getCSRFToken();
		const data = { date };

		const response = await axios.patch(`http://localhost:8000/update-birthday/`, data, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
				'User-Id': userId
			}
		});

		const { birthday } = response.data;
		if (birthday) {
			dispatch(updateBirthday(birthday));
		}

		return birthday;
	} catch (error) {
		console.error(`Error: ${error.response ? error.response.data : error.message}`);
		// Handle error accordingly. You can dispatch a failure action here if you have one.
	}
};

export const handleUpdatePreferredGenres = (userId, genres) => async dispatch => {
	try {
		const csrfToken = await getCSRFToken();
		const data = { genres };

		const response = await axios.patch(`http://localhost:8000/update-preferred-genres/`, data, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
				'User-Id': userId
			}
		});

		const { preferred_genres } = response.data;
		if (preferred_genres) {
			dispatch(updatePreferredGenres(preferred_genres));
		}

		return preferred_genres;
	} catch (error) {
		console.error(`Error: ${error.response ? error.response.data : error.message}`);
		// Handle error accordingly. You can dispatch a failure action here if you have one.
	}
};

export const handleUpdateUserType = (userId, userType) => async dispatch => {
	try {
		const csrfToken = await getCSRFToken();
		const data = { userType };

		const response = await axios.patch(`http://localhost:8000/update-user-type/`, data, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
				'User-Id': userId
			}
		});

		const { user_type, profession } = response.data;
		if (user_type) {
			dispatch(updateUserType(user_type));
		}

		dispatch(updateUserProfession(profession));

		return user_type;
	} catch (error) {
		console.error(`Error: ${error.response ? error.response.data : error.message}`);
		// Handle error accordingly. You can dispatch a failure action here if you have one.
	}
};

export const handleUpdateUserProfession = (userId, profession) => async dispatch => {
	try {
		const csrfToken = await getCSRFToken();
		const data = { profession };

		const response = await axios.patch(`http://localhost:8000/update-user-profession/`, data, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
				'User-Id': userId
			}
		});

		const { saved_profession } = response.data;
		if (saved_profession) {
			dispatch(updateUserProfession(saved_profession));
		}

		return saved_profession;
	} catch (error) {
		console.error(`Error: ${error.response ? error.response.data : error.message}`);
		// Handle error accordingly. You can dispatch a failure action here if you have one.
	}
};

export const handleUpdateProfileImage = (userId, imageFile) => async dispatch => {
	try {
		const csrfToken = await getCSRFToken();
		const formData = new FormData();
		formData.append('imageFile', imageFile);

		const response = await axios.post(`http://localhost:8000/update-profile-image/`, formData, {
			headers: {
				'X-CSRFToken': csrfToken,
				'User-Id': userId
			}
		});

		const { profile_image } = response.data;
		if (profile_image) {
			dispatch(updateProfileImage(profile_image));
		}

		return profile_image;
	} catch (error) {
		console.error(`Error: ${error.response ? error.response.data : error.message}`);
		// Handle error accordingly. You can dispatch a failure action here if you have one.
	}
};

export const getUserProfile = userId => async dispatch => {
	dispatch(getUserProfileRequest());
	try {
		const response = await axios.get(`http://localhost:8000/get-user-profile/`, {
			headers: {
				'User-Id': userId
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
	}
};

export const handleUpdateUserProfile = (userId, userInfo) => async dispatch => {
	dispatch(updateUserProfileRequest());
	try {
		const csrfToken = await getCSRFToken();
		const data = userInfo;

		const response = await axios.patch(`http://localhost:8000/update-user-profile/`, data, {
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
				'User-Id': userId
			}
		});

		const { user } = response.data;
		dispatch(updateUserProfileSuccess(user));
	} catch (error) {
		let errorMessage = 'An unexpected error occurred';

		if (error.response && error.response.data && error.response.data.error) {
			errorMessage = error.response.data.error;
		} else if (error.message) {
			errorMessage = error.message;
		}

		console.error(`Error: ${errorMessage}`);
		dispatch(updateUserProfileFailure(errorMessage));
	}
};

export const resendVerification = userId => async dispatch => {
	dispatch(resendVerificationRequest());
	try {
		const csrfToken = await getCSRFToken();
		const response = await fetch('http://localhost:8000/resend-verification-email/', {
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

		const response = await fetch(`http://localhost:8000/create-playlist/`, {
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

		const response = await axios.post('http://localhost:8000/delete-playlist/', body, {
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

		const response = await axios.post(
			`http://localhost:8000/add-to-playlist/${playlistId}/`,
			body,
			{ headers }
		);

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
			url: `http://localhost:8000/remove-from-playlist/${playlistId}/`,
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
			.put(`http://localhost:8000/update-playlist-items/${playlistId}/`, updatedData, {
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

		const response = await axios.get(`http://localhost:8000/get-user-playlists/`, {
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

		const response = await axios.post('http://localhost:8000/save-request-parameters/', query, {
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

		const response = await axios.delete('http://localhost:8000/delete-request-parameters/', {
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

		const response = await axios.get(`http://localhost:8000/get-user-requests/`, {
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

		const response = await axios.get(`http://localhost:8000/get-pricing/`, {
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

		const response = await axios.get('http://localhost:8000/get-user-tokens/', {
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
			'http://localhost:8000/add-to-spotify/',
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
			'http://localhost:8000/check-users-tracks/',
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
			'http://localhost:8000/remove-users-tracks/',
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
			'http://localhost:8000/follow-artists/',
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

		const response = await axios.get(
			`http://localhost:8000/user-follows-artists/?ids=${artistIds.join(',')}`,
			{ headers: headers }
		);

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

		const response = await axios.delete('http://localhost:8000/unfollow-artists/', {
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
