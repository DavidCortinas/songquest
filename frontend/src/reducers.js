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
	EMAIL_VERIFICATION_FAILURE,
	EMAIL_VERIFICATION_SUCCESS,
	GET_REQUEST_PARAMETERS_FAILURE,
	GET_REQUEST_PARAMETERS_REQUEST,
	GET_REQUEST_PARAMETERS_SUCCESS,
	GET_USER_PLAYLISTS_FAILURE,
	GET_USER_PLAYLISTS_REQUEST,
	GET_USER_PLAYLISTS_SUCCESS,
	GET_USER_TOKENS_FAILURE,
	GET_USER_TOKENS_REQUEST,
	GET_USER_TOKENS_SUCCESS,
	GET_USER_KARMA_FAILURE,
	GET_USER_KARMA_REQUEST,
	GET_USER_KARMA_SUCCESS,
	RECEIVE_LYRIC_RESULTS,
	RECEIVE_SPOTIFY_MARKETS,
	RECEIVE_SPOTIFY_PERFORMER_RESULTS,
	RECEIVE_SPOTIFY_SEED_GENRES,
	RECEIVE_SPOTIFY_SONG_RESULTS,
	REFRESH_SPOTIFY_ACCESS,
	REMOVE_FROM_CURRENT_PLAYLIST_BY_ID,
	RESEND_VERIFICATION_FAILURE,
	RESEND_VERIFICATION_REQUEST,
	RESEND_VERIFICATION_SUCCESS,
	RESET_CURRENT_PLAYLIST,
	RESET_DATA_LOADED,
	RESET_QUERY_PARAMETER,
	SAVE_PREVIOUS_QUERY,
	SAVE_QUERY,
	SEARCH_SONG,
	SEARCH_SONG_FAILURE,
	SEARCH_SONG_SUCCESS,
	SET_SELECTED_PLAYLIST,
	SET_CURRENT_USER,
	SET_QUERY_PARAMETER,
	UPDATE_EMAIL,
	UPDATE_DISPLAY_NAME_SUCCESS,
	UPDATE_BIRTHDAY,
	UPDATE_PREFERRED_GENRES,
	UPDATE_USER_TYPE,
	UPDATE_USER_PROFESSION,
	UPDATE_PROFILE_IMAGE,
	SET_EDIT_PLAYLIST,
	SET_PLAYLIST_TO_EDIT,
	SET_CREATE_PLAYLIST,
	REMOVE_FROM_SAVED_PLAYLIST,
	STORE_PREVIOUS_PLAYLIST_STATE,
	UPDATE_PLAYLIST_ORDER_REQUEST,
	UPDATE_PLAYLIST_ORDER_SUCCESS,
	UPDATE_PLAYLIST_ORDER_FAILURE,
	UPDATE_DISPLAY_NAME_REQUEST,
	UPDATE_DISPLAY_NAME_FAILURE,
	UPDATE_USER_PROFILE_REQUEST,
	UPDATE_USER_PROFILE_FAILURE,
	UPDATE_USER_PROFILE_SUCCESS,
	GET_USER_PROFILE_REQUEST,
	GET_USER_PROFILE_SUCCESS,
	GET_USER_PROFILE_FAILURE,
	ADD_TO_PLAYLIST_TO_EDIT,
	REMOVE_FROM_PLAYLIST_TO_EDIT,
	ADD_TO_SAVED_PLAYLIST_SUCCESS,
	ADD_TO_SAVED_PLAYLIST_FAILURE,
	REORDER_PLAYLIST_TRACKS,
	DELETE_QUERY
} from './actions';
import { toCamelCase } from './utils';

const initialSongState = {
	query: { song: '', performer: '' },
	songData: { ascap_results: {}, bmi_results: {} },
	dataLoaded: false,
	error: null,
	user: {
		email: '',
		isRegistered: false
	}
};

const initialAuthState = {
	token: null,
	refreshToken: null,
	account: null
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
			label: 'acousticness'
		},
		danceability: {
			min: null,
			target: null,
			max: null,
			label: 'danceability'
		},
		duration_ms: {
			min: null,
			target: null,
			max: null,
			label: 'length'
		},
		energy: {
			min: null,
			target: null,
			max: null,
			label: 'energy'
		},
		instrumentalness: {
			min: null,
			target: null,
			max: null,
			label: 'instrumentalness'
		},
		key: {
			min: null,
			target: null,
			max: null,
			label: 'key'
		},
		liveness: {
			min: null,
			target: null,
			max: null,
			label: 'liveness'
		},
		loudness: {
			min: null,
			target: null,
			max: null,
			label: 'loudness'
		},
		mode: {
			min: null,
			target: null,
			max: null,
			label: 'modality'
		},
		popularity: {
			min: null,
			target: null,
			max: null,
			label: 'popularity'
		},
		speechiness: {
			min: null,
			target: null,
			max: null,
			label: 'speechiness'
		},
		tempo: {
			min: null,
			target: null,
			max: null,
			label: 'tempo'
		},
		time_signature: {
			min: null,
			target: null,
			max: null,
			label: 'time-signature'
		},
		valence: {
			min: null,
			target: null,
			max: null,
			label: 'positiveness'
		}
	},
	savedQueries: {
		initialQuery: {
			limit: 5,
			songs: [
				{
					id: '2T7DdtQaacjIxBGLCS0lGh',
					image: 'https://i.scdn.co/image/ab67616d00004851f335a793eeff3a9cccd3755b',
					label: 'Jeromeo and Juliet (Good Friday) - Deezie Brown'
				}
			],
			performers: [
				{
					id: '062tCT8GVioC9EMiI9jeOV',
					image: 'https://i.scdn.co/image/ab6761610000f17823687e58992f1da5c1cba960',
					label: 'BLK ODYSSY'
				},
				{
					id: '0Akzjllih1lP7k60c8Dtct',
					image: 'https://i.scdn.co/image/ab6761610000f1787738d684e958af2eb04ef52b',
					label: 'Magna Carda'
				}
			],
			genres: ['soul', 'r-n-b'],
			market: '',
			acousticness: {
				min: null,
				target: null,
				max: null,
				label: 'acousticness'
			},
			danceability: {
				min: null,
				target: null,
				max: null,
				label: 'danceability'
			},
			duration_ms: {
				min: null,
				target: null,
				max: null,
				label: 'length'
			},
			energy: {
				min: null,
				target: null,
				max: null,
				label: 'energy'
			},
			instrumentalness: {
				min: null,
				target: null,
				max: null,
				label: 'instrumentalness'
			},
			key: {
				min: null,
				target: null,
				max: null,
				label: 'key'
			},
			liveness: {
				min: null,
				target: null,
				max: null,
				label: 'liveness'
			},
			loudness: {
				min: null,
				target: null,
				max: null,
				label: 'loudness'
			},
			mode: {
				min: null,
				target: null,
				max: null,
				label: 'modality'
			},
			popularity: {
				min: null,
				target: null,
				max: null,
				label: 'popularity'
			},
			speechiness: {
				min: null,
				target: null,
				max: null,
				label: 'speechiness'
			},
			tempo: {
				min: null,
				target: null,
				max: null,
				label: 'tempo'
			},
			time_signature: {
				min: null,
				target: null,
				max: null,
				label: 'time-signature'
			},
			valence: {
				min: null,
				target: null,
				max: null,
				label: 'positiveness'
			}
		},
		previous: null,
		saved: []
	},
	tracks: {
		href: '',
		items: [],
		limit: 0,
		next: '',
		offset: 0,
		previous: null,
		total: 0
	},
	artists: {
		href: '',
		items: [],
		limit: 0,
		next: '',
		offset: 0,
		previous: null,
		total: 0
	},
	genres: [],
	markets: [],
	recommendations: null,
	loading: false,
	error: null
};

export const song = (state = initialSongState, action) => {
	const { type, payload } = action;

	switch (type) {
		case SEARCH_SONG: {
			return {
				...state,
				query: payload.query,
				dataLoaded: false
			};
		}
		case SEARCH_SONG_SUCCESS: {
			return {
				...state,
				songData: payload.songData,
				query: payload.query,
				dataLoaded: true
			};
		}
		case SEARCH_SONG_FAILURE: {
			return {
				...state,
				error: payload
			};
		}
		case CLEAR_SEARCH_SONG_ERROR:
			return {
				...state,
				error: null
			};
		case RESET_DATA_LOADED:
			return {
				...state,
				dataLoaded: false
			};
		default:
			return {
				...state,
				dataLoaded: false
			};
	}
};

export const user = (state = { currentUser: null }, action) => {
	const { type, payload = {} } = action;
	const userWithCamelCase = payload && toCamelCase(payload.user?.user);
	switch (type) {
		case CONFIRM_USER:
			return {
				...state,
				currentUser: {
					user: payload.user
				},
				isRegistered: payload.isRegistered
			};
		case SET_CURRENT_USER:
			return {
				...state,
				currentUser: {
					...payload.user,
					user: userWithCamelCase
				}
			};
		case REFRESH_SPOTIFY_ACCESS:
			return {
				...state,
				currentUser: {
					...state.currentUser,
					spotifyAccess: payload.newAccessToken,
					spotifyExpiresAt: payload.expiresAt
				}
			};
		case CONFIRM_SPOTIFY_ACCESS:
			return {
				...state,
				currentUser: {
					...state.currentUser,
					user: {
						...state.currentUser.user,
						spotifyConnected: payload.spotifyConnected
					}
				}
			};
		case UPDATE_USER_PROFILE_REQUEST:
			return {
				...state,
				loading: true,
				error: null
			};
		case UPDATE_USER_PROFILE_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				currentUser: {
					...state.currentUser,
					user: {
						...state.currentUser.user,
						...payload.user // Merge the updated user object into the current user state
					}
				}
			};
		case UPDATE_USER_PROFILE_FAILURE:
			return {
				...state,
				loading: false,
				error: payload.error
			};
		case UPDATE_DISPLAY_NAME_REQUEST:
			return {
				...state,
				loading: true,
				error: null
			};
		case UPDATE_DISPLAY_NAME_SUCCESS:
			return {
				...state,
				currentUser: {
					...state.currentUser,
					user: {
						...state.currentUser.user,
						displayName: payload.newDisplayName
					}
				},
				loading: false,
				error: null
			};
		case UPDATE_DISPLAY_NAME_FAILURE:
			return {
				...state,
				loading: false,
				error: payload.error
			};
		case UPDATE_BIRTHDAY:
			return {
				...state,
				currentUser: {
					...state.currentUser,
					user: {
						...state.currentUser.user,
						birthday: payload.birthday
					}
				}
			};
		case UPDATE_PREFERRED_GENRES:
			return {
				...state,
				currentUser: {
					...state.currentUser,
					user: {
						...state.currentUser.user,
						preferredGenres: payload.genres
					}
				}
			};
		case UPDATE_USER_TYPE:
			return {
				...state,
				currentUser: {
					...state.currentUser,
					user: {
						...state.currentUser.user,
						userType: payload.user_type
					}
				}
			};
		case UPDATE_USER_PROFESSION:
			return {
				...state,
				currentUser: {
					...state.currentUser,
					user: {
						...state.currentUser.user,
						profession: payload.profession
					}
				}
			};
		case UPDATE_PROFILE_IMAGE:
			return {
				...state,
				currentUser: {
					...state.currentUser,
					user: {
						...state.currentUser.user,
						profileImage: payload.imageUrl
					}
				}
			};
		case UPDATE_EMAIL:
			return {
				...state,
				currentUser: {
					...state.currentUser,
					user: {
						...state.currentUser.user,
						email: payload.newEmail
					}
				}
			};
		case RESEND_VERIFICATION_REQUEST:
			return {
				...state,
				loading: true,
				error: null
			};
		case RESEND_VERIFICATION_FAILURE:
			return {
				...state,
				loading: false,
				error: payload.error
			};
		case RESEND_VERIFICATION_SUCCESS:
			return {
				...state,
				loading: false,
				error: null
			};
		case EMAIL_VERIFICATION_FAILURE:
			return {
				...state,
				error: payload.error
			};
		case EMAIL_VERIFICATION_SUCCESS:
			return {
				...state,
				currentUser: {
					...state.currentUser,
					user: {
						...state.currentUser?.user,
						emailVerified: payload.emailVerified
					}
				}
			};
		case GET_USER_TOKENS_REQUEST:
			return {
				...state,
				loading: true,
				error: null
			};
		case GET_USER_TOKENS_SUCCESS:
			return {
				...state,
				currentUser: {
					...state.currentUser,
					user: {
						...state.currentUser.user,
						tokens: payload.userTokens
					}
				}
			};
		case GET_USER_TOKENS_FAILURE:
			return {
				...state,
				error: payload.error
			};
		case GET_USER_KARMA_REQUEST:
			return {
				...state,
				loading: true,
				error: null
			};
		case GET_USER_KARMA_SUCCESS:
			return {
				...state,
				currentUser: {
					...state.currentUser,
					user: {
						...state.currentUser.user,
						karma: payload.userKarma
					}
				}
			};
		case GET_USER_KARMA_FAILURE:
			return {
				...state,
				error: payload.error
			};
		default:
			return state;
	}
};

const initialUserProfileState = {
	currentUserProfile: null,
	loading: false,
	error: null
};
export const userProfile = (state = initialUserProfileState, action) => {
	switch (action.type) {
		case GET_USER_PROFILE_REQUEST:
			return {
				...state,
				loading: true,
				error: null
			};
		case GET_USER_PROFILE_SUCCESS:
			return {
				...state,
				loading: false,
				currentUserProfile: {
					email: action.payload.profile.email,
					achievements: action.payload.profile.achievements
				},
				error: null
			};
		case GET_USER_PROFILE_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload.error
			};
		// ... other cases for other actions ...
		default:
			return state;
	}
};

const initialVerificationState = {
	loading: false,
	error: null
};

export const verification = (state = initialVerificationState, action) => {
	switch (action.type) {
		case RESEND_VERIFICATION_REQUEST:
			return {
				...state,
				loading: true,
				error: null
			};
		case RESEND_VERIFICATION_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload.error
			};
		case RESEND_VERIFICATION_SUCCESS:
			return {
				...state,
				loading: false,
				error: null
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
				token: action.payload.token
			};
		},
		setAccount(state, action) {
			return {
				...state,
				account: action.payload
			};
		},
		setError: (state, action) => {
			state.error = action.payload;
		},
		clearError: state => {
			state.error = null;
		},
		setSuccessMessage(state, action) {
			state.successMessage = action.payload;
		},
		clearSuccessMessage(state) {
			state.successMessage = null;
		},
		logout() {
			return initialAuthState;
		}
	}
});

export const playlist = (
	state = {
		playlists: [],
		currentPlaylist: {
			action: 'create',
			createPlaylist: {
				id: null,
				name: null,
				tracks: []
			},
			editPlaylist: {
				id: null,
				name: null,
				tracks: []
			},
			selectedPlaylist: {
				id: null,
				name: null,
				tracks: []
			}
		}
	},
	action
) => {
	const { type, payload = {} } = action;

	const editPlaylistIndex = state.playlists.findIndex(
		playlist => playlist.id === state.currentPlaylist.editPlaylist.id
	);
	const editPlaylistIndexRemove = state.playlists.findIndex(
		playlist => playlist.id === state.currentPlaylist.editPlaylist.id
	);

	// Set a playlist as the editPlaylist within currentPlaylist
	const playlistToEdit =
		state.playlists.find(playlist => playlist.id === payload.playlistId) || {};
	// Set a playlist as the selectedPlaylist within currentPlaylist
	const selected = state.playlists.find(playlist => playlist.id === payload.playlistId) || {};

	const { playlistId, newOrderTracks = [] } = payload;
	const playlistIndex = state.playlists.findIndex(p => p.id === playlistId);

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
				playlists: payload.playlists
			};
		case GET_USER_PLAYLISTS_FAILURE:
			return {
				...state,
				loading: false,
				error: payload.error
			};
		case ADD_TO_CURRENT_PLAYLIST:
			return {
				...state,
				currentPlaylist: {
					...state.currentPlaylist,
					createPlaylist: {
						...state.currentPlaylist.createPlaylist,
						tracks: [...state.currentPlaylist.createPlaylist.tracks, ...payload.tracks]
					}
				}
			};
		case ADD_TO_PLAYLIST_TO_EDIT:
			if (editPlaylistIndex !== -1) {
				// Clone the playlist to be edited
				const updatedPlaylist = {
					...state.playlists[editPlaylistIndex],
					// Update the tracks by concatenating the existing tracks with the new tracks
					tracks: [...state.playlists[editPlaylistIndex].tracks, ...payload.tracks]
				};
				// Clone the playlists array and replace the edited playlist
				const updatedPlaylists = [
					...state.playlists.slice(0, editPlaylistIndex),
					updatedPlaylist,
					...state.playlists.slice(editPlaylistIndex + 1)
				];
				// Return the updated state with the modified playlists array
				return {
					...state,
					playlists: updatedPlaylists
				};
			}
			return state;
		case REORDER_PLAYLIST_TRACKS:
			if (playlistIndex !== -1) {
				const updatedPlaylist = {
					...state.playlists[playlistIndex],
					tracks: newOrderTracks
				};
				return {
					...state,
					playlists: [
						...state.playlists.slice(0, playlistIndex),
						updatedPlaylist,
						...state.playlists.slice(playlistIndex + 1)
					]
				};
			}
			return state;
		case REMOVE_FROM_PLAYLIST_TO_EDIT:
			if (editPlaylistIndexRemove !== -1) {
				// Clone the playlist to be edited
				const updatedPlaylist = {
					...state.playlists[editPlaylistIndexRemove],
					// Filter out the tracks to be removed
					tracks: state.playlists[editPlaylistIndexRemove].tracks.filter(
						track =>
							!payload.tracks.some(
								removeTrack => removeTrack.spotifyId === track.spotifyId
							)
					)
				};
				// Clone the playlists array and replace the edited playlist
				const updatedPlaylists = [
					...state.playlists.slice(0, editPlaylistIndexRemove),
					updatedPlaylist,
					...state.playlists.slice(editPlaylistIndexRemove + 1)
				];
				// Return the updated state with the modified playlists array
				return {
					...state,
					playlists: updatedPlaylists
				};
			}
			return state;
		case SET_CREATE_PLAYLIST:
			return {
				...state,
				currentPlaylist: {
					...state.currentPlaylist,
					action: 'create'
				}
			};
		case SET_EDIT_PLAYLIST:
			return {
				...state,
				currentPlaylist: {
					...state.currentPlaylist,
					action: 'edit'
				}
			};
		case SET_PLAYLIST_TO_EDIT:
			return {
				...state,
				currentPlaylist: {
					...state.currentPlaylist,
					editPlaylist: {
						id: playlistToEdit.id || null,
						name: playlistToEdit.name || null,
						tracks: playlistToEdit.tracks || [],
						snapshotId: playlistToEdit.snapshotId
					}
				}
			};
		case SET_SELECTED_PLAYLIST:
			return {
				...state,
				currentPlaylist: {
					...state.currentPlaylist,
					selectedPlaylist: {
						id: selected.id || null,
						name: selected.name || null,
						tracks: selected.tracks || []
					}
				}
			};
		case REMOVE_FROM_CURRENT_PLAYLIST_BY_ID:
			// Remove songs from the createPlaylist's tracks within currentPlaylist
			return {
				...state,
				currentPlaylist: {
					...state.currentPlaylist,
					createPlaylist: {
						...state.currentPlaylist.createPlaylist,
						tracks: state.currentPlaylist.createPlaylist.tracks.filter(
							song => !payload.trackIds.includes(song.spotifyId)
						)
					}
				}
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
				playlists: state.playlists.filter(
					playlist => !payload.playlists.includes(playlist.id)
				)
			};
		case ADD_TO_SAVED_PLAYLIST:
			return {
				...state,
				loading: true,
				error: null
			};
		case ADD_TO_SAVED_PLAYLIST_SUCCESS:
			return {
				...state,
				playlists: state.playlists.map(playlist => {
					if (playlist.id === payload.playlistId) {
						return {
							...playlist,
							tracks: [...playlist.tracks, ...payload.tracks]
						};
					}
					return playlist;
				})
			};
		case ADD_TO_SAVED_PLAYLIST_FAILURE:
			return {
				...state,
				loading: false,
				error: payload.error
			};
		case STORE_PREVIOUS_PLAYLIST_STATE:
			return {
				...state,
				previousPlaylists: {
					...state.previousPlaylists,
					[payload.playlistId]: payload.prevState
				}
			};
		case UPDATE_PLAYLIST_ORDER_REQUEST:
			return {
				...state,
				loading: true
			};
		case UPDATE_PLAYLIST_ORDER_SUCCESS:
			return {
				...state,
				loading: false,
				playlists: state.playlists.map(playlist => {
					if (playlist.id === payload.playlistId) {
						return {
							...playlist,
							tracks: payload.orderedTracks,
							snapshotId: payload.snapshotId
						};
					}
					return playlist;
				})
			};
		case UPDATE_PLAYLIST_ORDER_FAILURE:
			return {
				...state,
				loading: false,
				error: payload.error
			};
		case REMOVE_FROM_SAVED_PLAYLIST:
			return {
				...state,
				playlists: state.playlists.map(playlist => {
					if (playlist.id === payload.playlistId) {
						// Filter out the tracks that are in payload.tracks from the playlist's songs
						const updatedSongs = playlist.tracks.filter(song =>
							payload.tracks.map(track => track.spotifyId).includes(song.spotifyId)
						);
						return {
							...playlist,
							tracks: updatedSongs
						};
					}
					return playlist;
				})
			};
		case RESET_CURRENT_PLAYLIST:
			// Reset both createPlaylist and selectedPlaylist within currentPlaylist
			return {
				...state,
				currentPlaylist: {
					...state.currentPlaylist,
					action: 'create',
					createPlaylist: {
						id: null,
						name: null,
						tracks: []
					}
				}
			};
		default:
			return state;
	}
};

export const discovery = (state = initialDiscoveryState, action) => {
	const { type, payload = {} } = action;
	const { parameter, newValues } = payload;
	switch (type) {
		case DISCOVER_SONG:
			return {
				...state,
				query: payload.query,
				recommendations: null,
				dataLoaded: false
			};
		case DISCOVER_SONG_SUCCESS:
			return {
				...state,
				recommendations: payload.recommendations,
				dataLoaded: true
			};
		case RESET_QUERY_PARAMETER:
			return {
				...state,
				query: initialDiscoveryState.query
			};
		case RESET_DATA_LOADED:
			return {
				...state,
				dataLoaded: false
			};
		case SET_QUERY_PARAMETER:
			return {
				...state,
				query: {
					...state.query,
					[parameter]: {
						...state.query[parameter],
						min: newValues[0],
						max: newValues[1],
						target: newValues[2]
					}
				}
			};
		case GET_REQUEST_PARAMETERS_REQUEST:
			return {
				...state,
				loading: true,
				error: null
			};
		case GET_REQUEST_PARAMETERS_SUCCESS:
			return {
				...state,
				loading: false,
				savedQueries: {
					...state.savedQueries,
					saved: payload.userRequestParameters
				}
			};
		case GET_REQUEST_PARAMETERS_FAILURE:
			return {
				...state,
				loading: false,
				error: payload.error
			};
		case CLEAR_SEEDS_ARRAY:
			return {
				...state,
				recommendations: {
					...state.recommendations,
					seeds: []
				}
			};
		case CLEAR_RECOMMENDATIONS:
			return {
				...state,
				recommendations: {}
			};
		case RECEIVE_LYRIC_RESULTS:
			return {
				...state,
				lyricResults: payload.tracks
			};
		case RECEIVE_SPOTIFY_SONG_RESULTS:
			return {
				...state,
				tracks: payload.tracks
			};
		case RECEIVE_SPOTIFY_PERFORMER_RESULTS:
			return {
				...state,
				artists: payload.artists
			};
		case RECEIVE_SPOTIFY_SEED_GENRES:
			return {
				...state,
				genres: payload.genres
			};
		case RECEIVE_SPOTIFY_MARKETS:
			return {
				...state,
				markets: payload.markets
			};
		case SAVE_PREVIOUS_QUERY:
			return {
				...state,
				savedQueries: {
					...state.savedQueries,
					previous: payload.previousQuery
				}
			};
		case SAVE_QUERY:
			return {
				...state,
				savedQueries: {
					...state.savedQueries,
					saved: [...state.savedQueries.saved, payload.query]
				}
			};
		case DELETE_QUERY:
			return {
				...state,
				savedQueries: {
					...state.savedQueries,
					saved: state.savedQueries.saved.filter(query => query.id !== payload.queryId)
				}
			};
		default:
			return state;
	}
};
