import React, { useEffect } from 'react';
import {
	Alert,
	Box,
	Button,
	Checkbox,
	Skeleton,
	Snackbar,
	Tooltip,
	Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveIcon from '@mui/icons-material/Remove';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { useCallback, useRef, useState } from 'react';
import theme from '../theme';
import { connect } from 'react-redux';
import { addToCurrentPlaylist, addToPlaylistToEdit } from '../actions';
import {
	addToSpotify,
	checkIfUserFollowsArtists,
	checkUsersTracks,
	followArtistsOnSpotify,
	removeUsersTracks,
	unfollowArtists
} from '../thunks';
import { LoadingState } from './LoadingState';
import defaultImage from '../images/defaultImage.webp';
import { DemoModal } from './auth/DemoModal';

const Recommendation = ({
	classes,
	recommendation,
	playlistAction,
	index,
	createPlaylist,
	editPlaylist,
	songsToAdd,
	setSongsToAdd,
	onAddToCurrentPlaylist,
	onAddToPlaylistToEdit,
	onRemoveFromCurrentPlaylistById,
	user,
	isXsScreen,
	savedTracks,
	setSavedTracks,
	followedArtists,
	setFollowedArtists,
	setSnackbarOpen,
	setSnackbarMessage,
	setSnackbarSeverity
}) => {
	const navigate = useNavigate();

	const [iframeLoaded, setIframeLoaded] = useState(false);
	const isSavedTrack = savedTracks[index];
	const artistIsFollowed = followedArtists[index];
	const recommendationInPlaylist = createPlaylist?.tracks.some(
		track => track.spotifyId === recommendation.id
	);

	const imageUrl =
		recommendation.album && recommendation.album.images[2] && recommendation.album.images[2].url
			? recommendation.album.images[2].url
			: recommendation.image || defaultImage;

	const handleAddToPlaylistClick = useCallback(() => {
		if (!user?.user) {
			navigate('/login');
		} else if (!user?.user?.spotifyConnected) {
			navigate('/spotify-connect');
		} else if (playlistAction === 'create') {
			if (recommendationInPlaylist) {
				onRemoveFromCurrentPlaylistById(recommendation.id);
				setSnackbarMessage(`Removed ${recommendation.name} from playlist`);
				setSnackbarSeverity('info');
			} else {
				onAddToCurrentPlaylist({
					name: recommendation.name,
					artists: recommendation.artists,
					spotify_id: recommendation.id,
					image: imageUrl,
					isrc: recommendation['external_ids']['isrc']
				});
				setSnackbarMessage(`Added ${recommendation.name} to current playlist`);
				setSnackbarSeverity('success');
			}
		} else {
			onAddToPlaylistToEdit({
				name: recommendation.name,
				artists: recommendation.artists.map(artist => (artist.name ? artist.name : artist)),
				spotifyId: recommendation.id,
				image: imageUrl,
				isrc: recommendation['external_ids']['isrc']
			});
			setSnackbarMessage(`Added ${recommendation.name} to ${editPlaylist.name}`);
			setSnackbarSeverity('success');
		}
		setSnackbarOpen(true);
	}, [
		user?.user?.spotifyConnected,
		playlistAction,
		navigate,
		recommendationInPlaylist,
		onRemoveFromCurrentPlaylistById,
		recommendation,
		onAddToCurrentPlaylist,
		onAddToPlaylistToEdit
	]);

	const recommendationInSongsToAdd = songsToAdd.some(obj => obj.id === recommendation.id);

	const handleLikeClick = () => {
		if (!user?.user) {
			navigate('/login');
		} else if (user?.user?.spotifyConnected) {
			const updatedSavedTracks = [...savedTracks];
			updatedSavedTracks[index] = !isSavedTrack;

			if (isSavedTrack) {
				removeUsersTracks(recommendation, user?.user.id);
			} else {
				addToSpotify(recommendation, user?.user.id);
			}

			setSavedTracks(updatedSavedTracks);
		} else {
			navigate('/spotify-connect');
		}
	};

	const handleSelectClick = useCallback(() => {
		if (recommendationInSongsToAdd) {
			setSongsToAdd(songsToAdd.filter(song => song.id !== recommendation.id));
		} else {
			setSongsToAdd([...songsToAdd, recommendation]);
		}
	}, [recommendation, recommendationInSongsToAdd, setSongsToAdd, songsToAdd]);

	const handleFollowArtist = async () => {
		if (!user?.user) {
			navigate('/login');
		} else if (user?.user?.spotifyConnected) {
			const updatedFollowedArtists = [...followedArtists];
			updatedFollowedArtists[index] = !artistIsFollowed;

			if (artistIsFollowed) {
				unfollowArtists([recommendation.artists[0].id], user?.user.id);
			} else {
				followArtistsOnSpotify([recommendation.artists[0].id], user?.user.id);
			}

			setFollowedArtists(updatedFollowedArtists);
		} else {
			navigate('/spotify-connect');
		}
	};

	const handleIframeLoad = () => {
		setIframeLoaded(true);
	};

	const isChecked = recommendationInSongsToAdd;

	let artistName;

	if (typeof recommendation.artists[0] === 'string') {
		artistName = recommendation.artists[0];
	} else {
		artistName = recommendation.artists[0].name;
	}

	return (
		<Box display='flex' flexDirection='column' width='100%'>
			<Box
				component='li'
				className={classes.recommendations}
				key={index}
				sx={{ position: 'relative', marginBottom: '85px' }}
			>
				<Checkbox
					icon={<CircleIcon sx={{ color: theme.palette.primary.white }} />}
					checkedIcon={
						<CheckCircleIcon sx={{ color: theme.palette.primary.analogous1 }} />
					}
					onClick={handleSelectClick}
					checked={isChecked}
					sx={{ padding: '0 3% 0 2%' }}
				/>
				<Box display='flex' flexDirection='column' width='100%'>
					<Box
						component='li'
						className={classes.recommendations}
						key={index}
						sx={{
							position: 'relative', // Parent relative position
							// marginBottom: '85px',
							height: '80px', // Set a fixed height for the container
							width: isXsScreen ? '100%' : '100%' // Control width based on screen size
						}}
					>
						{/* Skeleton that only displays when iframe is not loaded */}
						{!iframeLoaded && (
							<Skeleton
								variant='rounded'
								width={'100%'}
								height={'80px'}
								sx={{
									position: 'absolute',
									top: 0,
									left: 0,
									backgroundColor: 'rgba(48, 130, 164, 0.15)'
								}}
							/>
						)}
						{/* Iframe styled to be in the same position */}
						<iframe
							title={`${recommendation.name}`}
							src={`https://open.spotify.com/embed/track/${
								recommendation.spotifyId || recommendation.id
							}?utm_source=generator`}
							height='80'
							width='100%' // Always 100% to fill the container
							frameBorder='0'
							allowFullScreen=''
							allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
							loading='lazy'
							onLoad={handleIframeLoad}
							style={{
								position: 'absolute',
								top: 0,
								left: 0
							}}
						/>
					</Box>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'space-between',
						flexGrow: 1
					}}
				>
					<Tooltip
						arrow
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
									{user?.user?.spotifyConnected && !recommendationInPlaylist
										? 'Add to current collection'
										: user?.user?.spotifyConnected && recommendationInPlaylist
										? 'Remove from current collection'
										: user?.user
										? 'Connect to Spotify to build collections and more'
										: 'Login to build collections and more'}
								</Typography>
							</div>
						}
					>
						<Button onClick={handleAddToPlaylistClick}>
							{recommendationInPlaylist ? (
								<RemoveIcon sx={{ color: theme.palette.primary.white }} />
							) : (
								<AddIcon sx={{ color: theme.palette.primary.white }} />
							)}
						</Button>
					</Tooltip>
					<Tooltip
						arrow
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
									{user?.user?.spotifyConnected && isSavedTrack
										? 'Remove from your Spotify library'
										: user?.user?.spotifyConnected
										? 'Save to your Spotify library'
										: user?.user
										? 'Connect to Spotify to save to libary'
										: 'Login to save to your Spotify library'}
								</Typography>
							</div>
						}
					>
						<Button onClick={handleLikeClick}>
							<FavoriteIcon
								sx={{
									color: isSavedTrack
										? theme.palette.primary.triadic2
										: theme.palette.primary.white
								}}
							/>
						</Button>
					</Tooltip>
				</Box>
				<Tooltip
					arrow
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
								{user?.user?.spotifyConnected && isSavedTrack
									? `Unfollow ${artistName} on Spotify`
									: user?.user?.spotifyConnected
									? `Follow ${artistName} on Spotify`
									: user?.user
									? `Connect to Spotify to follow ${artistName}`
									: `Login and connect to Spotify to follow ${artistName}`}
							</Typography>
						</div>
					}
				>
					<Button
						variant='contained'
						sx={{
							position: 'absolute',
							bottom: '-50%',
							left: '50%',
							transform: 'translateX(-50%)',
							color: 'white',
							background: artistIsFollowed
								? 'rgba(216,44,139, 0.7)'
								: 'rgba(44, 216, 207, 0.3)',
							border: '2px solid rgba(89, 149, 192, 0.5)',
							borderRadius: '18px',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							padding: '0 5%',
							maxWidth: '50%',
							boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
							transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
							'&:hover, &:active, &.MuiFocusVisible': {
								border: '2px solid rgba(89, 149, 192, 0.5)',
								backgroundColor: artistIsFollowed
									? 'rgba(216,44,139, 0.9)'
									: 'rgba(44, 216, 207, 0.5)',
								boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)'
							},
							zIndex: 2
						}}
						onClick={handleFollowArtist}
					>
						{artistIsFollowed ? `Unfollow ${artistName}` : `Follow ${artistName}`}
					</Button>
				</Tooltip>
			</Box>
		</Box>
	);
};

const Recommendations = ({
	classes,
	recommendations,
	user,
	createPlaylist,
	playlistAction,
	onAddToCurrentPlaylist,
	onAddToPlaylistToEdit,
	onRemoveFromCurrentPlaylistById,
	setIsModalOpen,
	isXsScreen,
	isSmScreen,
	isMdScreen,
	toggleValue,
	handleExploreMoreClick,
	editPlaylist
}) => {
	const [songsToAdd, setSongsToAdd] = useState([]);
	const [visibleRecommendations, setVisibleRecommendations] = useState(recommendations?.length);
	const [savedTracks, setSavedTracks] = useState([]);
	const [followedArtists, setFollowedArtists] = useState([]);

	const [loading, setLoading] = useState(true);

	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState('info');

	const containerRef = useRef(null);

	useEffect(() => {
		async function fetchData() {
			if (user?.user?.spotifyConnected && recommendations?.length) {
				try {
					const artistIds = recommendations.map(rec => rec.artists[0].id);
					const [trackStatus, followStatus] = await Promise.all([
						checkUsersTracks(recommendations, user.user.id),
						checkIfUserFollowsArtists(artistIds, user.user.id)
					]);

					setSavedTracks(trackStatus);
					setFollowedArtists(followStatus);
				} catch (error) {
					console.error('Failed to fetch data:', error);
				} finally {
					setLoading(false);
				}
			} else {
				setLoading(false);
			}
		}

		fetchData();
	}, [recommendations, user]);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const handleSelectAll = () => {
		songsToAdd.length === 0 ? setSongsToAdd(recommendations) : setSongsToAdd([]);
	};

	const handleBulkAdd = () => {
		const songsToAddData = songsToAdd.map(song => ({
			// 'id': song.id,
			name: song.name,
			artists: song.artists,
			spotifyId: song.spotifyId || song.id,
			isrc: song.external_ids ? song.external_ids.isrc : song.isrc,
			image:
				song.album && song.album.images[2] && song.album.images[2].url
					? song.album.images[2].url
					: song.image || defaultImage
		}));

		onAddToCurrentPlaylist(...songsToAddData);
		setSnackbarMessage(`Added ${songsToAddData.length} songs to current playlist`);
		setSnackbarSeverity('success');
		setSnackbarOpen(true);
	};

	const handleSaveRequestParameters = () => {
		openModal();
	};

	const handleScroll = useCallback(() => {
		const container = containerRef.current;
		if (
			container &&
			recommendations.length &&
			container.scrollTop + container.clientHeight >= container.scrollHeight
		) {
			setVisibleRecommendations(preVisible => preVisible + 4);
		}
	}, [recommendations]);

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setSnackbarOpen(false);
	};

	const [openDemoVideo, setOpenDemoVideo] = useState(false);

	const handleViewDemoVideo = () => {
		setOpenDemoVideo(true);
	};

	const handleCloseDemoVideo = () => {
		setOpenDemoVideo(false);
	};

	if (loading) {
		return <LoadingState />;
	}

	return (
		<>
			<ul
				style={{
					color: 'white',
					padding: '0',
					margin: '1.5% 3%',
					height: '91vh',
					transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
					'&:hover, &:active, &.MuiFocusVisible': {
						border: '2px solid rgba(89, 149, 192, 0.5)',
						backgroundColor: 'rgb(44, 216, 207, 0.5)',
						boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)'
					}
				}}
			>
				<Box
					display='flex'
					justifyContent={'space-between'}
					width={isXsScreen ? '110%' : '100%'}
				>
					<Tooltip
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
									{songsToAdd.length === 0
										? 'Select all discovery results'
										: 'Deselect discovery results'}
								</Typography>
							</div>
						}
					>
						<Button onClick={handleSelectAll}>
							<Typography
								color='white'
								variant={isXsScreen ? 'caption' : 'subtitle1'}
							>
								{songsToAdd.length === 0 && !isXsScreen
									? 'Select All'
									: songsToAdd.length === 0 && isXsScreen
									? 'Select'
									: 'Deselect'}
							</Typography>
						</Button>
					</Tooltip>
					{user && (
						<Tooltip
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
										{'See the parameters from this request'}
									</Typography>
								</div>
							}
						>
							<Button
								onClick={handleSaveRequestParameters}
								sx={{
									marginRight: !isXsScreen ? '8%' : '0',
									width: '50%'
								}}
							>
								{toggleValue === 'Discovery Results' && (
									<VisibilityIcon
										fontSize={isXsScreen ? 'small' : 'medium'}
										style={{
											color: theme.palette.primary.analogous1
										}}
									/>
								)}
								<Typography
									color='white'
									variant={isXsScreen ? 'caption' : 'subtitle1'}
									paddingLeft='3%'
								>
									{isXsScreen && toggleValue === 'Discovery Results'
										? 'Request'
										: toggleValue === 'Discovery Results'
										? 'View Request'
										: 'Selected Playlist'}
								</Typography>
							</Button>
						</Tooltip>
					)}
					<Tooltip
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
									{'Add selected to playlist'}
								</Typography>
							</div>
						}
					>
						<Button onClick={handleBulkAdd} sx={{ p: 0 }}>
							<PlaylistAddIcon
								fontSize={isXsScreen ? 'medium' : 'large'}
								style={{ color: theme.palette.primary.white }}
							/>
						</Button>
					</Tooltip>
				</Box>
				<div
					ref={containerRef}
					onScroll={handleScroll}
					style={{
						overflowY: 'auto',
						height: '86vh',
						scrollbarWidth: 'thin',
						scrollbarColor: `${theme.palette.primary.analogous1} transparent`,
						WebkitOverflowScrolling: 'touch',
						scrollbarFaceColor: theme.palette.primary.analogous2,
						scrollbarHighlightColor: 'transparent',
						scrollbarShadowColor: 'transparent',
						scrollbarDarkShadowColor: 'transparent'
					}}
				>
					{recommendations?.length ? (
						recommendations
							?.slice(0, visibleRecommendations)
							.map((recommendation, index) => (
								<Recommendation
									key={`${recommendation.name}`}
									classes={classes}
									recommendation={recommendation}
									playlistAction={playlistAction}
									editPlaylist={editPlaylist}
									index={index}
									createPlaylist={createPlaylist}
									songsToAdd={songsToAdd}
									setSongsToAdd={setSongsToAdd}
									onAddToCurrentPlaylist={onAddToCurrentPlaylist}
									onAddToPlaylistToEdit={onAddToPlaylistToEdit}
									onRemoveFromCurrentPlaylistById={
										onRemoveFromCurrentPlaylistById
									}
									user={user}
									isXsScreen={isXsScreen}
									toggleValue={toggleValue}
									savedTracks={savedTracks}
									setSavedTracks={setSavedTracks}
									followedArtists={followedArtists}
									setFollowedArtists={setFollowedArtists}
									setSnackbarOpen={setSnackbarOpen}
									setSnackbarMessage={setSnackbarMessage}
									setSnackbarSeverity={setSnackbarSeverity}
								/>
							))
					) : (
						<Box
							display='flex'
							flexDirection='column'
							alignItems='center'
							width='85%'
							style={{ margin: '0 auto' }}
						>
							<Typography
								variant={isXsScreen || isSmScreen ? 'h6' : 'h5'}
								textAlign='center'
								color='whitesmoke'
								paddingTop='5%'
								letterSpacing='1px'
							>
								{'No Playlist Selected'}
							</Typography>
							<Typography
								variant={isXsScreen || isSmScreen || isMdScreen ? 'body1' : 'h6'}
								textAlign='center'
								color='whitesmoke'
								paddingTop='3%'
								letterSpacing='1px'
							>
								{isXsScreen || isSmScreen
									? `Select a saved playlist from the left panel to preview your 
                collection or use the song explorer to unearth new gems.`
									: `Select one of your saved playlists from the left panel to 
                preview the gems you have in your collection, or use the song
                explorer to start unearthing new gems for your collection.`}
							</Typography>
							<Button
								onClick={() => handleExploreMoreClick(false)}
								variant='contained'
								sx={{
									color: 'white',
									backgroundColor: 'rgb(44, 216, 207, 0.3)',
									border: '2px solid rgba(89, 149, 192, 0.5)',
									borderRadius: '18px',
									boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
									transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
									margin: '4%',
									width: '22vw',
									height: '7vh',
									[theme.breakpoints.down('md')]: {
										width: '70%'
									},
									'&:hover, &:active, &.MuiFocusVisible': {
										border: '2px solid rgba(89, 149, 192, 0.5)',
										backgroundColor: 'rgb(44, 216, 207, 0.5)',
										boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)'
									}
								}}
							>
								<Typography
									variant='body2'
									color='white'
									letterSpacing='1px'
									sx={{
										fontWeight: 'bold',
										cursor: 'pointer'
									}}
								>
									{'Use Song Explorer'}
								</Typography>
							</Button>
							<Typography color={'white'} fontSize='large'>
								{'OR'}
							</Typography>
							<Button
								onClick={handleViewDemoVideo}
								variant='contained'
								sx={{
									color: 'white',
									backgroundColor: 'rgb(44, 216, 207, 0.3)',
									border: '2px solid rgba(89, 149, 192, 0.5)',
									borderRadius: '18px',
									boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
									transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
									margin: '4%',
									width: '22vw',
									height: '7vh',
									[theme.breakpoints.down('md')]: {
										width: '70%'
									},
									'&:hover, &:active, &.MuiFocusVisible': {
										border: '2px solid rgba(89, 149, 192, 0.5)',
										backgroundColor: 'rgb(44, 216, 207, 0.5)',
										boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)'
									}
								}}
							>
								<Typography
									variant='body2'
									color='white'
									letterSpacing='1px'
									sx={{
										fontWeight: 'bold',
										cursor: 'pointer'
									}}
								>
									{'View Demo'}
								</Typography>
							</Button>
						</Box>
					)}
				</div>
			</ul>
			<Box display='flex' justifyContent='center' alignItems='center'>
				<KeyboardDoubleArrowDownIcon sx={{ color: theme.palette.primary.triadic2 }} />
				<Typography
					textAlign='center'
					color='white'
					variant='subtitle1'
					letterSpacing='1px'
				>
					Scroll Down To Load More Results
				</Typography>
				<KeyboardDoubleArrowDownIcon sx={{ color: theme.palette.primary.triadic2 }} />
			</Box>
			<DemoModal openDemoVideo={openDemoVideo} handleCloseDemoVideo={handleCloseDemoVideo} />
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
		</>
	);
};

const mapStateToProps = state => {
	return {
		playlistAction: state.playlist.currentPlaylist.action,
		editPlaylist: state.playlist.currentPlaylist.editPlaylist
	};
};

const mapDispatchToProps = dispatch => ({
	onAddToCurrentPlaylist: (...songs) => dispatch(addToCurrentPlaylist(...songs)),
	onAddToPlaylistToEdit: (...songs) => dispatch(addToPlaylistToEdit(...songs))
});

export default connect(mapStateToProps, mapDispatchToProps)(Recommendations);
