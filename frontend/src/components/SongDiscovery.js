import React, { Suspense, lazy, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
	Alert,
	Box,
	Button,
	Modal,
	Snackbar,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip,
	Typography,
	useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { makeStyles } from '@mui/styles';
import {  
	confirmSpotifyAccess,
	getUserProfileSuccess,
	removeFromCurrentPlaylistById, setSelectedPlaylist,
} from '../actions';
import '../App.css';
import theme from '../theme'
import { LoadingState } from './LoadingState';
import { Body } from './Body';
import LeftPanel from './sidePanels/LeftPanel';
import RightPanel from './sidePanels/RightPanel';
import { initialDiscoveryState } from '../reducers';
import { saveRequestParameters } from '../thunks';
import { useLocation, useNavigate } from 'react-router-dom';

const Recommendations = lazy(() => import('./Recommendations'))
const SpotifyForm = lazy(() => import('./spotifyForm/SpotifyForm'))
const SaveQueryModal = lazy(() => import('./SaveQueryModal'))

const useStyles = makeStyles((theme) => (
	{
		root: {
			padding: '15px 0 5px',
			[theme.breakpoints.down('md')]: {
				padding: '0px',
			}
		},
		paper: {
			marginTop: '1vh',
			backgroundColor: '#30313d',
			width: '18%'
		},
		expanded: {
			'&.Mui-expanded': {
				margin: 0,
			},
		},
		card: {
			backgroundColor: "white",
			justifyContent: 'center',
			display: 'flex',
			width: '100%',
			marginTop: '2rem'
		},
		form: {
			display: 'flex',
			flexDirection: 'column',
			color: "#007fbf",
			width: '90%',
			border: '2px solid rgba(89, 149, 192, 0.5)',
			borderRadius: '18px',
			background: 'rgba(48, 130, 164, 0.15)',
			// background: 'rgba(196,213,228, 0.2)',
			boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
			padding: '0 2%',
		},
		panelCard: {
			display: 'flex', 
			width: '18vw',
			minHeight: 'fit-content', 
			padding: '0.5%',
			alignItems: 'center',
			justifyContent: 'center',
			overflow: 'hidden',
			margin: '1%',
			borderRadius: '8px',
			backgroundColor: '#282828',
			boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
			opacity: '0.8',
			'&:hover, &:active, &.MuiFocusVisible': {
				border: '2px solid rgba(89, 149, 192, 0.5)',
				background: 'rgba(48, 130, 164, 0.15)',
				boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
			},
			[theme.breakpoints.down('lg')]: {
				width: '25vw',
			},
			[theme.breakpoints.down('sm')]: {
				width: '50vw',
			},
		},
		buttonWithMargin: {
			margin: '4%',
			width: '22vw',
			height: '10vh', 
			[theme.breakpoints.down('md')] : {
				width: '80%',
			},
		},
		button: {
			color: 'white',
			backgroundColor: 'rgb(44, 216, 207, 0.3)',
			border: '2px solid rgba(89, 149, 192, 0.5)',
			borderRadius: '18px',
			boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
			transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
			'&:hover, &:active, &.MuiFocusVisible': {
				border: '2px solid rgba(89, 149, 192, 0.5)',
				backgroundColor: 'rgb(44, 216, 207, 0.5)',
				boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
			},
		},
		disabled: {
			color: 'grey',
			backgroundColor: 'rgb(44, 216, 207, 0.1)',
			border: '2px solid rgba(89, 149, 192, 0.5)',
			borderRadius: '18px',
			boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
			transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
			'&:hover, &:active, &.MuiFocusVisible': {
				border: '2px solid rgba(89, 149, 192, 0.5)',
				backgroundColor: 'rgb(44, 216, 207, 0.2)',
				boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
			},
		},
		highlightedButton: {
			backgroundColor: 'rgb(44, 216, 207, 0.5)',
		},
		sidePanel: {
			marginTop: '10px',
			height: '95vh', 
			width: '20%',
			color: 'white',
			border: '2px solid rgba(89, 149, 192, 0.5)',
			borderRadius: '18px',
			background: 'rgba(48, 130, 164, 0.15)',
			boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
			overflowY: 'auto',
			scrollbarWidth: 'thin',
			scrollbarColor: `${theme.palette.primary.analogous1} transparent`,
			WebkitOverflowScrolling: 'touch',
			scrollbarFaceColor: theme.palette.primary.analogous2,
			scrollbarHighlightColor: 'transparent',
			scrollbarShadowColor: 'transparent',
			scrollbarDarkShadowColor: 'transparent',
		},
		textField: {
			width: '66%',
			[theme.breakpoints.down('lg')]: {
				width: '100%',
			},
			backgroundColor: '#30313d',
			borderRadius: '8px',
			boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
		},
		resultsField: {
			width: '15%',
			[theme.breakpoints.down('lg')]: {
				width: '25%',
			},
			[theme.breakpoints.down('md')]: {
				width: '100%',
			},
			backgroundColor: '#30313d',
			borderRadius: '8px',
			boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
		},
		primaryField: {
			width: '50%',
			backgroundColor: '#30313d',
			borderRadius: '8px',
			boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
			margin: '0 10px 0 0',
			[theme.breakpoints.down('lg')]: {
				width: '75%',
			},
			[theme.breakpoints.down('md')]: {
				width: '100%',
				paddingRight: '0',
				margin: '1vh'
			},
		},
		secondaryField: {
			width: '66%',
			[theme.breakpoints.down('sm')]: {
				width: '40%',
			},
			[theme.breakpoints.down('xs')]: {
				width: '50%',
			},
			backgroundColor: '#30313d',
			borderRadius: '8px',
			boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
		},
		menuList: {
			'& li': {
				color: 'black',
			},
		},
		subHeader: {
			width: '40%',
			[theme.breakpoints.up('sm')]: {
				width: '25rem',
			},
		},
		description: {
			maxWidth: theme.breakpoints.up('xl') ? '65rem' : '50rem',
			color: '#6f6f71',
			paddingTop: '1rem',
		},
		buttonsContainer: {
			display: 'flex',
			justifyContent: 'center',
			paddingTop: '2%',
		},
		noBottomLine: {
			borderBottom: 'none',
		},
		recommendations: {
			display: 'flex',
			alignItems: 'start',
			listStyle: 'none',
		},
		recommendationsUl: {
			width: '100%'
		},
		resetBtn: {
			position: 'fixed',
			bottom: '2%',
			right: '2%',
			color: 'white',
			fontSize: 14,
			[theme.breakpoints.down('md')]: {
				bottom: '12%',
				right: '0',
			}
		},
		createPlaylistBtn: {
			position: 'fixed',
			bottom: '2%',
			left: '2%',
			color: '#006f96',
			fontSize: 14,
			[theme.breakpoints.down('lg')]: {
				left: '7%',
			},
			[theme.breakpoints.down('md')]: {
				bottom: '12%',
				left: '0'
			},
		},
		modal: {
			width: '100%',
			borderRadius: '18px',
			overflow: 'hidden',
			paddingTop: '1%'
		},
		inputLabel: {
			overflow: 'hidden',   
			whiteSpace: 'nowrap',
			textOverflow: 'ellipsis',
			margin: '0 1em', 
			color: 'white',
		},
		detailsHeader: {
			boxShadow: '0 4px 2px -2px #013a57',
			width: '100%',
			marginBottom: '1rem',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		},
		sliderBox: {
			display: 'flex',
			justifyContent: 'space-between',
			paddingBottom: '15px',
			width: '100%',
			marginLeft: '-25px',
			[theme.breakpoints.down('md')]: {
				flexDirection: 'column',
			},
			[theme.breakpoints.down('sm')]: {
				marginLeft: '-10px'
			}
		}
	}
));

const MobileResults = ({
	discoveryRecommendations,
	classes,
	currentUser,
	currentPlaylist,
	onRemoveFromCurrentPlaylistById,
	setIsModalOpen,
	isLoading,
	showTracks,
	handleExploreMoreClick,
	isXsScreen,
	isSmScreen,
	isMdScreen,
	isLgScreen,
	isXlScreen,
	showPlaylists,
	setShowPlaylists,
}) => {
  
	return (
		<Box
			display='flex'
			flexDirection='row'
			justifyContent='center'
			width='99%'
			id='resultsBox'
			paddingLeft={(currentUser?.user || showTracks) && '3%'}
		>
			{(currentUser?.user || showTracks) && (showPlaylists ? (
				<LeftPanel       
					isMdScreen={isMdScreen}
					isSmScreen={isSmScreen}
					isXsScreen={isXsScreen}
					setShowPlaylists={setShowPlaylists}
					currentUser={currentUser}
				/>
			) : (
				<RightPanel 
					currentPlaylist={currentPlaylist}
					onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}      
					handleExploreMoreClick={handleExploreMoreClick}
					isSmScreen={isSmScreen}
					isXsScreen={isXsScreen}
					setShowPlaylists={setShowPlaylists}
				/>
			))}
			<Box 
				backgroundColor='transparent' 
				width={(isXsScreen || isSmScreen) ? 
					'100%' : 
					'65%'
				}
			>
				<Box display="flex" justifyContent="center">
					<ToggleButtonGroup exclusive>
						<ToggleButton value="Discover">Results</ToggleButton>
						<ToggleButton value="Selected Playlist">Playlist</ToggleButton>
					</ToggleButtonGroup>
				</Box>
				{isLoading && (
					<Box backgroundColor='transparent' width='100%' paddingBottom='5%'>
						{/* <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              id='loadingState'
            >
              <CardHeader
                title="Loading Results"
                titleTypographyProps={{ color: 'white' }}
                subheaderTypographyProps={{ color: '#3d3d3d' }}
              />
            </Box> */}
						<LoadingState />
					</Box>
				)}
				{showTracks ? (
					<Box  width='100%' justifyContent='space-between'>
						<Suspense fallback={<LoadingState />}>
							<Recommendations 
								classes={classes} 
								recommendations={discoveryRecommendations}
								user={currentUser}
								currentPlaylist={currentPlaylist}
								onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}
								setIsModalOpen={setIsModalOpen}
								isXsScreen={isXsScreen}
							/>
						</Suspense>
					</Box>    
				) : !isLoading && (
					currentUser?.user ? (
						<Box 
							display='flex'
							flexDirection='column'
							justifyContent='center'
							alignItems='center'
						>
							<Typography 
								color='white' 
								textAlign='center' 
								variant='h6'
								letterSpacing='1px'
								padding='5% 0 0'
								width='80%'
							>
                What kind of music are you in the mood for today?
							</Typography>
							<Typography 
								color='white' 
								// textAlign='center' 
								variant='body1'
								letterSpacing='1px'
								padding='5% 5% 0'
							>
                Start discovering new music now. Simply choose from the songs,
                artists, and genres that inspire you and start discovering related music.
							</Typography>
							<Typography 
								color='white' 
								// textAlign='center' 
								variant='caption'
								letterSpacing='1px'
								padding='5% 5% 0'
							>
								{`* Adjust your search by clicking on "Fine Tune Your Recommendations" 
                to enable and configure fine-tuning parameters. This allows you to 
                personalize your results and find music that precisely matches your 
                preferences.`}
							</Typography>
							<Button 
								className={`${classes.button} ${classes.buttonWithMargin}`} 
								onClick={() => handleExploreMoreClick(false)}
								variant='contained'
							>
								<Typography
									variant='body2' 
									color='white'
									letterSpacing='1px'
									sx={{
										fontWeight: 'bold',
										cursor: 'pointer',
									}}
								>
                  Get Started On Your Journey
								</Typography>
								{/* <Typography variant='h5' paddingLeft='2%'>
                  🚀
                </Typography> */}
							</Button>
						</Box>
					) : (
						<Body 
							isSmScreen={isSmScreen} 
							isXsScreen={isXsScreen}
							isMdScreen={isMdScreen}
							isLgScreen={isLgScreen} 
							isXlScreen={isXlScreen}
							handleExploreMoreClick={handleExploreMoreClick}
						/>
					)
				)}
			</Box>
		</Box>
	)
}

export const SongDiscovery = ({ 
	recommendations, 
	selectedPlaylist,
	editPlaylist,
	onSetSelectedPlaylist,
	dataLoaded,
	currentUser,
	currentUserProfile,
	currentPlaylist,
	onRemoveFromCurrentPlaylistById,
	onSaveQuery,
	playlists,
}) => {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState('info');

	const [achievementModalOpen, setAchievementModalOpen] = useState(false);
	const [newAchievement, setNewAchievement] = useState(null);
	const [modalTimeout, setModalTimeout] = useState(null);
	const [fromOnboard, setFromOnboard] = useState(false);
	const [openDemo, setOpenDemo] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

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

		if (source === 'onboard') {
			setFromOnboard(true);

			const achievements = currentUserProfile.achievements || [];
			const onboardAchievement = achievements.find(ach => ach.name === "Onboarding Completed");

			if (onboardAchievement) {
				setNewAchievement(onboardAchievement);
				setAchievementModalOpen(true);
			}

		}

		if (code) {
			fetchUserProfile(code, source);
			searchParams.delete('code');
			searchParams.delete('state');
			navigate({
				pathname: location.pathname,
				search: `?${searchParams.toString()}`
			}, { replace: true });
		}
	}, [location, dispatch, navigate]);

	// eslint-disable-next-line no-unused-vars
	const fetchUserProfile = async (code, source) => {
		try {
			const response = await fetch(`/spotify-callback?code=${code}`);
			const data = await response.json();

			if (data.spotify_connected) {
				dispatch(confirmSpotifyAccess(true));
			}

			if (data.user_profile) {
				dispatch(getUserProfileSuccess(data.user_profile));
			}
		} catch (error) {
			console.error('Error fetching user profile:', error);
		}
	};

	const handleCloseModal = () => {
		clearTimeout(modalTimeout);
		setAchievementModalOpen(false);
	};

	useEffect(() => {
		if (achievementModalOpen && !fromOnboard) {
			const timer = setTimeout(() => {
				handleCloseModal();
			}, 7000);
			setModalTimeout(timer);
		}
		return () => clearTimeout(modalTimeout);
	}, [achievementModalOpen]);

	useEffect(() => {
		if (location.state?.profileUpdated) {
			if (location.state.newBadgeEarned) {
				const achievements = currentUserProfile.achievements || [];
				const onboardAchievement = achievements.find(ach => ach.name === "Onboarding Completed");
				if (onboardAchievement) {
					setNewAchievement(onboardAchievement);
					setAchievementModalOpen(true);
				}
			} else {
				setSnackbarMessage('User profile updated successfully');
				setSnackbarSeverity('success');
				setSnackbarOpen(true);
			}
			navigate(location.pathname, { replace: true });
		}
	}, [location, currentUserProfile]);

	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setSnackbarOpen(false);
	};

	const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
	const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
	const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

	const [parameters, setParameters] = useState(initialDiscoveryState.query);
	const [isLoading, setIsLoading] = useState(false);

	const [invalidSearch, setInvalidSearch] = useState(false);
	const [targetParamValues, setTargetParamValues] = useState({
		songs: [],
		performers: [],
		genres: [],
	});

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [openDemoModal, setOpenDemoModal] = useState(false);
	const [queryName, setQueryName] = useState(''); 

	const [showPlaylists, setShowPlaylists] = useState(true);

	const [toggleValue, setToggleValue] = useState('Discovery Results');

	useEffect(() => {
		if (isLoading) {
			const targetElement = document.getElementById('resultsBox');

			if (targetElement) {
				targetElement.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}
		}
	}, [isLoading]);

	useEffect(() => {
		if (selectedPlaylist) {
			const currentPlaylist = playlists.find(playlist => playlist.id === selectedPlaylist.id);

			if (!currentPlaylist?.tracks) {
				onSetSelectedPlaylist(null);
			} else {
				const selectedIsEdit = selectedPlaylist.id === editPlaylist.id
				const orderChanged = Array.isArray(selectedPlaylist.tracks) && Array.isArray(editPlaylist.tracks) && 
          selectedPlaylist.tracks.some((track, index) => track.id !== editPlaylist.tracks[index]?.id
          );

				if (selectedIsEdit && orderChanged) {
					onSetSelectedPlaylist(editPlaylist.id);
				}
			}
		}
	}, [playlists, onSetSelectedPlaylist, editPlaylist]);

	const handleExploreMoreClick = (activatesModal) => {
		const myComponent = document.getElementById('topBar');

		if (myComponent) {
			myComponent.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}

		if (activatesModal) {
			setOpenDemoModal(true);
		}
	};

	const classes = useStyles();
	const discoveryRecommendations = recommendations?.tracks
  
	const showTracks = discoveryRecommendations && dataLoaded || toggleValue === 'Selected Playlist';

	const handleQueryNameChange = (e) => {
		setQueryName(e.target.value);
	};

	const handleToggle = () => {
		if (toggleValue === 'Discovery Results') {
			setToggleValue('Selected Playlist')
		} else {
			setToggleValue('Discovery Results')
		}
	};

	const handleViewDemo = () => {
		setOpenDemo(true);
	};

	const handleCloseDemo = () => {
		setAchievementModalOpen(false);
		setOpenDemo(false);
	};

	return (
		<>
			<SpotifyForm
				classes={classes}
				parameters={parameters}
				setParameters={setParameters}
				invalidSearch={invalidSearch}
				setInvalidSearch={setInvalidSearch}
				targetParamValues={targetParamValues}
				setTargetParamValues={setTargetParamValues}
				setIsLoading={setIsLoading}
				currentUser={currentUser}
				openDemoModal={openDemoModal}
				setOpenDemoModal={setOpenDemoModal}
				setToggleValue={setToggleValue}
			/>
			{!(isSmScreen || isXsScreen || isMdScreen) ? (
				<Box
					display='flex'
					flexDirection='row'
					justifyContent='center'
					width='100%'
					id='resultsBox'
				>
					{(currentUser?.user || showTracks) && (
						<LeftPanel 
							setToggleValue={setToggleValue}
							isMdScreen={isMdScreen}
							isSmScreen={isSmScreen}
							isXsScreen={isXsScreen}
							setShowPlaylists={setShowPlaylists}
							currentUser={currentUser}
						/>
					)}
					<Box 
						backgroundColor='transparent' 
						width={(isXsScreen || isSmScreen) ? 
							'100%' : 
							(currentUser?.user || showTracks) ? 
								'53%' : 
								'70%'
						}
						display='flex'
						flexDirection='column'
						alignItems='center'
					>
						{currentUser && (
							<ToggleButtonGroup 
								exclusive
								sx={{
									boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
									borderRadius: '8px',
									width: '70%',
									marginTop: '2%',
								}}
								onChange={handleToggle}
							>
								<ToggleButton 
									value="Discovery Results"
									sx={{
										backgroundColor: toggleValue === 'Discovery Results' ? 'rgb(44, 216, 207, 0.3)' : 'rgba(48, 130, 164, 0.15)',
										color: toggleValue === 'Discovery Results' ? 'whitesmoke' : 'grey',
										borderRadius: '8px',
										width: '50%',
										'&:hover': {
											backgroundColor: 'rgb(44, 216, 207, 0.5)',
											color: 'whitesmoke',
										},
									}}
								>
									{'Discovery Results'}
								</ToggleButton>
								<ToggleButton 
									value="Selected Playlist"
									sx={{
										backgroundColor: toggleValue === 'Selected Playlist' ? 'rgb(44, 216, 207, 0.3)' : 'rgba(48, 130, 164, 0.15)',
										color: toggleValue === 'Selected Playlist' ? 'whitesmoke' : 'grey',
										borderRadius: '8px',
										width: '50%',
										'&:hover': {
											backgroundColor: 'rgb(44, 216, 207, 0.5)',
											color: 'whitesmoke',
										},
									}}
								>
									{'Selected Playlist'}
								</ToggleButton>
							</ToggleButtonGroup>
						)}
						{isLoading && (
							<Box backgroundColor='transparent' width='100%' paddingBottom='5%'>
								{/* <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  id='loadingState'
                >
                  <CardHeader
                    title="Loading Results"
                    titleTypographyProps={{ color: 'white' }}
                    subheaderTypographyProps={{ color: '#3d3d3d' }}
                  />
                </Box> */}
								<LoadingState />
							</Box>
						)}
						{showTracks ? (
							<Box  width='100%' justifyContent='space-between'>
								<Suspense fallback={<div>Loading...</div>}>
									<Recommendations 
										classes={classes} 
										recommendations={toggleValue === 'Selected Playlist' ? selectedPlaylist.tracks : discoveryRecommendations}
										user={currentUser}
										currentPlaylist={currentPlaylist}
										onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}
										setIsModalOpen={setIsModalOpen}
										isXsScreen={isXsScreen}
										toggleValue={toggleValue}
										handleExploreMoreClick={handleExploreMoreClick}
									/>
								</Suspense>
							</Box>    
						) : !isLoading && (
							currentUser?.user ? (
								<Box 
									display='flex'
									flexDirection='column'
									justifyContent='center'
									alignItems='center'
									width='95%'
								>
									<Typography 
										color='white' 
										textAlign='center' 
										variant='h4'
										letterSpacing='1px'
										padding='5% 0 0'
										width='80%'
									>
										{'What kind of music are you in the mood for today?'}
									</Typography>
									<Typography 
										color='white' 
										// textAlign='center' 
										variant='subtitle1'
										letterSpacing='1px'
										padding='5% 3% 0'
										width='100%'
									>
										{`Start discovering new music now. Simply choose from the songs,
                    artists, and genres that inspire you and start discovering related music.`}
									</Typography>
									<Typography 
										color='white' 
										// textAlign='center' 
										variant='subtitle1'
										letterSpacing='1px'
										padding='5% 3% 0'
										width='100%'
									>
										{`Adjust your search by clicking on "Fine Tune Your Recommendations" 
                    to enable and configure fine-tuning parameters. This allows you to 
                    personalize your results and find music that precisely matches your 
                    preferences.`}
									</Typography>
									<Button 
										className={`${classes.button} ${classes.buttonWithMargin}`} 
										onClick={() => handleExploreMoreClick(false)}
										variant='contained'
									>
										<Typography
											variant='subtitle1' 
											color='white'
											letterSpacing='1px'
											sx={{
												fontWeight: 'bold',
												cursor: 'pointer',
											}}
										>
											{'Get Started On Your Journey'}
										</Typography>
										{/* <Typography variant='h5' paddingLeft='2%'>
                      🚀
                    </Typography> */}
									</Button>
								</Box>
							) : (
								<Body 
									isSmScreen={isSmScreen} 
									isXsScreen={isXsScreen}
									isMdScreen={isMdScreen}
									isLgScreen={isLgScreen} 
									isXlScreen={isXlScreen}
									handleExploreMoreClick={handleExploreMoreClick}
								/>
							)
						)}
					</Box>
					{(currentUser?.user || showTracks) && (
						<RightPanel 
							currentPlaylist={currentPlaylist}
							onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}
							handleExploreMoreClick={handleExploreMoreClick}
							isSmScreen={isSmScreen}
							isXsScreen={isXsScreen}
							setShowPlaylists={setShowPlaylists}
						/>
					)}
				</Box>
			) : (
				<MobileResults 
					discoveryRecommendations={discoveryRecommendations}
					classes={classes}
					currentUser={currentUser}
					currentPlaylist={currentPlaylist}
					onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}
					setIsModalOpen={setIsModalOpen}
					showPlaylists={showPlaylists}
					setShowPlaylists={setShowPlaylists}
					isLoading={isLoading}
					showTracks={showTracks}
					handleExploreMoreClick={handleExploreMoreClick}
					isXsScreen={isXsScreen}
					isSmScreen={isSmScreen}
					isMdScreen={isMdScreen}
					isLgScreen={isLgScreen}
					isXlScreen={isXlScreen}
				/>
			)}
			<SaveQueryModal
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				onSaveQuery={onSaveQuery}
				queryName={queryName}
				handleQueryNameChange={handleQueryNameChange}
				user={currentUser}
				classes={classes}
				parameters={parameters}
			/>
			<Modal
				open={achievementModalOpen}
				onClose={handleCloseModal}
				aria-labelledby="achievement-modal-title"
				aria-describedby="achievement-modal-description"
			>
				<Box
					display='flex'
					flexDirection='column'
					alignItems='center'
					sx={{
						backgroundColor: 'rgba(13,27,38,0.9)',
						color: 'white',
						border: '2px solid rgba(89, 149, 192, 0.5)',
						borderRadius: '18px',
						overflowY: 'auto',
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '40%',
						minHeight: '40%',
						boxShadow: 24,
						p: 4,
					}}
				>
					<Box
						sx={{
							position: 'absolute',
							top: '1.5%', 
							right: '1.5%', 
							cursor: 'pointer',
						}}
					>
						<CloseIcon 
							onClick={handleCloseModal} 
							style={{ color: theme.palette.primary.triadic2 }}
						/>
					</Box>
					{!openDemo ? (
						<>
							<Typography 
								id="achievement-modal-title" 
								variant="h4" 
								component="h2"
								textAlign='center'
								letterSpacing='5px'
							>
								{'Congratulations!'}
							</Typography>
							<Typography 
								id="achievement-modal-description-1" 
								textAlign='center'
								variant='h6'
								sx={{ mt: 2 }}
								letterSpacing='2px'
							>
								{`You have earned a new badge:`}
							</Typography>
							<img
								src={currentUserProfile?.achievements[0]?.badge.image_url}
								alt={currentUserProfile?.achievements[0]?.badge.name}
								style={{ 
									width: (isXsScreen || isSmScreen) ? '20%' : '20%',
									paddingRight: (isXsScreen || isSmScreen) ? '2%' : '15px',
								}}
							/>
							<Typography 
								id="achievement-modal-description-2"
								variant='subtitle1'
								letterSpacing='1px'
							>
								{`${newAchievement?.badge?.description}`}
							</Typography>
							<Typography 
								id="achievement-modal-description-2"
								variant='caption'
								letterSpacing='1px'
								my={1}
							>
								{"*Earned badges can be viewed in your profile"}
							</Typography>
							{fromOnboard && (
								<Tooltip
									arrow
									title={
										<div
											style={{
												maxHeight: '25vh',
												overflowY: 'auto',
												padding: '8px',
												borderRadius: '8px',
											}}
										> 
											<Typography variant='body2' letterSpacing='1px'>
												{
													`Watch the magic of SongQuest in action! Click here to 
                              view our demo video and experience firsthand how our 
                              AI-powered music discovery brings your musical journey 
                              to life.`
												}
											</Typography>
										</div>
									}
								>
									<Button
										className={classes.button}
										type='button'
										onClick={handleViewDemo}
									>
										{'View Demo'}
										<NavigateNextIcon />
									</Button>
								</Tooltip>
							)}
						</>
					) : (
						<>
							<Tooltip
								arrow
								title={
									<div
										style={{
											maxHeight: '25vh',
											overflowY: 'auto',
											padding: '8px',
											borderRadius: '8px',
										}}
									> 
										<Typography variant='body2' letterSpacing='1px'>
											{
												`Click here to get started on your journey `
											}
										</Typography>
									</div>
								}
							>
								<Button
									className={classes.button}
									type='button'
									onClick={handleCloseDemo}
								>
									{'Get Started'}
									<NavigateNextIcon />
								</Button>
							</Tooltip>
						</>
					)}
				</Box>
			</Modal>
			<Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert variant='filled' onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		error: state.discovery.error,
		recommendations: state.discovery.recommendations,
		selectedPlaylist: state.playlist.currentPlaylist.selectedPlaylist,
		editPlaylist: state.playlist.currentPlaylist.editPlaylist,
		dataLoaded: state.discovery.dataLoaded,
		currentUser: state.user.currentUser,
		currentUserProfile: state.userProfile.currentUserProfile,
		currentPlaylist: state.playlist.currentPlaylist.createPlaylist,
		playlists: state.playlist.playlists,
	};
};

const mapDispatchToProps = (dispatch) => ({
	onRemoveFromCurrentPlaylistById: (...songs) => dispatch(removeFromCurrentPlaylistById(...songs)),
	onSaveQuery: (userId, query) => dispatch(saveRequestParameters(userId, query)),
	onSetSelectedPlaylist: (playlistId) => dispatch(setSelectedPlaylist(playlistId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SongDiscovery);