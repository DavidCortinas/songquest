import React from 'react';
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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import theme from '../../theme';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
	checkRegistration,
	getUserPlaylists,
	login,
	registerUser,
	resetPassword
} from '../../thunks';
import {
	emailVerificationFailure,
	emailVerificationSuccess,
	resetDataLoaded,
	setCurrentUser
} from '../../actions';
import { useStyles } from './classes';
import { LoadingState } from '../../components/LoadingState';
import { validatePassword } from '../../utils';
import { authSlice } from '../../reducers';

export const PasswordRules = ({ password, confirmPassword }) => {
	const rules = [
		{ regex: /.{8,}/, message: 'Be at least 8 characters long' },
		{ regex: /[A-Z]/, message: 'Have at least one uppercase letter' },
		{ regex: /[a-z]/, message: 'Have at least one lowercase letter' },
		{ regex: /[0-9]/, message: 'Have at least one number' },
		{ regex: /[^A-Za-z0-9]/, message: 'Have at least one special character' },
		{ regex: new RegExp('^' + confirmPassword + '$'), message: 'Passwords must match' }
	];

	return (
		<Box display='flex' flexDirection='column' mt={2}>
			<Typography variant='h6' letterSpacing='2px' color='white'>
				{'Password Requirements: '}
			</Typography>
			<ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
				{rules.map((rule, index) => (
					<li
						key={index}
						style={{ color: 'whitesmoke', position: 'relative', paddingRight: '28px' }}
					>
						<Typography variant='subtitle1' letterSpacing='1px'>
							{rule.message}
						</Typography>
						{rule === rules[5] && confirmPassword === '' ? (
							<CloseIcon
								color='error'
								sx={{ position: 'absolute', right: 0, top: 0 }}
							/>
						) : rule.regex.test(password) ? (
							<CheckIcon
								color='success'
								sx={{ position: 'absolute', right: 0, top: 0 }}
							/>
						) : (
							<CloseIcon
								color='error'
								sx={{ position: 'absolute', right: 0, top: 0 }}
							/>
						)}
					</li>
				))}
			</ul>
		</Box>
	);
};

export const Login = ({
	authError,
	authSuccess,
	onResetDataLoaded,
	onGetUserPlaylists,
	onEmailVerificationSuccess,
	onEmailVerificationFailure,
	onLogin,
	user
}) => {
	const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
	const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
	const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

	const classes = useStyles();

	const {
		handleSubmit,
		register,
		formState: { errors }
	} = useForm();

	const [emailValue, setEmailValue] = useState('');
	const [passwordValue, setPasswordValue] = useState('');
	const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [checkedRegistration, setCheckedRegistration] = useState(false);
	const [userRegistered, setUserRegistered] = useState(false);
	const [invalidEmail, setInvalidEmail] = useState(false);
	const [invalidPassword, setInvalidPassword] = useState(false);
	const [invalidConfirmPassword, setInvalidConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState('info');

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const emailVerified = params.get('email_verified');
		const token = params.get('token');

		if (emailVerified === 'True' && token) {
			onEmailVerificationSuccess(true);
		} else {
			onEmailVerificationFailure(false, 'Email verification failed');
			// navigate('/verification-error');
		}

		params.delete('email_verified');
		params.delete('token');
		window.history.replaceState(null, '', '?' + params.toString());
	}, [location.search]);

	useEffect(() => {
		if (user?.user?.id) {
			onGetUserPlaylists(user?.user?.id);
		}
	}, [user]);

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

	const onEmailSubmit = async () => {
		if (!emailValue) {
			setInvalidEmail(true);
			return;
		}
		setIsLoading(true);

		try {
			// setDisplayNameCreated(true);
			const currentUser = await dispatch(
				checkRegistration({
					email: emailValue
				})
			);

			if (currentUser?.isRegistered) {
				setUserRegistered(true);
			} else {
				setUserRegistered(false);
			}
			setCheckedRegistration(true);
		} catch (error) {
			console.log('Error: ', error);
		} finally {
			setIsLoading(false);
		}
	};

	const onPasswordSubmit = async () => {
		if (!passwordValue) {
			setInvalidPassword(true);
			return;
		}

		try {
			const currentUser = await onLogin(emailValue, passwordValue);

			if (currentUser) {
				dispatch(setCurrentUser(currentUser));

				if (
					currentUser.user.profile &&
					currentUser.user.profile.achievements?.includes(1)
				) {
					navigate('/');
				} else {
					navigate('/onboard');
				}
			}

			onResetDataLoaded();
		} catch (error) {
			console.log('Error: ', error);
		}
	};

	const onCreatePassword = async () => {
		setSnackbarSeverity('info');
		setSnackbarMessage('One moment while we register your account...');
		setSnackbarOpen(true);

		const passwordErrors = validatePassword(passwordValue);
		if (passwordErrors.length > 0) {
			setInvalidPassword(true);
			setSnackbarMessage(
				`Password does not meet the following criteria: ${passwordErrors
					.map(error => error.message)
					.join(', ')}`
			);
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
			return;
		}

		if (passwordValue !== confirmPasswordValue) {
			setInvalidConfirmPassword(true);
			setSnackbarMessage('Passwords do not match');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
			return;
		}

		try {
			await dispatch(registerUser(emailValue, passwordValue));
			navigate('/registration-success');
		} catch (error) {
			setSnackbarSeverity('error');
			setSnackbarMessage(
				`There was an issue registering your account. 
                Please try again. If the issue persists, please contact 
                support@songquest.io`
			);
			setSnackbarOpen(true);
			console.log('Error: ', error);
		}
	};

	const onResetPassword = async () => {
		setSnackbarSeverity('info');
		setSnackbarMessage('One moment while we send you a reset email...');
		setSnackbarOpen(true);

		await dispatch(resetPassword(user.user.email));
	};

	const handleEmailChange = e => {
		setInvalidEmail(false);
		setEmailValue(e.target.value);
	};

	const handlePasswordChange = e => {
		setInvalidPassword(false);
		setPasswordValue(e.target.value);
	};

	const handleConfirmPasswordChange = e => {
		setInvalidConfirmPassword(false);
		setConfirmPasswordValue(e.target.value);
	};

	const handleClickShowPassword = () => setShowPassword(prev => !prev);
	const handleClickShowConfirmPassword = () => setShowConfirmPassword(prev => !prev);

	const handlePasswordSubmit = e => {
		e.preventDefault();
		onPasswordSubmit();
	};

	const handleCreatePassword = e => {
		e.preventDefault();
		onCreatePassword();
	};

	const handleResetPassword = e => {
		e.preventDefault();
		onResetPassword();
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setSnackbarOpen(false);
		dispatch(authSlice.actions.clearError());
		dispatch(authSlice.actions.clearSuccessMessage());
	};

	return (
		<>
			{isLoading ? (
				<LoadingState />
			) : !checkedRegistration ? (
				<>
					<Box display='flex' justifyContent='center'>
						<Box width='100%'>
							<form className={classes.form}>
								<CardHeader
									title='Login/Register'
									titleTypographyProps={{
										width: '100%',
										variant: isSmScreen || isXsScreen ? 'h6' : 'h5',
										textAlign: 'center',
										color: 'white',
										paddingTop: '1rem'
									}}
									subheader='Enter an email to get started!'
									subheaderTypographyProps={{
										width: '100%',
										variant: isXlScreen || isLgScreen ? 'body1' : 'body2',
										textAlign: 'center',
										color: 'whitesmoke',
										paddingTop: '5px'
									}}
								/>
								<Box
									display='flex'
									justifyContent='center'
									style={{ marginBottom: '4%' }}
								>
									<TextField
										autoComplete='off'
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
											}
										}}
										error={errors.email}
										required
										className={
											isSmScreen || isXsScreen
												? classes.textField
												: `${classes.textField} ${classes.emailField}`
										}
										value={emailValue}
										label={errors.email ? 'Invalid Email' : 'email'}
										{...register('email', {
											required: true,
											pattern: /^\S+@\S+$/i,
											onChange: e => handleEmailChange(e),
											error: invalidEmail
										})}
									/>
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
													{'Continue to next step'}
												</Typography>
											</div>
										}
									>
										<Button
											type='submit'
											className={classes.button}
											onClick={handleSubmit(onEmailSubmit)}
										>
											Next
											<NavigateNextIcon />
										</Button>
									</Tooltip>
								</Grid>
							</form>
						</Box>
					</Box>
				</>
			) : userRegistered ? (
				<>
					<Box display='flex' justifyContent='center' paddingTop='3rem'>
						<Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '50%'}>
							<form className={classes.form} onSubmit={handlePasswordSubmit}>
								<CardHeader
									title={
										user?.user?.username
											? `Welcome Back ${user?.user?.username}!`
											: 'Welcome Back!'
									}
									titleTypographyProps={{
										width: '100%',
										variant: isSmScreen || isXsScreen ? 'h6' : 'h5',
										textAlign: 'center',
										color: 'white'
									}}
									subheader={'Enter password to sign in and continue'}
									subheaderTypographyProps={{
										width: '100%',
										variant: isXlScreen || isLgScreen ? 'body1' : 'body2',
										textAlign: 'center',
										color: 'white'
									}}
								/>
								<Box
									display='flex'
									justifyContent='center'
									style={{ marginBottom: '4%' }}
								>
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
															<VisibilityIcon
																sx={{ color: 'whitesmoke' }}
															/>
														)}
													</IconButton>
												</InputAdornment>
											)
										}}
										error={errors.password}
										required
										className={classes.textField}
										value={passwordValue}
										label={errors.password ? 'Invalid Password' : 'password'}
										type={showPassword ? 'text' : 'password'}
										{...register('password', {
											required: true,
											onChange: e => handlePasswordChange(e),
											error: invalidPassword
										})}
									/>
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
													{user?.user?.username
														? `Sign in as ${user?.user?.username}`
														: 'Sign in'}
												</Typography>
											</div>
										}
									>
										<Button
											type='submit'
											className={classes.button}
											onClick={handleSubmit(onPasswordSubmit)}
										>
											{'Login'}
											<NavigateNextIcon />
										</Button>
									</Tooltip>
								</Grid>
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
													{`Sign in as ${user?.user?.username}`}
												</Typography>
											</div>
										}
									>
										<Button
											type='submit'
											className={classes.button}
											onClick={handleResetPassword}
											sx={{
												fontSize: '0.75rem'
											}}
										>
											{'Reset Password'}
											<NavigateNextIcon />
										</Button>
									</Tooltip>
								</Grid>
							</form>
						</Box>
					</Box>
				</>
			) : (
				<>
					<Box display='flex' justifyContent='center' paddingTop='1rem'>
						<Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '50%'}>
							<form className={classes.form} onSubmit={handleCreatePassword}>
								<CardHeader
									title='Looks like your new here...'
									titleTypographyProps={{
										width: '100%',
										variant: isSmScreen || isXsScreen ? 'h6' : 'h5',
										textAlign: 'center',
										color: 'white'
									}}
									subheader='Enter and confirm your password to register'
									subheaderTypographyProps={{
										width: '100%',
										variant: isSmScreen || isXsScreen ? 'body2' : 'body1',
										textAlign: 'center',
										color: 'white'
									}}
								/>
								<Box
									display='flex'
									justifyContent='center'
									style={{ marginBottom: '4%' }}
								>
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
															<VisibilityIcon
																sx={{ color: 'whitesmoke' }}
															/>
														)}
													</IconButton>
												</InputAdornment>
											)
										}}
										error={errors.password}
										required
										className={classes.textField}
										value={passwordValue}
										label={errors.password ? 'Invalid Password' : 'password'}
										type={showPassword ? 'text' : 'password'}
										{...register('password', {
											required: true,
											onChange: e => handlePasswordChange(e),
											error: invalidPassword
										})}
									/>
								</Box>
								<Box
									display='flex'
									justifyContent='center'
									style={{ marginBottom: '4%' }}
								>
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
															<VisibilityIcon
																sx={{ color: 'whitesmoke' }}
															/>
														)}
													</IconButton>
												</InputAdornment>
											)
										}}
										error={errors.reenterPassword}
										required
										className={classes.textField}
										value={confirmPasswordValue}
										label={
											errors.password
												? 'Invalid Password'
												: 're-enter password'
										}
										type={showConfirmPassword ? 'text' : 'password'}
										{...register('reenterPassword', {
											required: true,
											onChange: e => handleConfirmPasswordChange(e),
											error: invalidConfirmPassword
										})}
									/>
								</Box>
								<Box display='flex' justifyContent='center'>
									<PasswordRules
										password={passwordValue}
										confirmPassword={confirmPasswordValue}
									/>
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
													{'Create your account'}
												</Typography>
											</div>
										}
									>
										<Button
											type='submit'
											className={classes.button}
											onClick={handleSubmit(onCreatePassword)}
										>
											Next
											<NavigateNextIcon />
										</Button>
									</Tooltip>
								</Grid>
							</form>
						</Box>
					</Box>
				</>
			)}
			<Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleClose}>
				<Alert
					onClose={handleClose}
					severity={snackbarSeverity}
					variant='filled'
					sx={{ width: '100%' }}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</>
	);
};

const mapStateToProps = state => ({
	user: state.user.currentUser,
	authError: state.auth.error,
	authSuccess: state.auth.successMessage
});

const mapDispatchToProps = dispatch => ({
	onGetUserPlaylists: userId => dispatch(getUserPlaylists(userId)),
	onResetDataLoaded: () => dispatch(resetDataLoaded()),
	onEmailVerificationSuccess: emailVerified => dispatch(emailVerificationSuccess(emailVerified)),
	onEmailVerificationFailure: (emailVerified, error) =>
		dispatch(emailVerificationFailure(emailVerified, error)),
	onLogin: (email, password) => dispatch(login(email, password))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
