import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Alert,
	Box,
	Button,
	CardHeader,
	Grid,
	IconButton,
	InputAdornment,
	Snackbar,
	TextField,
	Tooltip,
	Typography,
	useMediaQuery
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { connect } from 'react-redux';
import { useStyles } from './classes';
import { resetPasswordConfirm } from '../../thunks';
import { authSlice } from '../../reducers';
import theme from '../../theme';
import { PasswordRules } from './Login';
import { useForm } from 'react-hook-form';

const ResetPassword = ({
	authError,
	authSuccess,
	onResetPasswordConfirm,
	clearError,
	clearSuccessMessage
}) => {
	const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));

	const classes = useStyles();

	useEffect(() => {
		// Clear messages and reset snackbar state on component mount
		clearError();
		clearSuccessMessage();
		setSnackbarOpen(false);
		setSnackbarMessage('');
		setSnackbarSeverity('info');
	}, []);

	const {
		register,
		formState: { errors }
	} = useForm();

	const navigate = useNavigate();

	const { uid, token } = useParams();

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [invalidPassword, setInvalidPassword] = useState(false);
	const [invalidConfirmPassword, setInvalidConfirmPassword] = useState(false);

	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState('info');

	const handleClickShowPassword = () => setShowPassword(prev => !prev);
	const handleClickShowConfirmPassword = () => setShowConfirmPassword(prev => !prev);

	const handlePasswordChange = e => {
		setInvalidPassword(false);
		setPassword(e.target.value);
	};

	const handleConfirmPasswordChange = e => {
		setInvalidConfirmPassword(false);
		setConfirmPassword(e.target.value);
	};

	const onNewPasswordSubmit = e => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setInvalidConfirmPassword(true);
			setSnackbarMessage('Passwords do not match! Please verify and try again.');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
			clearError();
			clearSuccessMessage();
			return;
		}

		onResetPasswordConfirm(uid, token, password);
		setSnackbarMessage('Please give us a moment to update your credentials...');
		setSnackbarSeverity('info');
		setSnackbarOpen(true);
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setSnackbarOpen(false);

		if (authSuccess) {
			navigate('/login'); // Adjust this to your preferred route
		}

		clearError();
		clearSuccessMessage();
	};

	useEffect(() => {
		if (authError) {
			setSnackbarMessage(authError);
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		}
	}, [authError]);

	useEffect(() => {
		if (authSuccess) {
			setSnackbarMessage(authSuccess);
			setSnackbarSeverity('success');
			setSnackbarOpen(true);
		}
	}, [authSuccess]);

	return (
		<>
			<Box display='flex' justifyContent='center' paddingTop='1rem'>
				<Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '50%'}>
					<form className={classes.form} onSubmit={onNewPasswordSubmit}>
						<CardHeader
							title='Reset Your Password'
							titleTypographyProps={{
								width: '100%',
								variant: isSmScreen || isXsScreen ? 'h6' : 'h5',
								textAlign: 'center',
								color: 'white'
							}}
							subheader='Enter and confirm your new password to reset'
							subheaderTypographyProps={{
								width: '100%',
								variant: isSmScreen || isXsScreen ? 'body2' : 'body1',
								textAlign: 'center',
								color: 'white'
							}}
						/>
						<Box display='flex' justifyContent='center' style={{ marginBottom: '4%' }}>
							<TextField
								autoFocus
								variant='standard'
								InputLabelProps={{
									style: {
										margin: '2px 5px',
										color: 'white'
									},
									sx: {
										color: 'white',
										backgroundColor: '#30313d'
									}
								}}
								InputProps={{
									disableUnderline: true,
									style: {
										margin: '5px',
										padding: '5px 0',
										fill: 'white'
									},
									sx: {
										color: 'white'
									},
									endAdornment: (
										<InputAdornment position='end'>
											<IconButton
												aria-label='toggle password visibility'
												onClick={handleClickShowPassword}
												sx={{ paddingRight: '5%' }}
											>
												{showPassword ? (
													<VisibilityOffIcon
														sx={{ color: 'whitesmoke' }}
													/>
												) : (
													<VisibilityIcon sx={{ color: 'whitesmoke' }} />
												)}
											</IconButton>
										</InputAdornment>
									)
								}}
								error={errors.password}
								required
								className={classes.textField}
								value={password}
								label={errors.password ? 'Invalid Password' : 'password'}
								type={showPassword ? 'text' : 'password'}
								{...register('password', {
									required: true,
									onChange: e => handlePasswordChange(e),
									error: invalidPassword
								})}
							/>
						</Box>
						<Box display='flex' justifyContent='center' style={{ marginBottom: '4%' }}>
							<TextField
								variant='standard'
								InputLabelProps={{
									style: {
										margin: '2px 5px',
										color: 'white'
									},
									sx: {
										color: 'white',
										backgroundColor: '#30313d'
									}
								}}
								InputProps={{
									disableUnderline: true,
									style: {
										margin: '5px',
										padding: '5px 0',
										fill: 'white'
									},
									sx: {
										color: 'white'
									},
									endAdornment: (
										<InputAdornment position='end'>
											<IconButton
												aria-label='toggle password visibility'
												onClick={handleClickShowConfirmPassword}
												sx={{ paddingRight: '5%' }}
											>
												{showConfirmPassword ? (
													<VisibilityOffIcon
														sx={{ color: 'whitesmoke' }}
													/>
												) : (
													<VisibilityIcon sx={{ color: 'whitesmoke' }} />
												)}
											</IconButton>
										</InputAdornment>
									)
								}}
								error={errors.reenterPassword}
								required
								className={classes.textField}
								value={confirmPassword}
								label={errors.password ? 'Invalid Password' : 're-enter password'}
								type={showConfirmPassword ? 'text' : 'password'}
								{...register('reenterPassword', {
									required: true,
									onChange: e => handleConfirmPasswordChange(e),
									error: invalidConfirmPassword
								})}
							/>
						</Box>
						<Box display='flex' justifyContent='center'>
							<PasswordRules password={password} confirmPassword={confirmPassword} />
						</Box>
						<Grid className={classes.buttonsContainer}>
							<Tooltip
								arrow
								title={
									<div
										style={{
											maxHeight: '25vh',
											overflowY: 'auto',
											padding: '8px',
											borderRadius: '8px'
										}}
									>
										<Typography variant='body2' letterSpacing='1px'>
											{'Reset your password'}
										</Typography>
									</div>
								}
							>
								<Button type='submit' className={classes.button}>
									Next
									<NavigateNextIcon />
								</Button>
							</Tooltip>
						</Grid>
					</form>
				</Box>
				<Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleClose}>
					<Alert
						onClose={handleClose}
						severity={snackbarSeverity}
						variant='filled'
						sx={{ width: '100%' }}
					>
						{snackbarMessage}
					</Alert>
				</Snackbar>
			</Box>
		</>
	);
};

const mapStateToProps = state => ({
	authError: state.auth.error,
	authSuccess: state.auth.successMessage
});

const mapDispatchToProps = dispatch => ({
	onResetPasswordConfirm: (uid, token, password) =>
		dispatch(resetPasswordConfirm(uid, token, password)),
	clearError: () => dispatch(authSlice.actions.clearError()),
	clearSuccessMessage: () => dispatch(authSlice.actions.clearSuccessMessage())
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
