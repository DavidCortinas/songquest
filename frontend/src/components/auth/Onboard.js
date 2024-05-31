import React from 'react';
import { useForm } from 'react-hook-form';
import { useStyles } from './classes';
import { useEffect, useState } from 'react';
import theme from '../../theme';
import {
	Alert,
	Autocomplete,
	Box,
	Button,
	CardHeader,
	Grid,
	Snackbar,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip,
	Typography,
	useMediaQuery
} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { connect, useDispatch } from 'react-redux';
import {
	SpotifyAuth,
	getSpotifyGenres,
	getSpotifyUserAuth,
	handleUpdateBirthday,
	handleUpdateDisplayName,
	handleUpdatePreferredGenres,
	handleUpdateProfileImage,
	handleUpdateUserProfession,
	handleUpdateUserType
} from '../../thunks';
import { toCapitalCase } from '../../utils';
import { DropzoneArea } from 'mui-file-dropzone';
import { useLocation, useNavigate } from 'react-router-dom';
import { emailVerificationFailure, emailVerificationSuccess } from '../../actions';
import { LoadingState } from '../../components/LoadingState';
import spotifyLogo from '../../../public/images/spotifyLogo.png';

const root = {
	"& .MuiAutocomplete-option[data-focus='true']": {
		backgroundColor: '#40444d',
		color: 'white'
	},
	'& .MuiAutocomplete-option:hover': {
		backgroundColor: '#40444d',
		color: 'white'
	}
};

export const AddImageIcon = () => (
	<AddAPhotoIcon
		style={{
			fontSize: 80,
			color: 'rgb(210,220,225, 0.6)'
		}}
	/>
);

const DisplayNameInput = ({
	isXlScreen,
	isLgScreen,
	isMdScreen,
	isSmScreen,
	isXsScreen,
	classes,
	errors,
	register,
	handleSubmit,
	onUpdateDisplayName,
	currentUser,
	setCurrentStep
}) => {
	const [displayNameValue, setDisplayNameValue] = useState('');
	// const [invalidDisplayName, setInvalidDisplayName] = useState(false);

	const handleDisplayNameChange = e => {
		setDisplayNameValue(e.target.value);
	};

	console.log(displayNameValue);

	const onCreateDisplayName = async () => {
		if (!currentUser?.user.id) {
			console.error('No user ID found');
			return;
		}

		let displayName = displayNameValue.trim() ? displayNameValue : null;

		try {
			const savedDisplayName = await onUpdateDisplayName(currentUser.user.id, displayName);
			if (savedDisplayName) {
				setCurrentStep('birthday');
			}
		} catch (error) {
			console.error('Failed to update display name:', error);
			// Optionally handle the error, e.g., show an error message to the user
			// Do not move to the next step if there is an error
		}
	};

	return (
		<Box display='flex' justifyContent='center' paddingTop='1rem'>
			<Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '50%'}>
				<form className={classes.form} onSubmit={handleSubmit(onCreateDisplayName)}>
					<CardHeader
						title='Your Email is Verified!'
						titleTypographyProps={{
							width: '100%',
							variant: isSmScreen || isXsScreen ? 'h6' : 'h5',
							textAlign: 'center',
							color: 'white',
							letterSpacing: '1px'
						}}
						subheader='Enter a display name to get started on your profile'
						subheaderTypographyProps={{
							width: '100%',
							variant: isXlScreen || isLgScreen ? 'body1' : 'body2',
							textAlign: 'center',
							color: 'white',
							letterSpacing: '1px'
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
								disableUnderline: 'true',
								style: {
									margin: '5px',
									padding: '5px 0',
									fill: 'white'
								},
								sx: {
									color: 'white',
									fontSize: '1.25rem'
								}
							}}
							error={errors.display_name}
							className={classes.textField}
							value={displayNameValue}
							label={errors.display_name ? 'Invalid Display Name' : 'Display Name'}
							type='display-name'
							{...register('display-name', {
								required: false,
								onChange: e => handleDisplayNameChange(e)
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
										{'Create display name and continue'}
									</Typography>
								</div>
							}
						>
							<Button
								type='submit'
								className={classes.button}
								sx={{
									letterSpacing: '1px'
								}}
							>
								{'Next'}
								<NavigateNextIcon />
							</Button>
						</Tooltip>
					</Grid>
					<br />
				</form>
			</Box>
		</Box>
	);
};

const BirthdayInput = ({
	classes,
	isXsScreen,
	isSmScreen,
	isMdScreen,
	isLgScreen,
	isXlScreen,
	handleSubmit,
	currentUser,
	setCurrentStep,
	onUpdateBirthday
}) => {
	const [date, setDate] = useState(null);

	const onSaveBirthday = async () => {
		// eslint-disable-next-line no-unused-vars
		const savedBirthday = await onUpdateBirthday(currentUser?.user.id, date);
		setCurrentStep('genres');
	};

	return (
		<Box display='flex' justifyContent='center' paddingTop='1rem'>
			<Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '50%'}>
				<form className={classes.form}>
					<CardHeader
						title={`Nice to meet you, ${currentUser.user.displayName}!`}
						titleTypographyProps={{
							width: '100%',
							variant: isSmScreen || isXsScreen ? 'h6' : 'h5',
							textAlign: 'center',
							color: 'white',
							letterSpacing: '1px'
						}}
						subheader='Please, enter your birth date to continue...'
						subheaderTypographyProps={{
							width: '100%',
							variant: isXlScreen || isLgScreen ? 'body1' : 'body2',
							textAlign: 'center',
							color: 'white',
							letterSpacing: '1px'
						}}
					/>
					<Box display='flex' justifyContent='center' style={{ marginBottom: '4%' }}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DateField
								autoFocus
								label='Birth Date'
								value={date}
								onChange={newDate => setDate(newDate)}
								sx={{
									width: isSmScreen || isXsScreen ? '80%' : '40%',
									'& .MuiInputLabel-root': {
										color: 'white'
									},
									'& .MuiInputBase-root': {
										color: 'white',
										backgroundColor: '#30313d',
										borderRadius: '8px',
										fontSize: '1.25rem'
									},
									'& .MuiInputBase-input': {
										color: 'white'
									},
									'& .MuiInput-underline:before': {
										borderBottomColor: 'transparent'
									},
									'& .MuiInput-underline:hover:not(.Mui-disabled):before': {
										borderBottomColor: 'transparent'
									}
								}}
							/>
						</LocalizationProvider>
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
										{'Enter birthday and continue'}
									</Typography>
								</div>
							}
						>
							<Button
								type='submit'
								className={classes.button}
								onClick={handleSubmit(onSaveBirthday)}
								sx={{
									letterSpacing: '1px'
								}}
							>
								{'Next'}
								<NavigateNextIcon />
							</Button>
						</Tooltip>
					</Grid>
					<br />
				</form>
			</Box>
		</Box>
	);
};

const GenresInput = ({
	accessToken,
	expiresAt,
	classes,
	isXsScreen,
	isSmScreen,
	isMdScreen,
	isLgScreen,
	isXlScreen,
	genres,
	handleSubmit,
	currentUser,
	setCurrentStep,
	onUpdatePreferredGenres
}) => {
	const dispatch = useDispatch();
	const [selectedGenres, setSelectedGenres] = useState([]);

	useEffect(() => {
		dispatch(getSpotifyGenres(accessToken, expiresAt));
	}, [dispatch, accessToken, expiresAt]);

	const handleChange = (event, newValue) => {
		setSelectedGenres(newValue);
	};

	const onSaveGenres = async () => {
		// eslint-disable-next-line no-unused-vars
		const preferredGenres = await onUpdatePreferredGenres(currentUser?.user.id, selectedGenres);
		setCurrentStep('userType');
	};

	return (
		<Box display='flex' justifyContent='center' paddingTop='1rem'>
			<Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '50%'}>
				<form className={classes.form}>
					<CardHeader
						title='Thanks! Now for some insight into your taste...'
						titleTypographyProps={{
							width: '100%',
							variant: isSmScreen || isXsScreen ? 'h6' : 'h5',
							textAlign: 'center',
							color: 'white',
							letterSpacing: '1px'
						}}
						subheader={
							isXsScreen || isSmScreen
								? 'What genres do you prefer to listen to?'
								: 'What genres do you usually prefer to listen to? This will help us to better customize your experience'
						}
						subheaderTypographyProps={{
							width: '100%',
							variant:
								isXlScreen || isLgScreen
									? 'body1'
									: isMdScreen
									? 'body2'
									: 'subtitle2',
							textAlign: 'center',
							color: 'white',
							letterSpacing: '1px'
						}}
					/>
					<Box display='flex' justifyContent='center' style={{ marginBottom: '4%' }}>
						<Autocomplete
							freeSolo
							multiple
							filterSelectedOptions
							selectOnFocus
							clearOnBlur
							handleHomeEndKeys
							value={selectedGenres.map(genre => toCapitalCase(genre))}
							onChange={handleChange}
							options={genres.map(genre => toCapitalCase(genre))}
							ListboxProps={{
								sx: {
									...root,
									padding: 0
								}
							}}
							className={classes.textField}
							renderOption={(props, option) => (
								<Box
									component='li'
									sx={{
										justifyContent: 'space-between',
										background: '#30313d',
										color: 'white'
									}}
									{...props}
								>
									{option}
								</Box>
							)}
							ChipProps={{
								sx: {
									color: 'white',
									backgroundColor: '#006f96',
									'& .MuiChip-deleteIcon': {
										color: 'white'
									},
									'& .MuiChip-deleteIcon:hover': {
										color: '#00435a'
									}
								}
							}}
							renderInput={params => (
								<TextField
									{...params}
									label='Select Genres'
									variant='standard'
									InputLabelProps={{
										sx: {
											paddingLeft: '1em',
											// backgroundColor: '#30313d',
											color: 'white'
										}
									}}
									InputProps={{
										...params.InputProps,
										style: {
											margin: '5px 0',
											padding: '5px 10px',
											fill: 'white'
										},
										sx: {
											...params.InputProps.sx,
											color: 'white',
											'& .MuiInputBase-input': {
												color: 'white',
												fontSize: '1.25rem'
											},
											'&:before': {
												borderBottom: 'none'
											},
											'&:hover:not(.Mui-disabled):before': {
												borderBottom: 'none'
											}
										}
									}}
								/>
							)}
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
										{'Save and continue'}
									</Typography>
								</div>
							}
						>
							<Button
								type='submit'
								className={classes.button}
								onClick={handleSubmit(onSaveGenres)}
								sx={{
									letterSpacing: '1px'
								}}
							>
								{'Next'}
								<NavigateNextIcon />
							</Button>
						</Tooltip>
					</Grid>
					<br />
				</form>
			</Box>
		</Box>
	);
};

const UserTypeInput = ({
	classes,
	isXsScreen,
	isSmScreen,
	isMdScreen,
	errors,
	register,
	handleSubmit,
	currentUser,
	setCurrentStep,
	onUpdateUserType,
	onUpdateUserProfession
}) => {
	const [toggleValue, setToggleValue] = useState('Fan');
	const [professionValue, setProfessionValue] = useState('');

	const handleToggle = e => {
		setToggleValue(e.target.value);
	};

	const handleProfessionValueChange = e => {
		setProfessionValue(e.target.value);
	};

	const onSubmitTypeAndProfession = async () => {
		const userType = await onUpdateUserType(currentUser?.user.id, toggleValue);

		if (userType === 'Professional') {
			onUpdateUserProfession(currentUser?.user.id, professionValue);
		}

		setCurrentStep('image');
	};

	const controlledMessage =
		toggleValue === 'Fan' && isXsScreen
			? `If you work with music, we'd like to know so we can learn how 
        to best serve you...`
			: toggleValue === 'Fan' && isSmScreen
			? `We believe music discovery offers a rewarding experience for all music 
        fans, but if you work with music, we'd like to know so we can learn how 
        to best serve you...`
			: toggleValue === 'Fan'
			? `We believe music discovery offers a rewarding experience for all music 
        fans and are on a mission to make it easier and more rewarding for fans
        to unearth, discover,  and share new songs, but if you work with music, 
        we'd like to know so we can learn how to best serve you...`
			: `What is your profession?`;

	return (
		<Box display='flex' justifyContent='center' paddingTop='1rem'>
			<Box width={isSmScreen || isXsScreen ? '90%' : isMdScreen ? '85%' : '80%'}>
				<form className={classes.form}>
					<CardHeader
						title={
							isXsScreen || isSmScreen
								? 'Just a few more things...'
								: `Just a few more things before we get you on your way...`
						}
						titleTypographyProps={{
							width: '100%',
							variant: isSmScreen || isXsScreen ? 'h6' : 'h5',
							textAlign: 'center',
							color: 'white',
							letterSpacing: '1px'
						}}
						subheader={
							isXsScreen || isSmScreen
								? 'Are you a fan or do you work with music to make a living?'
								: 'How do you typically engage with music? Are you a fan or do you work with music to make a living?'
						}
						subheaderTypographyProps={{
							width: '100%',
							variant: isSmScreen || isXsScreen ? 'subtitle1' : 'h6',
							textAlign: 'center',
							color: 'white',
							letterSpacing: '1px'
						}}
					/>
					<Box
						display='flex'
						justifyContent='center'
						alignItems='center'
						sx={{
							height: '70px',
							marginBottom: '4%'
						}}
					>
						{toggleValue === 'Fan' ? (
							<Typography
								variant={isSmScreen || isXsScreen ? 'subtitle2' : 'subtitle1'}
								letterSpacing='2px'
								color='whitesmoke'
								textAlign='center'
							>
								{controlledMessage}
							</Typography>
						) : (
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
									disableUnderline: 'true',
									style: {
										margin: '5px',
										padding: '5px 0',
										fill: 'white'
									},
									sx: {
										color: 'white',
										fontSize: '1.25rem'
									}
								}}
								error={errors.display_name}
								className={classes.textField}
								value={professionValue}
								label={'Enter your profession...'}
								type='profession'
								{...register('profession', {
									required: false,
									onChange: e => handleProfessionValueChange(e)
								})}
							/>
						)}
					</Box>
					<Box display='flex' justifyContent='center'>
						<ToggleButtonGroup
							exclusive
							sx={{
								boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
								borderRadius: '8px',
								width: isXsScreen || isSmScreen ? '80%' : '70%'
							}}
							onChange={handleToggle}
						>
							<ToggleButton
								value='Fan'
								sx={{
									backgroundColor:
										toggleValue === 'Fan'
											? 'rgb(44, 216, 207, 0.3)'
											: 'rgba(48, 130, 164, 0.15)',
									color: toggleValue === 'Fan' ? 'whitesmoke' : 'grey',
									borderRadius: '8px',
									width: '50%',
									'&:hover': {
										backgroundColor: 'rgb(44, 216, 207, 0.5)',
										color: 'whitesmoke'
									}
								}}
							>
								Fan
							</ToggleButton>
							<ToggleButton
								value='Professional'
								sx={{
									backgroundColor:
										toggleValue === 'Professional'
											? 'rgb(44, 216, 207, 0.3)'
											: 'rgba(48, 130, 164, 0.15)',
									color: toggleValue === 'Professional' ? 'whitesmoke' : 'grey',
									borderRadius: '8px',
									width: '50%',
									'&:hover': {
										backgroundColor: 'rgb(44, 216, 207, 0.5)',
										color: 'whitesmoke'
									}
								}}
							>
								Professional
							</ToggleButton>
						</ToggleButtonGroup>
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
										{'Save and continue'}
									</Typography>
								</div>
							}
						>
							<Button
								type='submit'
								className={classes.button}
								onClick={handleSubmit(onSubmitTypeAndProfession)}
								sx={{
									letterSpacing: '1px'
								}}
							>
								{'Next'}
								<NavigateNextIcon />
							</Button>
						</Tooltip>
					</Grid>
					<br />
				</form>
			</Box>
		</Box>
	);
};

const ImageInput = ({
	isXsScreen,
	isSmScreen,
	isMdScreen,
	classes,
	handleSubmit,
	setCurrentStep,
	currentUser,
	onUpdateProfileImage
}) => {
	const [imageFile, setImageFile] = useState(null);

	const handleImageChange = files => {
		const file = files[0] ? files[0] : null;
		setImageFile(file);
	};

	const maxFileSize = 5 * 1048576;

	const onSubmitImage = async () => {
		// eslint-disable-next-line no-unused-vars
		const image = await onUpdateProfileImage(currentUser?.user.id, imageFile);
		setCurrentStep('spotifyConnect');
	};

	return (
		<Box display='flex' justifyContent='center' paddingTop='1rem'>
			<Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '60%'}>
				<form className={classes.form}>
					<CardHeader
						title={`Great, now let's add a profile image...`}
						titleTypographyProps={{
							width: '100%',
							variant: isSmScreen || isXsScreen ? 'h6' : 'h5',
							textAlign: 'center',
							color: 'white',
							letterSpacing: '1px'
						}}
						subheader={'Upload an image, then continue to connect your Spotify account'}
						subheaderTypographyProps={{
							width: '100%',
							variant: isXsScreen || isSmScreen ? 'subtitle1' : 'h6',
							textAlign: 'center',
							color: 'white',
							letterSpacing: '1px'
						}}
					/>
					<DropzoneArea
						acceptedFiles={['image/*']}
						filesLimit={1}
						maxFileSize={maxFileSize}
						dropzoneText={
							isXsScreen || isSmScreen
								? 'Add your image here...'
								: 'Drag and drop an image here or click to pull up your file browser...'
						}
						onChange={handleImageChange}
						dropzoneClass={classes.dropzone}
						previewGridClasses={{
							container: classes.imagePreviewContainer
						}}
						Icon={AddImageIcon}
					/>
					<Button
						type='submit'
						className={classes.button}
						onClick={handleSubmit(onSubmitImage)}
						sx={{
							letterSpacing: '1px'
						}}
					>
						{'Next'}
						<NavigateNextIcon />
					</Button>
				</form>
			</Box>
		</Box>
	);
};

const OnboardSpotify = ({
	currentUser,
	onGetSpotifyUserAuth,
	isXsScreen,
	isSmScreen,
	isMdScreen,
	classes
}) => {
	const navigate = useNavigate();

	const handleConnectThroughSpotify = async (e, source) => {
		e.preventDefault();

		await onGetSpotifyUserAuth(currentUser.user.id, source);
	};

	const handleNext = () => {
		navigate('/');
	};

	return (
		<Box display='flex' justifyContent='center' paddingTop='1rem'>
			<Box width={isMdScreen || isSmScreen || isXsScreen ? '75%' : '60%'}>
				<form className={classes.form}>
					<CardHeader
						title={`One last thing before we get going...`}
						titleTypographyProps={{
							width: '100%',
							variant: isSmScreen || isXsScreen ? 'h6' : 'h5',
							textAlign: 'center',
							color: 'white',
							letterSpacing: '1px'
						}}
						subheader={
							isSmScreen || isXsScreen
								? 'Click on the icon to link to your Spotify Library'
								: 'Click on the icon to link to your Spotify library to create playlists and more!'
						}
						subheaderTypographyProps={{
							width: '100%',
							variant: isXsScreen || isSmScreen ? 'subtitle1' : 'h6',
							textAlign: 'center',
							color: 'white',
							letterSpacing: '1px'
						}}
					/>
					<Button
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							margin: '2% 0 3%',
							'&:hover': {
								backgroundColor: 'transparent !important'
							}
						}}
						onClick={e => handleConnectThroughSpotify(e, 'onboard')}
					>
						<img
							loading='lazy'
							width={isSmScreen || isXsScreen ? '200em' : '300em'}
							style={{
								margin: '0 auto',
								display: 'block'
							}}
							src={spotifyLogo}
						/>
					</Button>
					<Typography
						color='whitesmoke'
						textAlign='center'
						variant='subtitle1'
						letterSpacing='1px'
						paddingBottom='2%'
					>
						{isXsScreen || isSmScreen
							? 'Or sign up for free! Then continue on to the demo...'
							: 'If you do not already have a Spotify account you can sign up for free! Then continue on to the demo...'}
					</Typography>
					<Button
						type='submit'
						className={classes.button}
						onClick={handleNext}
						sx={{
							letterSpacing: '1px'
						}}
					>
						{'Next'}
						<NavigateNextIcon />
					</Button>
				</form>
			</Box>
		</Box>
	);
};

export const Onboard = ({
	onGetSpotifyUserAuth,
	onEmailVerificationSuccess,
	onEmailVerificationFailure,
	onUpdateDisplayName,
	onUpdateBirthday,
	onUpdatePreferredGenres,
	onUpdateUserType,
	onUpdateUserProfession,
	onUpdateProfileImage,
	currentUser,
	genres,
	userError,
	userLoading
}) => {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState('info');

	const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
	const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
	const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

	const [currentStep, setCurrentStep] = useState('displayName');

	const classes = useStyles();
	const location = useLocation();
	const navigate = useNavigate();

	const {
		handleSubmit,
		register,
		formState: { errors }
	} = useForm();

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
		if (currentStep === 'demo') {
			navigate('/registration-success');
		}
	}, [currentStep]);

	useEffect(() => {
		if (userLoading) {
			// Optionally handle loading state
		} else if (userError) {
			setSnackbarMessage(userError);
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		} else {
			if (currentStep === 'birthday') {
				setSnackbarMessage('Display name created successfully');
				setSnackbarSeverity('success');
				setSnackbarOpen(true);
			}
			if (currentStep === 'genres') {
				setSnackbarMessage('Birthday saved successfully');
				setSnackbarSeverity('success');
				setSnackbarOpen(true);
			}
			if (currentStep === 'userType') {
				setSnackbarMessage('Preferred genres saved successfully');
				setSnackbarSeverity('success');
				setSnackbarOpen(true);
			}
			if (currentStep === 'image') {
				setSnackbarMessage('User type saved successfully');
				setSnackbarSeverity('success');
				setSnackbarOpen(true);
			}
			if (currentStep === 'spotifyConnect') {
				setSnackbarMessage('Profile image saved successfully');
				setSnackbarSeverity('success');
				setSnackbarOpen(true);
			}
		}
	}, [userLoading, userError, currentStep]);

	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setSnackbarOpen(false);
	};

	if (userLoading) {
		return <LoadingState />;
	}

	return (
		<>
			{currentStep === 'displayName' ? (
				<DisplayNameInput
					isXlScreen={isXlScreen}
					isLgScreen={isLgScreen}
					isMdScreen={isMdScreen}
					isSmScreen={isSmScreen}
					isXsScreen={isXsScreen}
					classes={classes}
					errors={errors}
					register={register}
					handleSubmit={handleSubmit}
					onUpdateDisplayName={onUpdateDisplayName}
					currentUser={currentUser}
					setCurrentStep={setCurrentStep}
				/>
			) : currentStep === 'birthday' ? (
				<BirthdayInput
					classes={classes}
					isXsScreen={isXsScreen}
					isSmScreen={isSmScreen}
					isMdScreen={isMdScreen}
					isLgScreen={isLgScreen}
					isXlScreen={isXlScreen}
					handleSubmit={handleSubmit}
					currentUser={currentUser}
					setCurrentStep={setCurrentStep}
					onUpdateBirthday={onUpdateBirthday}
				/>
			) : currentStep === 'genres' ? (
				<SpotifyAuth>
					{(accessToken, expiresAt) => {
						return (
							<GenresInput
								accessToken={accessToken}
								expiresAt={expiresAt}
								classes={classes}
								isXsScreen={isXsScreen}
								isSmScreen={isSmScreen}
								isMdScreen={isMdScreen}
								isLgScreen={isLgScreen}
								isXlScreen={isXlScreen}
								genres={genres}
								errors={errors}
								currentUser={currentUser}
								setCurrentStep={setCurrentStep}
								register={register}
								handleSubmit={handleSubmit}
								onUpdatePreferredGenres={onUpdatePreferredGenres}
							/>
						);
					}}
				</SpotifyAuth>
			) : currentStep === 'userType' ? (
				<UserTypeInput
					classes={classes}
					isXsScreen={isXsScreen}
					isSmScreen={isSmScreen}
					isMdScreen={isMdScreen}
					errors={errors}
					register={register}
					handleSubmit={handleSubmit}
					currentUser={currentUser}
					setCurrentStep={setCurrentStep}
					onUpdateUserType={onUpdateUserType}
					onUpdateUserProfession={onUpdateUserProfession}
				/>
			) : currentStep === 'image' ? (
				<ImageInput
					isXsScreen={isXsScreen}
					isSmScreen={isSmScreen}
					isMdScreen={isMdScreen}
					classes={classes}
					handleSubmit={handleSubmit}
					setCurrentStep={setCurrentStep}
					currentUser={currentUser}
					onUpdateProfileImage={onUpdateProfileImage}
				/>
			) : (
				<OnboardSpotify
					isXsScreen={isXsScreen}
					isSmScreen={isSmScreen}
					isMdScreen={isMdScreen}
					classes={classes}
					currentUser={currentUser}
					onGetSpotifyUserAuth={onGetSpotifyUserAuth}
				/>
			)}
			<Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert
					onClose={handleCloseSnackbar}
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
	currentUser: state.user.currentUser,
	userError: state.user.error,
	userLoading: state.user.loading,
	genres: state.discovery.genres
});

const mapDispatchToProps = dispatch => ({
	onGetSpotifyUserAuth: (userId, source) => dispatch(getSpotifyUserAuth(userId, source)),
	onEmailVerificationSuccess: emailVerified => dispatch(emailVerificationSuccess(emailVerified)),
	onEmailVerificationFailure: (emailVerified, error) =>
		dispatch(emailVerificationFailure(emailVerified, error)),
	onUpdateDisplayName: (userId, displayName) =>
		dispatch(handleUpdateDisplayName(userId, displayName)),
	onUpdateBirthday: (userId, date) => dispatch(handleUpdateBirthday(userId, date)),
	onUpdatePreferredGenres: (userId, genres) =>
		dispatch(handleUpdatePreferredGenres(userId, genres)),
	onUpdateUserType: (userId, userType) => dispatch(handleUpdateUserType(userId, userType)),
	onUpdateUserProfession: (userId, profession) =>
		dispatch(handleUpdateUserProfession(userId, profession)),
	onUpdateProfileImage: (userId, imageFile) =>
		dispatch(handleUpdateProfileImage(userId, imageFile))
});

export default connect(mapStateToProps, mapDispatchToProps)(Onboard);
