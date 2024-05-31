import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import {
	Alert,
	Autocomplete,
	Avatar,
	Box,
	Button,
	Card,
	Chip,
	IconButton,
	Snackbar,
	TextField,
	Tooltip,
	Typography,
	keyframes,
	useMediaQuery
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import SyncIcon from '@mui/icons-material/Sync';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DropzoneDialog } from 'mui-file-dropzone';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import useStyles from '../../classes/playlist';
import theme from '../../theme';
import { toCapitalCase } from '../../utils';
import {
	SpotifyAuth,
	getSpotifyGenres,
	handleUpdateProfileImage,
	handleUpdateUserProfile,
	getUserProfile,
	getSpotifyUserAuth
} from '../../thunks';
import { useDispatch } from 'react-redux';
import { AddImageIcon } from './Onboard';
import spotifyIcon from '../../../public/images/Spotify_Icon_RGB_White.png';
import spotifyGreenIcon from '../../../public/images/Spotify_Icon_RGB_Green.png';
import { confirmSpotifyAccess } from '../../actions';

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

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const overrideTheme = createTheme({
	components: {
		MuiDialog: {
			styleOverrides: {
				paper: {
					backgroundColor: 'rgba(13, 27, 38, 0.9)',
					borderRadius: '18px'
				}
			}
		},
		MuiButton: {
			styleOverrides: {
				root: {
					color: 'white',
					transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
					'&:hover, &:active, &.MuiFocusVisible': {
						backgroundColor: 'transparent'
					},
					[theme.breakpoints.down('md')]: {
						padding: '0',
						height: '5%',
						minWidth: '54px'
					}
				},
				containedPrimary: {
					backgroundColor: 'rgb(44, 216, 207, 0.3)',
					border: '2px solid rgba(89, 149, 192, 0.5)',
					borderRadius: '18px',
					boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
					'&:hover, &:active, &.MuiFocusVisible': {
						border: '2px solid rgba(89, 149, 192, 0.5)',
						backgroundColor: 'rgb(44, 216, 207, 0.5)',
						boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)'
					},
					'&.Mui-disabled': {
						backgroundColor: 'rgba(44, 216, 207, 0.3)', // Adjust color for disabled state as needed
						color: 'rgba(0, 0, 0, 0.5)', // Adjust text color for disabled state as needed
						border: '2px solid transparent',
						boxShadow: 'none'
					}
				}
			}
		}
	}
});

const UserAvatar = ({ currentUser, isSmScreen, isXsScreen }) => {
	const avatarSize = isXsScreen ? 32 : 48;
	const hasImage = Boolean(currentUser?.user?.profileImage);

	return (
		<Avatar
			src={hasImage ? currentUser?.user?.profileImage : undefined}
			alt={hasImage ? currentUser?.user?.displayName : 'User Avatar'}
			sx={{
				width:
					hasImage && isXsScreen
						? 125
						: hasImage && isSmScreen
						? 175
						: hasImage
						? 200
						: avatarSize,
				height:
					hasImage && isXsScreen
						? 125
						: hasImage && isSmScreen
						? 175
						: hasImage
						? 200
						: avatarSize,
				backgroundColor: !hasImage ? theme.palette.primary.triadic1 : undefined,
				opacity: !hasImage ? '0.7' : undefined
			}}
		>
			{!hasImage && (
				<Typography variant='h6' style={{ color: 'white' }}>
					{currentUser?.user?.displayName?.[0]}
				</Typography>
			)}
		</Avatar>
	);
};

const UserInfo = ({ fieldLabel, fieldValue, handleValueChange, isXsScreen }) => {
	const hasValue = Boolean(fieldValue);
	const [fieldDisabled, setFieldDisabled] = useState(true);

	const handleEditClick = () => {
		setFieldDisabled(!fieldDisabled);
	};

	const textFieldRef = useRef(null);

	useEffect(() => {
		if (!fieldDisabled && textFieldRef.current) {
			const input = textFieldRef.current.querySelector('input');
			if (input) {
				input.focus();
			}
		}
	}, [fieldDisabled]);

	return (
		<Box display='flex' alignItems='center' paddingTop={isXsScreen ? '3%' : 0}>
			{fieldLabel === 'Birth Date' ? (
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DateField
						ref={textFieldRef}
						autoFocus
						disabled={fieldDisabled}
						label={fieldLabel}
						value={fieldValue ? dayjs(fieldValue) : undefined}
						variant='standard'
						onChange={handleValueChange}
						onBlur={() => setFieldDisabled(true)}
						sx={{
							width: isXsScreen ? '40vw' : '25vw',
							'& .MuiInputLabel-root': {
								top: 4,
								left: '12px',
								zIndex: 1,
								transform: hasValue
									? 'translate(0, -30%) scale(0.75)'
									: 'translate(0, 4px)',
								color: 'rgba(255, 255, 255, 0.7)',
								'&.Mui-focused': {
									transform: 'translate(0, -30%) scale(0.75)',
									color: theme.palette.primary.main
								}
							},
							'& .MuiInputBase-root': {
								color: 'white',
								backgroundColor: '#30313d',
								borderRadius: '18px',
								boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
								height: '35px',
								mt: 0
							},
							'& .MuiInputBase-input': {
								color: 'white',
								fontSize: isXsScreen ? '0.75rem' : '1rem',
								padding: '3% 4% 0'
							},
							'& .MuiInputBase-input.Mui-disabled': {
								color: 'rgba(255, 255, 255, 0.7)',
								WebkitTextFillColor: 'rgba(255, 255, 255, 0.7)'
							},
							'& .MuiInput-underline:before': {
								borderBottomColor: 'transparent'
							},
							'& .MuiInput-underline:hover:not(.Mui-disabled):before': {
								borderBottomColor: 'transparent'
							},
							'& .MuiInputLabel-outlined[data-shrink="false"]': {
								transform: fieldValue
									? 'translate(14px, -6px) scale(0.75)'
									: 'translate(10px, 12px) scale(1)'
							},
							'& .MuiInput-underline:after': {
								// Removes the underline
								borderBottom: 'none'
							}
						}}
					/>
				</LocalizationProvider>
			) : (
				<TextField
					ref={textFieldRef}
					label={fieldLabel}
					variant='standard'
					disabled={fieldDisabled}
					value={fieldValue}
					onChange={handleValueChange}
					onBlur={() => setFieldDisabled(true)}
					sx={{
						maxHeight: '35px',
						width: '25vw',
						[theme.breakpoints.down('md')]: {
							width: '35vw'
						},
						[theme.breakpoints.down('sm')]: {
							width: '40vw'
						},
						backgroundColor: '#30313d',
						color: 'white',
						borderRadius: '18px',
						boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
						'.MuiInputBase-input.Mui-disabled': {
							color: 'rgba(255, 255, 255, 0.7)',
							WebkitTextFillColor: 'rgba(255, 255, 255, 0.7)'
						},
						...(hasValue
							? {
									input: {
										color: 'white',
										fontSize: isXsScreen ? '0.75rem' : '1rem'
									}
							  }
							: {
									'.MuiInputBase-input': {
										padding: '8px 0'
									},
									'& .Mui-focused .MuiInputBase-input': {
										padding: '0'
									}
							  })
					}}
					InputLabelProps={{
						...(hasValue
							? {
									style: {
										margin: '0 3%',
										color: fieldDisabled
											? 'rgba(255, 255, 255, 0.7)'
											: theme.palette.primary.main
									}
							  }
							: {
									sx: {
										color: 'white',
										transform: 'translate(14px, 10px) scale(1)',
										'&.Mui-focused': {
											transform: 'translate(14px, 0) scale(0.75)'
										},
										'&.MuiInputLabel-shrink': {
											transform: 'translate(14px, 0) scale(0.75)'
										},
										backgroundColor: '#30313d',
										letterSpacing: '1px',
										maxWidth: 'calc(100% - 24px)'
									}
							  })
					}}
					InputProps={{
						disableUnderline: true,
						...(hasValue
							? {
									style: {
										margin: '2px 3%',
										padding: '2% 0',
										fill: 'white'
									},
									sx: {
										color: 'white',
										letterSpacing: '1px'
									}
							  }
							: {
									sx: {
										paddingLeft: '14px'
									}
							  })
					}}
				/>
			)}
			{fieldLabel !== 'Email' && (
				<Tooltip
					title={
						<div
							style={{
								maxHeight: '25vh',
								overflowY: 'auto',
								padding: '8px',
								borderRadius: '18px'
							}}
						>
							<Typography variant='body2' letterSpacing='1px'>
								{fieldValue ? `Edit ${fieldLabel}` : `Add ${fieldLabel}`}
							</Typography>
						</div>
					}
				>
					{fieldValue ? (
						<EditIcon
							onClick={handleEditClick}
							sx={{
								paddingLeft: '1%',
								color: 'white',
								opacity: '0.7',
								cursor: 'pointer',
								'&:hover': {
									opacity: '1'
								}
							}}
						/>
					) : (
						<AddCircleIcon
							onClick={handleEditClick}
							sx={{
								paddingLeft: '1%',
								color: theme.palette.primary.main,
								opacity: '0.7',
								cursor: 'pointer',
								'&:hover': {
									opacity: '1'
								}
							}}
						/>
					)}
				</Tooltip>
			)}
		</Box>
	);
};

const UserDetailsField = ({
	label,
	value,
	hasValue,
	handleValueChange,
	fieldDisabled,
	setFieldDisabled,
	isXsScreen
}) => {
	const textFieldRef = useRef(null);

	useEffect(() => {
		if (!fieldDisabled && textFieldRef.current) {
			const input = textFieldRef.current.querySelector('input');
			if (input) {
				input.focus();
			}
		}
	}, [fieldDisabled]);

	return (
		<TextField
			ref={textFieldRef}
			label={label}
			variant='standard'
			value={value || ''}
			disabled={fieldDisabled}
			onChange={handleValueChange}
			onBlur={() => setFieldDisabled(true)}
			sx={{
				my: 1,
				maxHeight: '35px',
				width: '90%',
				[theme.breakpoints.down('sm')]: {
					width: '80%'
				},
				backgroundColor: '#30313d',
				borderRadius: '18px',
				boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
				'.MuiInputBase-input.Mui-disabled': {
					color: 'rgba(255, 255, 255, 0.7)',
					WebkitTextFillColor: 'rgba(255, 255, 255, 0.7)'
				},
				...(hasValue
					? {}
					: {
							'.MuiInputBase-input': {
								padding: '8px 0'
							},
							'& .Mui-focused .MuiInputBase-input': {
								padding: '0'
							}
					  }),
				color: 'white'
			}}
			InputLabelProps={{
				...(hasValue
					? {
							style: {
								margin: '0 3%',
								color: fieldDisabled
									? 'rgba(255, 255, 255, 0.7)'
									: theme.palette.primary.main
							}
					  }
					: {
							sx: {
								color: 'white',
								fontSize: isXsScreen ? '0.75rem' : '1rem',
								transform: 'translate(14px, 10px) scale(1)',
								'&.Mui-focused': {
									transform: 'translate(14px, 0) scale(0.75)'
								},
								'&.MuiInputLabel-shrink': {
									transform: 'translate(14px, 0) scale(0.75)'
								},
								backgroundColor: '#30313d',
								letterSpacing: '1px',
								maxWidth: 'calc(100% - 24px)'
							}
					  })
			}}
			InputProps={{
				disableUnderline: true,
				...(hasValue
					? {
							style: {
								margin: '2px 3%',
								padding: isXsScreen ? '5% 0' : '2% 0',
								fill: 'white'
							},
							sx: {
								color: 'white',
								letterSpacing: '1px',
								fontSize: isXsScreen ? '0.75rem' : '1rem'
							}
					  }
					: {
							sx: {
								paddingLeft: '14px'
							}
					  })
			}}
		/>
	);
};

const UserDetails = ({
	fieldLabel,
	fieldValue,
	handleValueChange,
	handleAddClick,
	userType,
	isXsScreen
}) => {
	const hasValue = Boolean(fieldValue);

	const [fieldDisabled, setFieldDisabled] = useState(true);

	const handleEditClick = () => {
		setFieldDisabled(!fieldDisabled);
	};

	const textFieldRef = useRef(null);

	useEffect(() => {
		if (!fieldDisabled && textFieldRef.current) {
			const input = textFieldRef.current.querySelector('input');
			if (input) {
				input.focus();
			}
		}
	}, [fieldDisabled]);

	const userTypeOptions = ['Fan', 'Professional'];

	return (
		<Box display='flex' alignItems='center'>
			{fieldLabel === 'User Type' ? (
				<Autocomplete
					selectOnFocus
					clearOnBlur
					handleHomeEndKeys
					ref={textFieldRef}
					value={fieldValue}
					disabled={fieldDisabled}
					onChange={handleValueChange}
					onBlur={() => setFieldDisabled(true)}
					options={userTypeOptions}
					ListboxProps={{
						sx: {
							...root,
							padding: 0
						}
					}}
					sx={{
						width: '100%',
						maxHeight: '35px',
						[theme.breakpoints.down('sm')]: {
							width: '80%'
						},
						input: {
							color: 'white'
						},
						backgroundColor: '#30313d',
						color: 'white',
						borderRadius: '18px',
						boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)'
					}}
					renderOption={(props, option) => {
						return (
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
						);
					}}
					renderInput={params => (
						<TextField
							{...params}
							label='Select User Type'
							variant='standard'
							sx={{
								'& .MuiInput-underline:before': {
									borderBottom: 'none'
								},
								'& .MuiInput-underline:hover:not(.Mui-disabled):before': {
									borderBottom: 'none'
								},
								'& .MuiInput-underline:after': {
									borderBottom: 'none'
								}
							}}
							InputLabelProps={{
								...(hasValue
									? {
											style: {
												margin: '2px 3%',
												color: fieldDisabled
													? 'rgba(255, 255, 255, 0.7)'
													: theme.palette.primary.main
											}
									  }
									: {
											sx: {
												paddingLeft: '1em',
												color: 'white'
											}
									  })
							}}
							InputProps={{
								...params.InputProps,
								endAdornment: null,
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
										fontSize: isXsScreen ? '0.75rem' : '1rem'
									},
									'&:before': {
										borderBottom: 'none'
									},
									'&:hover:not(.Mui-disabled):before': {
										borderBottom: 'none'
									},
									'.MuiInputBase-input.Mui-disabled': {
										color: 'rgba(255, 255, 255, 0.7)',
										WebkitTextFillColor: 'rgba(255, 255, 255, 0.7)'
									}
								}
							}}
						/>
					)}
				/>
			) : (
				<UserDetailsField
					label={fieldLabel}
					value={fieldValue}
					hasValue={hasValue}
					handleValueChange={handleValueChange}
					fieldDisabled={fieldDisabled}
					setFieldDisabled={setFieldDisabled}
					isXsScreen={isXsScreen}
				/>
			)}
			<Tooltip
				title={
					<div
						style={{
							maxHeight: '25vh',
							overflowY: 'auto',
							padding: '8px',
							borderRadius: '18px'
						}}
					>
						<Typography variant='body2' letterSpacing='1px'>
							{fieldValue && fieldLabel !== 'Tokens'
								? `Edit ${fieldLabel}`
								: fieldLabel === 'Tokens'
								? `Get more tokens`
								: fieldLabel === 'Profession' && userType === 'Fan'
								? `This field only applies to professional users`
								: `Add ${fieldLabel}`}
						</Typography>
					</div>
				}
			>
				{fieldValue && fieldLabel !== 'Tokens' ? (
					<EditIcon
						onClick={handleEditClick}
						sx={{
							paddingLeft: '1%',
							color: 'white',
							opacity: '0.7',
							cursor: 'pointer',
							'&:hover': {
								opacity: '1'
							}
						}}
					/>
				) : (
					<AddCircleIcon
						onClick={fieldLabel === 'Tokens' ? handleAddClick : handleEditClick}
						sx={{
							paddingLeft: '1%',
							color:
								fieldLabel === 'Profession' && userType === 'Fan'
									? 'rgb(210,220,225, 0.6)'
									: theme.palette.primary.main,
							opacity: '0.7',
							cursor:
								!(fieldLabel === 'Profession' && userType === 'Fan') && 'pointer',
							'&:hover': {
								opacity: !(fieldLabel === 'Profession' && userType === 'Fan') && '1'
							}
						}}
					/>
				)}
			</Tooltip>
		</Box>
	);
};

export const PreferredGenres = ({
	accessToken,
	expiresAt,
	classes,
	selectedGenres,
	handleGenreChange,
	genreOptions
}) => {
	const dispatch = useDispatch();

	useEffect(() => {
		if (accessToken) {
			dispatch(getSpotifyGenres(accessToken, expiresAt));
		}
	}, [dispatch, accessToken, expiresAt]);

	const hasValue = Boolean(selectedGenres.length);
	const [fieldDisabled, setFieldDisabled] = useState(true);

	const handleEditClick = () => {
		setFieldDisabled(!fieldDisabled);
	};

	const textFieldRef = useRef(null);

	useEffect(() => {
		if (!fieldDisabled && textFieldRef.current) {
			const input = textFieldRef.current.querySelector('input');
			if (input) {
				input.focus();
			}
		}
	}, [fieldDisabled]);

	return (
		<Box display='flex' alignItems='center' width='100%'>
			<Autocomplete
				freeSolo
				multiple
				disabled={fieldDisabled}
				filterSelectedOptions
				selectOnFocus
				clearOnBlur
				handleHomeEndKeys
				ref={textFieldRef}
				onBlur={() => setFieldDisabled(true)}
				value={selectedGenres.map(genre => {
					if (typeof genre === 'string') {
						return toCapitalCase(genre);
					} else if (typeof genre === 'object' && genre !== null && genre.name) {
						return toCapitalCase(genre.name);
					} else {
						return null;
					}
				})}
				onChange={handleGenreChange}
				options={genreOptions || []}
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
						label={'Select Genres'}
						variant='standard'
						InputLabelProps={{
							sx: {
								paddingLeft: '1em',
								color: 'white',
								letterSpacing: '1px',
								top: '-5px'
							}
						}}
						InputProps={{
							...params.InputProps,
							style: {
								margin: '5px 0',
								padding: '0',
								fill: 'white'
							},
							sx: {
								...params.InputProps.sx,
								color: 'white',
								'& .MuiInputBase-input': {
									color: 'white',
									fontSize: '1rem',
									padding: '0',
									height: 'auto'
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
				renderTags={(value, getTagProps) => (
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							overflow: 'auto',
							maxHeight: '12em'
						}}
					>
						{value.map((option, index) => (
							<Chip
								key={`${option}`}
								label={option}
								{...getTagProps({ index })}
								sx={{
									color: 'white',
									backgroundColor: '#006f96',
									'& .MuiChip-deleteIcon': {
										color: 'white'
									},
									'& .MuiChip-deleteIcon:hover': {
										color: '#00435a'
									}
								}}
							/>
						))}
					</Box>
				)}
			/>
			<Tooltip
				title={
					<div
						style={{
							maxHeight: '25vh',
							overflowY: 'auto',
							padding: '8px',
							borderRadius: '18px'
						}}
					>
						<Typography variant='body2' letterSpacing='1px'>
							{hasValue ? `Edit genres` : `Add genres`}
						</Typography>
					</div>
				}
			>
				{hasValue ? (
					<EditIcon
						onClick={handleEditClick}
						sx={{
							paddingLeft: '1%',
							color: 'white',
							opacity: '0.7',
							cursor: 'pointer',
							'&:hover': {
								opacity: '1'
							}
						}}
					/>
				) : (
					<AddCircleIcon
						onClick={handleEditClick}
						sx={{
							paddingLeft: '1%',
							color: theme.palette.primary.main,
							opacity: '0.7',
							cursor: 'pointer',
							'&:hover': {
								opacity: '1'
							}
						}}
					/>
				)}
			</Tooltip>
		</Box>
	);
};

export const Profile = ({
	currentUser,
	currentUserProfile,
	genres,
	userError,
	userLoading,
	onUpdateProfileImage,
	onSaveUserProfile,
	onGetUserProfile,
	onGetSpotifyUserAuth
}) => {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState('info');

	const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

	const classes = useStyles();
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();

	const [displayNameValue, setDisplayNameValue] = useState(currentUser?.user?.displayName);
	const [birthDateValue, setBirthDateValue] = useState(currentUser?.user?.birthday);

	const [initialBadges, setInitialBadges] = useState(
		currentUserProfile?.achievements.map(achievment => achievment.badge)
	);

	const [userTypeValue, setUserTypeValue] = useState('Fan');
	const [professionValue, setProfessionValue] = useState(currentUser?.user?.professionValue);

	const [selectedGenres, setSelectedGenres] = useState(
		currentUser?.user?.preferredGenres.map(genre => {
			if (typeof genre === 'object' && genre.name) {
				return genre.name;
			} else {
				return genre;
			}
		})
	);

	useEffect(() => {
		onGetUserProfile(currentUser?.user?.id);
		setInitialBadges(currentUserProfile?.achievements.map(achievment => achievment.badge));
	}, [currentUser?.user?.id]);

	useEffect(() => {
		if (currentUser?.user?.displayName) {
			setDisplayNameValue(currentUser?.user?.displayName);
		}
	}, [currentUser?.user?.displayName]);

	useEffect(() => {
		if (currentUser?.user?.birthday) {
			setBirthDateValue(currentUser?.user?.birthday);
		}
	}, [currentUser?.user?.birthday]);

	useEffect(() => {
		if (currentUser?.user?.userType) {
			setUserTypeValue(toCapitalCase(currentUser?.user?.userType));
		}
	}, [currentUser?.user?.userType]);

	useEffect(() => {
		if (currentUser?.user?.profession) {
			setProfessionValue(currentUser?.user?.profession);
		}
	}, [currentUser?.user?.profession]);

	useEffect(() => {
		if (currentUser?.user?.preferredGenres) {
			setSelectedGenres(
				currentUser?.user?.preferredGenres.map(genre => {
					if (typeof genre === 'object' && genre.name) {
						return genre.name;
					} else {
						return genre;
					}
				})
			);
		}
	}, [currentUser?.user?.preferredGenres]);

	const handleDisplayNameChange = e => {
		setDisplayNameValue(e.target.value);
	};

	const handleBirthDateChange = newValue => {
		setBirthDateValue(newValue);
	};

	const handleUserTypeChange = (e, newValue) => {
		setUserTypeValue(newValue);
	};

	const handleProfessionChange = e => {
		if (userTypeValue === 'Professional') {
			setProfessionValue(e.target.value);
		}
	};

	const handleGenreChange = (event, newValue) => {
		setSelectedGenres(newValue);
	};

	const handleConnectThroughSpotify = async (e, source) => {
		e.preventDefault();
		await onGetSpotifyUserAuth(currentUser.user.id, source); // call the thunk with the user id
	};

	const handleAddTokens = () => {
		navigate('/pricing');
	};

	const [openDropzone, setOpenDropzone] = useState(false);
	const handleOpenDropzone = () => {
		setOpenDropzone(!openDropzone);
	};

	const maxFileSize = 5 * 1048576;

	const onSubmitImage = async imageFile => {
		// eslint-disable-next-line no-unused-vars
		const image = await onUpdateProfileImage(currentUser?.user?.id, imageFile);
	};

	const handleSave = async () => {
		try {
			const userInfo = {
				display_name: displayNameValue,
				birth_date: birthDateValue,
				user_type: userTypeValue,
				profession: professionValue,
				genres: selectedGenres
			};

			await onSaveUserProfile(currentUser?.user?.id, userInfo);
			const updatedProfile = await onGetUserProfile(currentUser?.user?.id);

			const initialBadgeNames = new Set(initialBadges?.map(badge => badge.name));
			const newBadges = updatedProfile.achievements.filter(
				achievement => !initialBadgeNames.has(achievement.badge.name)
			);

			navigate('/', {
				state: {
					profileUpdated: true,
					newBadgeEarned: newBadges.length
				}
			});
		} catch (error) {
			console.error('Failed to save user profile:', error);
			setSnackbarMessage('Failed to save user profile.');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		}
	};

	useEffect(() => {
		if (userError) {
			setDisplayNameValue(currentUser?.user?.displayName);
			setBirthDateValue(currentUser?.user?.birthday);
			setUserTypeValue(currentUser?.user?.userType);
			setProfessionValue(currentUser?.user?.profession);
			setSelectedGenres(
				currentUser?.user?.preferredGenres.map(genre => {
					if (typeof genre === 'object' && genre.name) {
						return genre.name;
					} else {
						return genre;
					}
				})
			);

			setSnackbarMessage(userError);
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		}
	}, [userLoading, userError]);

	const genreOptions = genres.map(genre => toCapitalCase(genre));

	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setSnackbarOpen(false);
	};

	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const code = searchParams.get('code');
		const encodedState = searchParams.get('state');
		let source = 'default';

		if (encodedState) {
			try {
				const decodedState = window.atob(encodedState);
				const parts = decodedState.split('|');
				if (parts.length === 2) {
					source = parts[1];
				}
			} catch (error) {
				console.error('Error decoding state:', error);
			}
		}

		if (code) {
			fetchUserProfile(code, encodedState, source);
			searchParams.delete('code');
			searchParams.delete('state');
			navigate(
				{
					pathname: location.pathname,
					search: `?${searchParams.toString()}`
				},
				{ replace: true }
			);
		}
	}, [location.search]);

	let fetchCalled = false;

	// eslint-disable-next-line no-unused-vars
	const fetchUserProfile = async (code, encodedState, source) => {
		if (fetchCalled) return;
		fetchCalled = true;

		try {
			const userId = currentUser.user.id;
			const response = await fetch(
				`http://localhost:8000/auth/spotify/callback?code=${code}&state=${encodedState}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'User-Id': userId
					}
				}
			);
			const data = await response.json();

			if (data.spotify_connected) {
				dispatch(confirmSpotifyAccess(true));
			}
		} catch (error) {
			console.error('Error fetching user profile:', error);
		} finally {
			fetchCalled = false; // Reset flag in case of retry
		}
	};

	return (
		<Box
			sx={{
				margin: 'auto',
				padding: { xs: '5%', sm: '3%', md: '2%' },
				width: {
					xs: '80%',
					sm: '80%',
					md: '70%',
					lg: '60%',
					xl: '50%'
				},
				height: 'auto',
				maxWidth: '768px',
				maxHeight: '650px',
				aspectRatio: '4 / 5',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-around',
				alignItems: 'center',
				border: '2px solid rgba(89, 149, 192, 0.5)',
				borderRadius: '18px',
				background: 'rgba(48, 130, 164, 0.15)',
				boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)'
			}}
		>
			<Typography
				variant={isXsScreen ? 'h6' : 'h5'}
				color={theme.palette.primary.whitesmoke}
				letterSpacing={isXsScreen ? '35px' : '50px'}
				textAlign='center'
				paddingLeft='10%'
			>
				{'PROFILE'}
			</Typography>
			<Box
				display='flex'
				flexDirection='row'
				justifyContent='space-between'
				width={isXsScreen ? '110%' : '100%'}
			>
				<Box
					sx={{
						position: 'relative',
						width: isXsScreen ? 'calc(125px)' : 'calc(200px + 26px)', // Avatar size plus gradient border
						height: isXsScreen ? 'calc(125px)' : 'calc(200px + 26px)', // Avatar size plus gradient border
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: '50%',
						padding: '3px', // Controls the thickness of the gradient border
						'&::before, &::after': {
							content: '""',
							position: 'absolute',
							borderRadius: '50%',
							zIndex: -1
						},
						'&::before': {
							top: '-3px', // Align with the outer border
							left: '-3px', // Align with the outer border
							right: '-3px', // Align with the outer border
							bottom: '-3px', // Align with the outer border
							background: `radial-gradient(
                                at bottom right,
                                rgba(0, 0, 0, 1) 0%,
                                rgba(40, 42, 53, 0.8) 40%,
                                rgba(48, 49, 61, 0.8) 75%,
                                rgba(128, 128, 128, 0.6) 100%
                            )`,
							animation: `${rotate} 17s linear infinite` // Apply the animation
						},
						'&::after': {
							width: '8px', // Size of the white dot
							height: '8px', // Size of the white dot
							background: 'white',
							// Position the dot initially at the top center of the border
							top: isXsScreen ? '-8px' : '-8px', // Slightly more than the padding to sit on the gradient border
							left: isXsScreen ? '50%' : '48%',
							// Adjust the transform origin to the center of the avatar
							transform: isXsScreen
								? 'translate(-50%, -50%) rotate(0deg)'
								: 'translate(-50%, 0) rotate(0deg)', // Centers the dot
							transformOrigin: isXsScreen
								? '50% calc(50% + 68px)'
								: '50% calc(100% + 116px)', // Move the origin to the bottom center of the box
							animation: `${rotate} 35s linear infinite`,
							zIndex: 1 // Ensures the dot is above the gradient but below the avatar
						}
					}}
				>
					<UserAvatar
						currentUser={currentUser}
						isSmScreen={isSmScreen}
						isXsScreen={isXsScreen}
					/>
					<Tooltip
						title={
							<div
								style={{
									maxHeight: '25vh',
									overflowY: 'auto',
									padding: '8px',
									borderRadius: '18px'
								}}
							>
								<Typography variant='body2' letterSpacing='1px'>
									{!currentUser?.user?.profileImage
										? `Add a profile image`
										: 'Update profile image'}
								</Typography>
							</div>
						}
					>
						<IconButton
							onClick={handleOpenDropzone}
							sx={{
								position: 'absolute',
								// Position the icon to the bottom right of the Avatar
								bottom: 0,
								left: 90,
								// Adjust these values as necessary to position the icon correctly over the Avatar
								transform: !currentUser?.user?.profileImage
									? 'translate(0%, -85%)'
									: isSmScreen
									? 'translate(0%, -50%)'
									: isXsScreen
									? 'translate(-70%, 7%)'
									: 'translate(10%, -30%)', // Adjust if necessary
								borderRadius: '50%',
								// Styles for the icon button (you can adjust size, border, etc.)
								width: '48px', // Example size
								height: '48px', // Example size
								'.MuiIconButton-root': {
									'&:hover': {
										backgroundColor: 'white' // Change as desired
									}
								}
							}}
						>
							{!currentUser?.user?.profileImage ? (
								<AddCircleOutlineIcon
									sx={{
										fontSize: '3rem',
										color: 'rgb(210,220,225, 0.6)',
										'&:hover': {
											color: 'rgb(210,220,225, 1)'
										}
									}}
								/>
							) : (
								<EditIcon
									sx={{
										fontSize: '3rem',
										color: 'white',
										opacity: '0.8',
										'&:hover': {
											opacity: '1'
										}
									}}
								/>
							)}
						</IconButton>
					</Tooltip>
					<ThemeProvider theme={overrideTheme}>
						<DropzoneDialog
							acceptedFiles={['image/*']}
							cancelButtonText={'cancel'}
							submitButtonText={'submit'}
							filesLimit={1}
							maxFileSize={maxFileSize}
							open={openDropzone}
							onClose={() => setOpenDropzone(false)}
							dropzoneClass={classes.dropzone}
							Icon={AddImageIcon}
							dialogTitle={<span style={{ color: 'whitesmoke' }}>Upload file</span>}
							onSave={fileArray => {
								onSubmitImage(fileArray[0]);
								setOpenDropzone(false);
							}}
							showPreviews={false}
							showPreviewsInDropzone={true}
							previewGridClasses={{
								container: classes.imagePreviewContainer
							}}
						/>
					</ThemeProvider>
				</Box>
				<Box
					display='flex'
					flexDirection='column'
					justifyContent='space-around'
					p={isXsScreen ? '0' : '2% 0'}
				>
					<Typography
						color={'white'}
						sx={{
							mt: isXsScreen ? 0 : 1,
							letterSpacing: isXsScreen ? '1px' : '2px'
						}}
						variant={isXsScreen ? 'body1' : 'h6'}
					>
						{`User Info:`}
					</Typography>
					<UserInfo
						fieldLabel={'Display Name'}
						fieldValue={displayNameValue}
						handleValueChange={handleDisplayNameChange}
						isXsScreen={isXsScreen}
					/>
					<UserInfo
						fieldLabel={'Birth Date'}
						fieldValue={birthDateValue}
						handleValueChange={handleBirthDateChange}
						isXsScreen={isXsScreen}
					/>
					<UserInfo
						fieldLabel={'Email'}
						fieldValue={currentUser?.user?.email}
						handleValueChange={null}
						isXsScreen={isXsScreen}
					/>
				</Box>
			</Box>
			<Box display='flex' flexDirection='column' alignItems='center' width='100%'>
				<Typography
					color={'white'}
					sx={{
						letterSpacing: '5px',
						pt: isXsScreen ? 1 : 0
					}}
					variant={isXsScreen ? 'body1' : 'h6'}
				>
					{'ACHIEVEMENTS'}
				</Typography>
				<Box display='flex' justifyContent='center'>
					{currentUserProfile?.achievements.length ? (
						currentUserProfile?.achievements.map(achievement => (
							<Tooltip
								key={`${achievement.badge.name}`}
								title={
									<div
										style={{
											maxHeight: '25vh',
											overflowY: 'auto',
											padding: '8px',
											borderRadius: '18px'
										}}
									>
										<Typography variant='body2' letterSpacing='1px'>
											{achievement.badge.description}
										</Typography>
									</div>
								}
							>
								<img
									loading='lazy'
									src={achievement.badge.image_url}
									alt={achievement.badge.name}
									style={{
										width: isXsScreen ? '20%' : isSmScreen ? '15%' : '10%',
										paddingRight: isXsScreen ? '2%' : isSmScreen ? '4%' : '15px'
									}}
								/>
							</Tooltip>
						))
					) : (
						<Typography variant='caption' color='rgba(255, 255, 255, 0.7)'>
							{'*Complete your user profile to unlock your first achievement'}
						</Typography>
					)}
				</Box>
			</Box>
			<Box
				display='flex'
				flexDirection='row'
				justifyContent='space-around'
				width={isXsScreen ? '110%' : '100%'}
			>
				<Box
					display='flex'
					flexDirection='column'
					justifyContent='center'
					alignItems='flex-start'
					width={isXsScreen ? '100%' : '85%'}
					paddingLeft={isXsScreen ? 0 : 1}
				>
					<Typography
						color={'white'}
						variant={isXsScreen ? 'body1' : 'h6'}
						sx={{
							my: 2,
							letterSpacing: isXsScreen ? '1px' : '2px'
						}}
					>
						{`User Details:`}
					</Typography>
					<Box
						display='flex'
						flexDirection='column'
						justifyContent='flex-start'
						width='95%'
						mt={-2}
					>
						<UserDetails
							fieldLabel={'User Type'}
							fieldValue={userTypeValue}
							userType={userTypeValue}
							handleValueChange={handleUserTypeChange}
							handleAddClick={null}
							isXsScreen={isXsScreen}
						/>
						<UserDetails
							fieldLabel={'Profession'}
							fieldValue={professionValue}
							userType={userTypeValue}
							handleValueChange={handleProfessionChange}
							handleAddClick={null}
							isXsScreen={isXsScreen}
						/>
						<UserDetails
							fieldLabel={'Tokens'}
							fieldValue={currentUser?.user?.tokens}
							userType={userTypeValue}
							handleValueChange={null}
							handleAddClick={handleAddTokens}
							isXsScreen={isXsScreen}
						/>
						<UserDetailsField
							label={'XP'}
							value={`${currentUser?.user?.karma}/1000`}
							hasValue={true}
							handleValueChange={null}
							fieldDisabled={true}
							setFieldDisabled={null}
							isXsScreen={isXsScreen}
						/>
					</Box>
				</Box>
				<Box
					display='flex'
					flexDirection='column'
					justifyContent='flex-start'
					alignItems='flex-start'
					width='100%'
					pt={isXsScreen ? 0 : 2}
				>
					<Typography
						color={'white'}
						variant={isXsScreen ? 'body1' : 'h6'}
						sx={{
							mt: 2,
							lineHeight: '1.2',
							letterSpacing: isXsScreen ? '1px' : '2px'
						}}
					>
						{`Preferred Genres:`}
					</Typography>
					<SpotifyAuth>
						{(accessToken, expiresAt) => {
							return (
								<PreferredGenres
									accessToken={accessToken}
									expiresAt={expiresAt}
									classes={classes}
									selectedGenres={selectedGenres}
									genreOptions={genreOptions}
									handleGenreChange={handleGenreChange}
								/>
							);
						}}
					</SpotifyAuth>
				</Box>
			</Box>
			<Box
				display='flex'
				flexDirection='row'
				justifyContent='center'
				alignItems='center'
				pb={1}
			>
				{currentUser?.user?.spotifyConnected ? (
					<Box display='flex' alignItems='center'>
						<Box
							sx={{
								width: '40px', // Adjust the size as needed
								height: '40px', // Ensure this is the same as width for a circle
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								borderRadius: '50%', // Makes the box circular
								overflow: 'hidden', // Ensures nothing spills outside the circle
								marginRight: '16px' // Adds spacing between icon and text
							}}
						>
							<img
								loading='lazy'
								src={spotifyGreenIcon}
								style={{
									width: '100%', // Makes the image fill the container
									height: 'auto' // Maintains aspect ratio
								}}
							/>
						</Box>
						<Typography
							color={'white'}
							variant={isXsScreen ? 'body1' : 'h6'}
							letterSpacing='1px'
						>
							{`Connected to Spotify`}
						</Typography>
						<Tooltip
							title={
								<div
									style={{
										maxHeight: '25vh',
										overflowY: 'auto',
										padding: '8px',
										borderRadius: '18px'
									}}
								>
									<Typography variant='body2' letterSpacing='1px'>
										{'Re-sync Spotify Connection'}
									</Typography>
								</div>
							}
						>
							<SyncIcon
								onClick={e => handleConnectThroughSpotify(e, 'profile')}
								sx={{
									paddingLeft: '10px',
									color: 'white',
									opacity: '0.7',
									cursor: 'pointer',
									'&:hover': {
										opacity: '1'
									}
								}}
							/>
						</Tooltip>
					</Box>
				) : (
					<Box>
						<Typography
							variant='subtitle2'
							color='rgb(210,220,225, 0.8)'
							textAlign='center'
						>
							{'*You are not connected to Spotify'}
						</Typography>
						<Tooltip
							title={
								<div
									style={{
										maxHeight: '25vh',
										overflowY: 'auto',
										padding: '8px',
										borderRadius: '18px'
									}}
								>
									<Typography variant='body2' letterSpacing='1px'>
										{'Connect to Spotify'}
									</Typography>
								</div>
							}
						>
							<Card
								onClick={e => handleConnectThroughSpotify(e, 'profile')}
								className={classes.panelCard}
								style={{
									display: 'flex',
									margin: '0 auto'
								}}
							>
								<Box padding='0 5% 0'>
									<Typography
										variant={isXsScreen ? 'caption' : 'subtitle1'}
										textAlign='center'
										letterSpacing='2px'
										color='white'
										sx={{
											fontWeight: 'bold',
											maxHeight: '30%',
											maxWidth: '100%',
											overflowY: 'auto',
											cursor: 'pointer'
										}}
									>
										{'Connect to Spotify'}
									</Typography>
								</Box>
								<img
									loading='lazy'
									src={spotifyIcon}
									style={{
										maxWidth: '8%',
										height: 'auto'
									}}
								/>
							</Card>
						</Tooltip>
					</Box>
				)}
			</Box>
			<Tooltip
				title={
					<div
						style={{
							maxHeight: '25vh',
							overflowY: 'auto',
							padding: '8px',
							borderRadius: '18px'
						}}
					>
						<Typography variant='body2' letterSpacing='1px'>
							{'Save updates to your profile'}
						</Typography>
					</div>
				}
			>
				<Button
					type='submit'
					variant='contained'
					onClick={handleSave}
					className={classes.button}
					sx={
						isXsScreen
							? {
									typography: {
										fontSize: '12px'
									}
							  }
							: {}
					}
				>
					{'Save Updates'}
				</Button>
			</Tooltip>
			<Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbarSeverity}
					sx={{ width: '100%' }}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</Box>
	);
};

const mapStateToProps = state => {
	return {
		currentUser: state.user.currentUser,
		genres: state.discovery.genres,
		userError: state.user.error,
		userLoading: state.user.loading,
		currentUserProfile: state.userProfile.currentUserProfile
	};
};

const mapDispatchToProps = dispatch => ({
	onGetSpotifyUserAuth: (userId, source) => dispatch(getSpotifyUserAuth(userId, source)),
	onUpdateProfileImage: (userId, imageFile) =>
		dispatch(handleUpdateProfileImage(userId, imageFile)),
	onSaveUserProfile: (userId, userInfo) => dispatch(handleUpdateUserProfile(userId, userInfo)),
	onGetUserProfile: userId => dispatch(getUserProfile(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
