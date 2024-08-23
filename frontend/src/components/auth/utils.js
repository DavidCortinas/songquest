import { authSlice } from '../../reducers';
import { refreshAccessToken } from '../../thunks';

export const withAuth = thunk => {
	return (accessToken, refreshToken, ...args) =>
		async (dispatch, getState) => {
			const executeThunk = async currentAccessToken => {
				// This should log when the thunk is about to be executed
				console.log('Executing thunk with token:', currentAccessToken);
				return await thunk(currentAccessToken, refreshToken, ...args)(dispatch, getState);
			};

			try {
				const response = await executeThunk(accessToken);
				return response;
			} catch (error) {
				console.log('caught error');
				console.log(error.response);
				console.log(error.response.status);
				if (error.response && error.response.status === 401) {
					const errorMessage = error.response.data.detail;

					if (errorMessage === 'Given token not valid for any token type') {
						try {
							const newAccessToken = await dispatch(refreshAccessToken(refreshToken));
							if (!newAccessToken) throw new Error('Token refresh failed');

							const retryResponse = await executeThunk(newAccessToken);
							return retryResponse;
						} catch (refreshError) {
							dispatch(authSlice.actions.logout());
							throw new Error('Session expired. Please log in again.');
						}
					}
				}

				dispatch(authSlice.actions.setError(error.message));
				throw error;
			}
		};
};
