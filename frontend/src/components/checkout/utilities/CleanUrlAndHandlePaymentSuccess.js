import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUserTokens } from '../../../thunks';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const CleanUrlAndHandlePaymentSuccess = ({ onGetUserTokens, userId, children }) => {
	const location = useLocation();
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState('success');

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const redirectStatus = params.get('redirect_status');

		if (redirectStatus) {
			if (redirectStatus === 'succeeded') {
				setSnackbarMessage('Payment succeeded!');
				setSnackbarSeverity('success');
				if (userId) {
					onGetUserTokens(userId);
				}
			} else if (redirectStatus === 'failed') {
				setSnackbarMessage('Payment failed. Please try again.');
				setSnackbarSeverity('error');
			}
			setSnackbarOpen(true);
		}

		params.delete('payment_intent');
		params.delete('payment_intent_client_secret');
		params.delete('redirect_status');
		window.history.replaceState(null, '', '?' + params.toString());
	}, [location.search, onGetUserTokens, userId]);

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	return (
		<>
			{children}
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={handleSnackbarClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert
					onClose={handleSnackbarClose}
					severity={snackbarSeverity}
					sx={{ width: '100%' }}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</>
	);
};

const mapStateToProps = state => ({
	userId: state.user.currentUser?.user?.id
});

const mapDispatchToProps = dispatch => ({
	onGetUserTokens: userId => dispatch(getUserTokens(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CleanUrlAndHandlePaymentSuccess);
