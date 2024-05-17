import React from 'react';
import {
	Alert,
	Box,
	Button,
	CardHeader,
	Grid,
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
import { checkRegistration, getUserPlaylists, login, registerUser } from '../../thunks';
import { resetDataLoaded, setCurrentUser } from '../../actions';
import { useStyles } from './classes';
import { LoadingState } from '../../components/LoadingState';
import { validatePassword } from '../../utils';

const PasswordRules = ({ password, confirmPassword }) => {
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

export const Login = ({ onResetDataLoaded, onGetUserPlaylists, user }) => {
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
		if (user?.user?.id) {
			onGetUserPlaylists(user?.user?.id);
		}
	}, [user]);

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
			const currentUser = await dispatch(login(emailValue, passwordValue));

			dispatch(setCurrentUser(currentUser));

			if (currentUser && !currentUser.user.spotify_connected) {
				navigate('/spotify-connect');
			} else if (currentUser) {
				navigate('/');
			}

			onResetDataLoaded();
		} catch (error) {
			console.log('Error: ', error);
		}
	};

	const onCreatePassword = async () => {
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
			const currentUser = await dispatch(login(emailValue, passwordValue));
			dispatch(setCurrentUser(currentUser));
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

	const handlePasswordSubmit = e => {
		e.preventDefault();
		onPasswordSubmit();
	};

	const handleCreatePassword = e => {
		e.preventDefault();
		onCreatePassword();
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setSnackbarOpen(false);
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
								<br />
								<br />
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
								<br />
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
									title='Welcome Back!'
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
											}
										}}
										error={errors.password}
										required
										className={classes.textField}
										value={passwordValue}
										label={errors.password ? 'Invalid Password' : 'password'}
										type='password'
										{...register('password', {
											required: true,
											onChange: e => handlePasswordChange(e),
											error: invalidPassword
										})}
									/>
								</Box>
								<br />
								<br />
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
													{`Sign in as ${user?.user?.display_name}`}
												</Typography>
											</div>
										}
									>
										<Button
											type='submit'
											className={classes.button}
											onClick={handleSubmit(onPasswordSubmit)}
										>
											Login
											<NavigateNextIcon />
										</Button>
									</Tooltip>
								</Grid>
								<br />
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
											}
										}}
										error={errors.password}
										required
										className={classes.textField}
										value={passwordValue}
										label={errors.password ? 'Invalid Password' : 'password'}
										type='password'
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
											}
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
										type='password'
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
								<br />
								<br />
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
								<br />
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
	user: state.user.currentUser
});

const mapDispatchToProps = dispatch => ({
	onGetUserPlaylists: userId => dispatch(getUserPlaylists(userId)),
	onResetDataLoaded: () => dispatch(resetDataLoaded())
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
