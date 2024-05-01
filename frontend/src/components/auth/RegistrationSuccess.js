import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Snackbar, Typography, useMediaQuery } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import useStyles from '../../classes/playlist';
import { connect } from 'react-redux';
import { resendVerification } from '../../thunks';
import theme from '../../theme';

const RegistrationSuccess = ({
	currentUser,
	onResendVerification,
	verificationError,
	verificationLoading
}) => {
	const classes = useStyles();
	const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [emailSent, setEmailSent] = useState(false);

	useEffect(() => {
		if (!verificationLoading && verificationError) {
			// Triggered when verification fails
			setSnackbarMessage('Failed to resend verification email');
			setSnackbarOpen(true);
		} else if (!verificationLoading && !verificationError && emailSent) {
			// Triggered when verification succeeds
			setSnackbarMessage('Verification email resent successfully');
			setSnackbarOpen(true);
		}
	}, [verificationLoading, verificationError]);

	const handleResendVerification = () => {
		onResendVerification(currentUser?.user?.id);
		setSnackbarMessage('The verification email is being resent to your email...');
		setSnackbarOpen(true);
		setEmailSent(true);
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setSnackbarOpen(false);
	};

	return (
		<Box display='flex' flexDirection='column' alignItems='center' sx={{ height: '100vh' }}>
			<Typography
				variant='h5'
				gutterBottom
				sx={{
					color: 'white',
					textAlign: 'center',
					letterSpacing: '2px'
				}}
			>
				{`Welcome to SongQuest`}
			</Typography>
			{!currentUser?.user?.emailVerified ? (
				<>
					<Typography
						variant={isXsScreen || isSmScreen ? 'body2' : 'body1'}
						sx={{
							color: 'whitesmoke',
							textAlign: 'left',
							width: isXsScreen || isSmScreen ? '90%' : '60%',
							letterSpacing: '1px'
						}}
					>
						{`You are steps away from unearthing new gems for your musical 
              collection. Check your email to confirm your registration!`}
					</Typography>
					<Typography
						variant={isXsScreen || isSmScreen ? 'body2' : 'body1'}
						padding={isXsScreen || isSmScreen ? '3% 0' : '1% 0'}
						sx={{
							color: 'white',
							textAlign: 'left',
							width: isXsScreen || isSmScreen ? '90%' : '60%',
							letterSpacing: '1px'
						}}
					>
						{`If the confirmation link does not appear in your inbox within a 
              a few seconds, please resend the link with the button below.`}
					</Typography>
				</>
			) : (
				<Typography
					variant={isXsScreen || isSmScreen ? 'body2' : 'body1'}
					sx={{
						color: 'whitesmoke',
						textAlign: 'left',
						width: isXsScreen || isSmScreen ? '90%' : '60%',
						letterSpacing: '1px'
					}}
				>
					{`Your email is confirmed! Now watch the short demo to see how 
          SongQuest can help you dig deeper into your musical universe 
          than ever before!`}
				</Typography>
			)}
			<Button
				onClick={handleResendVerification}
				className={classes.button}
				sx={{ marginTop: '2%' }}
			>
				{'Resend Link'}
				<SendIcon sx={{ width: '16px', paddingLeft: '5px' }} />
			</Button>
			<Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleClose}>
				<Alert
					onClose={handleClose}
					severity={
						!verificationLoading && verificationError
							? 'error'
							: !verificationLoading && !verificationError && emailSent
							? 'success'
							: 'info'
					}
					variant='filled'
					sx={{ width: '100%' }}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</Box>
	);
};

const mapStateToProps = state => ({
	currentUser: state.user.currentUser,
	verificationLoading: state.verification.loading,
	verificationError: state.verificaition?.error
});

const mapDispatchToProps = dispatch => ({
	onResendVerification: userId => dispatch(resendVerification(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationSuccess);
