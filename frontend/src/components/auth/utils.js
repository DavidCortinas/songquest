import { authSlice } from '../../reducers';
import { refreshAccessToken } from '../../thunks';

export const withAuth = thunk => {
	console.log('withAuth');
	return (accessToken, refreshToken, ...args) =>
		async dispatch => {
			console.log('return dispatch');
			console.log(accessToken);
			console.log(refreshToken);
			const executeThunk = async currentAccessToken => {
				return await thunk(dispatch, currentAccessToken, refreshToken, ...args);
			};

			try {
				// Try to execute the thunk with the current access token
				const response = await executeThunk(accessToken);
				console.log('try: ', response);
				return response;
			} catch (error) {
				console.log('error: ', error);
				// Check if the error is due to an invalid or expired token
				if (error.response && error.response.status === 401) {
					const errorMessage = error.response.data.detail;

					console.log('401 Unauthorized - attempting token refresh');
					if (errorMessage === 'Given token not valid for any token type') {
						try {
							// Attempt to refresh the access token
							const newAccessToken = await dispatch(refreshAccessToken(refreshToken));
							if (!newAccessToken) throw new Error('Token refresh failed');

							console.log('New access token:', newAccessToken);

							// Retry the original request with the new access token
							const retryResponse = await executeThunk(newAccessToken);
							return retryResponse;
						} catch (refreshError) {
							console.log('Failed to refresh token:', refreshError);
							dispatch(authSlice.actions.logout());
							throw new Error('Session expired. Please log in again.');
						}
					}
				}

				// Handle other errors that are not 401
				console.log('Error during API call:', error);
				dispatch(authSlice.actions.setError(error.message));
				throw error; // Re-throw the error so it can be handled by the caller
			}
		};
};
