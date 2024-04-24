import React, { useEffect, useState } from 'react';
import {
	Alert,
	Autocomplete,
	Box,
	Button,
	Card,
	Checkbox,
	Snackbar,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip,
	Typography,
	useMediaQuery
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import useStyles from '../../classes/playlist';
import { connect } from 'react-redux';
import {
	addToSavedPlaylistRequest,
	createPlaylistRequest,
	removeFromPlaylistRequest,
	updatePlaylistItemsRequest
} from '../../thunks';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import theme from '../../theme';
import {
	removeFromCurrentPlaylistById,
	removeFromPlaylistToEdit,
	reorderPlaylistTracks,
	setCreatePlaylist,
	setEditPlaylist,
	setPlaylistToEdit,
	setSelectedPlaylist
} from '../../actions';
import spotifyIcon from '../../../public/images/Spotify_Icon_RGB_White.png';

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

const PlaylistItemCard = ({
	item,
	handlePlaylistSelectClick,
	isPlaylistItemChecked,
	isSmScreen,
	isXsScreen
}) => {
	const songName = item?.name;
	const artists = item?.artists?.map(artist => artist.name).join(', ');
	const imgUrl = item?.image;

	return (
		<Card
			key={item.id}
			sx={{
				display: 'flex',
				position: 'relative',
				width: isXsScreen || isSmScreen ? '30vw' : '18vw',
				height: isXsScreen || isSmScreen ? '7vh' : '11vh',
				overflow: 'hidden',
				borderRadius: '8px',
				backgroundColor: '#282828',
				boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
				opacity: '0.9',
				paddingLeft: '2%',
				margin: '0 auto 3%',
				paddingBottom: '2%'
			}}
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
							{'Select song from playlist'}
						</Typography>
					</div>
				}
			>
				<Checkbox
					icon={<CircleIcon sx={{ color: '#d2dce1', opacity: '0.5' }} />}
					checkedIcon={<CheckCircleIcon color='info' />}
					onClick={() => handlePlaylistSelectClick(item)}
					checked={isPlaylistItemChecked(item)}
					sx={{
						color: 'white',
						position: 'absolute',
						top: '10%',
						left: '2%',
						zIndex: '2',
						paddingLeft: '0px'
					}}
				/>
			</Tooltip>
			{!(isXsScreen || isSmScreen) && (
				<img
					loading='lazy'
					alt={item.name}
					src={imgUrl}
					style={{
						maxWidth: '100%',
						height: 'auto',
						padding: '2% 2% 2% 2vw'
					}}
				/>
			)}
			<Box paddingLeft={(isXsScreen || isSmScreen) && '25%'}>
				<Typography
					noWrap
					variant={isXsScreen || isSmScreen ? 'caption' : 'subtitle2'}
					color='white'
					sx={{
						maxHeight: '30%',
						maxWidth: '100%',
						overflowY: 'auto'
					}}
				>
					{songName}
				</Typography>
				<Typography
					noWrap={isXsScreen || isSmScreen}
					variant={isXsScreen || isSmScreen ? 'caption' : 'subtitle2'}
					color='white'
					sx={{
						fontWeight: 'bold',
						display: 'flex',
						maxWidth: '100%',
						overflowY: 'auto'
					}}
				>
					{artists}
				</Typography>
			</Box>
			<DragHandleIcon
				fontSize='large'
				sx={{
					color: 'rgb(210,220,225, 0.8)',
					textAlign: 'center',
					position: 'absolute',
					bottom: '0',
					right: '35%'
				}}
			/>
			<img
				loading='lazy'
				alt='spotify-icon'
				src={spotifyIcon}
				style={{
					maxWidth: '8%',
					height: 'auto',
					position: 'absolute',
					right: '5%',
					bottom: '15%'
				}}
			/>
		</Card>
	);
};

const CreateOrEditPlaylist = ({
	classes,
	playlist,
	handleCreatePlaylist,
	currentUser,
	playlists,
	playlistAction,
	setPlaylistName,
	playlistName,
	onAddToSavedPlaylist,
	onRemoveFromSavedPlaylist,
	onRemoveFromPlaylistToEdit,
	onSetCreatePlaylist,
	onSetEditPlaylist,
	onSetPlaylistToEdit,
	onRemoveFromCurrentPlaylistById,
	onReorderPlaylistTracks,
	onUpdatePlaylistOrder,
	navigate,
	setSnackbarOpen,
	setSnackbarMessage,
	setSnackbarSeverity
}) => {
	const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
	const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

	const [songsToRemove, setSongsToRemove] = useState([]);
	const [hoveredCardId, setHoveredCardId] = useState(null);

	// eslint-disable-next-line no-unused-vars
	const [playlistToEdit, setPlaylistToEdit] = useState({});

	const [localTracks, setLocalTracks] = useState([]);

	useEffect(() => {
		setLocalTracks(playlist?.tracks || []);
	}, [playlist?.tracks]);

	const isPlaylistItemChecked = item => {
		return songsToRemove.some(spotifyId => spotifyId === item.spotifyId);
	};

	const handleBulkRemove = () => {
		onRemoveFromCurrentPlaylistById(...songsToRemove.map(songId => songId));
	};

	const playlistItemInSongsToRemove = spotifyId => {
		return songsToRemove.includes(spotifyId);
	};

	const handlePlaylistSelectClick = item => {
		if (playlistItemInSongsToRemove(item.spotifyId)) {
			setSongsToRemove(songsToRemove.filter(id => id !== item.spotifyId));
		} else {
			setSongsToRemove([...songsToRemove, item.spotifyId]);
		}
	};

	const handlePlaylistSelectAll = () => {
		if (songsToRemove.length !== playlist.tracks.length) {
			setSongsToRemove(playlist.tracks.map(song => song.spotifyId));
		} else {
			setSongsToRemove([]);
		}
	};

	const handleConnectToSpotify = () => {
		if (!currentUser?.user) {
			navigate('/login');
		}
		// else {

		// }
	};

	const handleChange = (event, newValue) => {
		if (newValue) {
			onSetPlaylistToEdit(newValue?.id);
		}
	};

	const handleToggle = e => {
		if (e.target.value === 'Edit') {
			onSetEditPlaylist();
		} else {
			onSetCreatePlaylist();
		}
	};

	const handleDeleteSong = async track => {
		try {
			setSnackbarOpen(true);
			setSnackbarMessage(`Removing ${track.name} from ${playlist.name}`);
			setSnackbarSeverity('info');

			if (playlistAction === 'create') {
				await onRemoveFromCurrentPlaylistById(track.spotifyId);
			} else if (track.id) {
				const updatedTrackList = await onRemoveFromSavedPlaylist(
					playlist.id,
					currentUser?.user.id,
					[track]
				);
				console.log(updatedTrackList);
			} else {
				onRemoveFromPlaylistToEdit(track);
			}
			setSnackbarMessage('Track removed successfully');
			setSnackbarSeverity('success');
		} catch (error) {
			console.error('Error removing track:', error);
			setSnackbarMessage('Failed to remove track');
			setSnackbarSeverity('error');
		} finally {
			setSnackbarOpen(true);
		}
	};

	const onDragEnd = result => {
		if (!result.destination) {
			setSnackbarOpen(true);
			setSnackbarMessage('You dropped the item outside the valid area.');
			setSnackbarSeverity('error');
			return;
		}

		const { source, destination } = result;
		if (source.index !== destination.index) {
			setLocalTracks(prevTracks => {
				const reorderedTracks = Array.from(prevTracks);
				const [removed] = reorderedTracks.splice(source.index, 1);
				reorderedTracks.splice(destination.index, 0, removed);

				onReorderPlaylistTracks(playlist.id, reorderedTracks);

				return reorderedTracks;
			});
			setSnackbarOpen(true);
			setSnackbarMessage("Changes are not yet saved. Press 'Update' to save changes.");
			setSnackbarSeverity('info');
		}
	};

	const handleUpdatePlaylist = async () => {
		setSnackbarOpen(true);
		setSnackbarMessage('Updating playlist...');
		setSnackbarSeverity('info');

		if (localTracks.length === 0) {
			console.error('Track list is empty');
			setSnackbarMessage('Failed to update playlist: No tracks.');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
			return;
		}

		// Step 1: Add new tracks to the playlist if there are any
		const tracksToAdd = localTracks.filter(track => track.isNew);
		if (tracksToAdd.length > 0) {
			try {
				await onAddToSavedPlaylist(playlist.id, currentUser?.user.id, tracksToAdd);
				setSnackbarMessage('Tracks added successfully.');
				setSnackbarSeverity('success');
				setSnackbarOpen(true);
			} catch (error) {
				console.error('Failed to add tracks: ', error);
				setSnackbarMessage('Failed to add tracks to playlist.');
				setSnackbarSeverity('error');
				setSnackbarOpen(true);
				return;
			}
		}

		// Step 2: Update the order of all tracks in the playlist
		const uris = localTracks.map(track => `spotify:track:${track.spotifyId}`);
		try {
			await onUpdatePlaylistOrder(currentUser?.user.id, playlist.id, {
				uris,
				snapshot_id: playlist.snapshotId
			});
			setLocalTracks([]);
			setSnackbarMessage('Playlist updated successfully.');
			setSnackbarSeverity('success');
			setSnackbarOpen(true);
		} catch (error) {
			console.error('Failed to update playlist order: ', error);
			setSnackbarMessage('Failed to update playlist order.');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		}
	};

	return (
		<>
			<Box display='flex' flexDirection='column'>
				<Box display='flex' justifyContent='center'>
					<ToggleButtonGroup
						exclusive
						sx={{
							boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
							borderRadius: '8px',
							width: '70%',
							marginTop: '2%'
						}}
						onChange={handleToggle}
					>
						<ToggleButton
							value='Create'
							sx={{
								backgroundColor:
									playlistAction === 'create'
										? 'rgb(44, 216, 207, 0.3)'
										: 'rgba(48, 130, 164, 0.15)',
								color: playlistAction === 'create' ? 'whitesmoke' : 'grey',
								borderRadius: '8px',
								width: '50%',
								padding: '1%',
								'&:hover': {
									backgroundColor: 'rgb(44, 216, 207, 0.5)',
									color: 'whitesmoke'
								}
							}}
						>
							{'Create'}
						</ToggleButton>
						<ToggleButton
							value='Edit'
							sx={{
								backgroundColor:
									playlistAction === 'edit'
										? 'rgb(44, 216, 207, 0.3)'
										: 'rgba(48, 130, 164, 0.15)',
								color: playlistAction === 'edit' ? 'whitesmoke' : 'grey',
								borderRadius: '8px',
								width: '50%',
								padding: '1%',
								'&:hover': {
									backgroundColor: 'rgb(44, 216, 207, 0.5)',
									color: 'whitesmoke'
								}
							}}
						>
							{'Edit'}
						</ToggleButton>
					</ToggleButtonGroup>
				</Box>
				<Box
					display='flex'
					justifyContent='center'
					alignSelf='center'
					width='90%'
					margin='5%'
				>
					{playlistAction === 'create' ? (
						<TextField
							label='Playlist Name'
							variant='standard'
							required
							value={playlistName}
							onChange={e => setPlaylistName(e.target.value)}
							className={classes.playlistField}
							// eslint-disable-next-line no-unused-vars
							sx={() => ({
								...((isXsScreen || isSmScreen) && {
									'& .MuiInputBase-root': {
										marginTop: '7px'
									}
								})
							})}
							InputLabelProps={{
								sx: {
									color: 'white',
									marginLeft: '5%',
									fontSize: isXsScreen || isSmScreen ? '70%' : '100%'
								}
							}}
							InputProps={{
								sx: {
									color: 'white',
									marginLeft: '5px',
									fontSize: isXsScreen || isSmScreen ? '70%' : '97%',
									'& .MuiInputBase-input': {
										padding: '2%'
									}
								}
							}}
						/>
					) : (
						<Autocomplete
							freeSolo
							filterSelectedOptions
							selectOnFocus
							clearOnBlur
							handleHomeEndKeys
							value={playlistToEdit.name}
							onChange={handleChange}
							label={'Select Playlist'}
							options={playlists}
							getOptionLabel={option => option.name}
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
									{option.name}
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
									label='Select Playlist'
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
											// margin: '5px 0',
											// padding: '5px 10px',
											fill: 'white'
										},
										sx: {
											...params.InputProps.sx,
											color: 'white',
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
					)}
				</Box>
				<Box display='flex' justifyContent={'space-between'} padding={'5% 0 0 5%'}>
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
									{songsToRemove.length === 0
										? 'Select all tracks in current collection'
										: 'Deselect all tracks in current collection'}
								</Typography>
							</div>
						}
					>
						<Checkbox
							onClick={handlePlaylistSelectAll}
							sx={{
								padding: '0px 7px',
								color: theme.palette.primary.white,
								'& .MuiSvgIcon-root': {
									fontSize: isXsScreen ? '1.25rem' : '2rem',
									transform: 'scale(0.75)'
								}
							}}
						/>
					</Tooltip>
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
									{currentUser &&
									currentUser?.user?.spotifyConnected &&
									currentUser?.user?.tokens > 2 &&
									playlistAction === 'create'
										? 'Create Playlist - 2 Tokens'
										: currentUser?.user?.spotifyConnected &&
										  playlistAction === 'edit'
										? 'Update Playlist'
										: currentUser?.user?.tokens < 2
										? 'Get more tokens to complete request'
										: 'Connect to Spotify to create playlists'}
								</Typography>
							</div>
						}
					>
						<Button
							disabled={!currentUser?.user}
							onClick={
								playlistAction === 'create'
									? handleCreatePlaylist
									: handleUpdatePlaylist
							}
							className={
								currentUser?.user?.tokens < 2 && playlistAction === 'create'
									? classes.disabled
									: classes.button
							}
						>
							<Box display='flex' alignItems='center'>
								<AutoAwesomeIcon
									style={{
										color: theme.palette.primary.complementary,
										paddingRight: '2%'
									}}
									fontSize={isSmScreen || isXsScreen ? 'small' : 'medium'}
								/>
								<Typography
									variant={isLgScreen || isXlScreen ? 'body2' : 'caption'}
									letterSpacing='1px'
								>
									{!(isXsScreen || isSmScreen) && playlistAction === 'create'
										? 'Create'
										: 'Update'}
								</Typography>
							</Box>
						</Button>
					</Tooltip>
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
									{'Clear selected from playlist'}
								</Typography>
							</div>
						}
					>
						<Button sx={{ padding: '0' }}>
							<PlaylistRemoveIcon
								style={{ color: theme.palette.primary.white }}
								onClick={handleBulkRemove}
							/>
						</Button>
					</Tooltip>
				</Box>
			</Box>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId='droppable-playlist'>
					{
						// eslint-disable-next-line no-unused-vars
						provided => {
							return (
								<ul
									{...provided.droppableProps}
									ref={provided.innerRef}
									style={{
										padding: '0px',
										display: 'flex',
										flexDirection: 'column'
									}}
								>
									{localTracks?.length ? (
										localTracks.map((item, index) => {
											return (
												<Draggable
													key={item?.spotifyId}
													draggableId={item?.spotifyId}
													index={index}
												>
													{
														// eslint-disable-next-line no-unused-vars
														provided => {
															return (
																<li
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																	className={
																		classes.currentPlaylistUl
																	}
																	onMouseEnter={() =>
																		setHoveredCardId(
																			item?.spotifyId
																		)
																	}
																	onMouseLeave={() =>
																		setHoveredCardId(null)
																	}
																	style={{
																		...provided.draggableProps
																			.style,
																		cursor: 'grab'
																	}}
																>
																	<PlaylistItemCard
																		classes={classes}
																		item={item}
																		handlePlaylistSelectClick={
																			handlePlaylistSelectClick
																		}
																		isPlaylistItemChecked={
																			isPlaylistItemChecked
																		}
																		isSmScreen={isSmScreen}
																		isXsScreen={isXsScreen}
																	/>
																	{hoveredCardId ===
																		item?.spotifyId && (
																		<Tooltip
																			title={
																				<Typography
																					variant='body2'
																					letterSpacing='1px'
																				>
																					{playlistAction ===
																					'create'
																						? `Remove ${item?.name} from current collection`
																						: `Remove ${item?.name} from ${playlist.name}`}
																				</Typography>
																			}
																			arrow
																			placement='right'
																		>
																			<DeleteIcon
																				fontSize='small'
																				className={
																					classes.nonNestedDeleteIcon
																				}
																				onClick={() =>
																					handleDeleteSong(
																						item
																					)
																				}
																			/>
																		</Tooltip>
																	)}
																</li>
															);
														}
													}
												</Draggable>
											);
										})
									) : currentUser?.user?.spotifyConnected ? (
										<>
											<Typography
												variant='subtitle1'
												textAlign='center'
												padding='20px'
												letterSpacing='2px'
											>
												{`You have no items in your current collection`}
											</Typography>
										</>
									) : (
										<>
											<Typography
												variant='subtitle1'
												textAlign='center'
												padding='20px'
												letterSpacing='2px'
											>
												{currentUser?.user
													? 'Connect to Spotify to earn tokens and start building collections'
													: `Register/Login, Connect to Spotify, Use tokens to unearth new gems and build your collections`}
											</Typography>
											<li style={{ listStyle: 'none' }}>
												<Card
													onClick={handleConnectToSpotify}
													className={classes.panelCard}
													style={{
														display: 'flex',
														margin: '0 auto'
													}}
												>
													<Box padding='0 5% 0'>
														<Typography
															variant='subtitle1'
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
														alt='spotify-icon'
														src={spotifyIcon}
														style={{
															maxWidth: '8%',
															height: 'auto'
														}}
													/>
												</Card>
											</li>
										</>
									)}
									{provided.placeholder}
								</ul>
							);
						}
					}
				</Droppable>
			</DragDropContext>
		</>
	);
};

export const RightPanel = ({
	createPlaylist,
	editPlaylist,
	currentUser,
	playlists,
	playlistAction,
	onCreatePlaylist,
	onAddToSavedPlaylist,
	onRemoveFromSavedPlaylist,
	onRemoveFromPlaylistToEdit,
	onSetCreatePlaylist,
	onSetEditPlaylist,
	onSetPlaylistToEdit,
	onUpdatePlaylistOrder,
	onSetSelectedPlaylist,
	onReorderPlaylistTracks,
	onRemoveFromCurrentPlaylistById,
	handleExploreMoreClick,
	isSmScreen,
	isXsScreen,
	setShowPlaylists
}) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [playlistName, setPlaylistName] = useState('');
	const [localEditPlaylist, setLocalEditPlaylist] = useState(editPlaylist);

	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState('info');

	useEffect(() => {
		const updatedEditPlaylist = playlists.find(p => p?.id === editPlaylist?.id);
		if (updatedEditPlaylist) {
			setLocalEditPlaylist(updatedEditPlaylist);
		} else {
			setLocalEditPlaylist(editPlaylist);
		}
	}, [playlists, editPlaylist]);

	const handleBackToPlaylists = () => {
		setShowPlaylists(true);
	};

	const playlist = playlistAction === 'create' ? createPlaylist : localEditPlaylist;

	const handleCreatePlaylist = async () => {
		if (!currentUser?.user?.spotifyConnected) {
			navigate('/spotify-connect');
			return;
		}

		if (currentUser?.user.tokens < 2 && playlistAction === 'create') {
			navigate('/pricing');
			return;
		}

		try {
			// Show save in progress snack bar
			setSnackbarOpen(true);
			setSnackbarMessage('Saving playlist...');
			setSnackbarSeverity('info');

			const newPlaylist = {
				name: playlistName,
				tracks: playlist.tracks
			};

			// Create playlist
			const createdPlaylist = await onCreatePlaylist(currentUser?.user.id, newPlaylist);

			// Add tracks to the created playlist
			const playlistTracks = newPlaylist.tracks.map(track => ({
				name: track.name,
				artists: track.artists,
				spotifyId: track.spotifyId || track.id,
				isrc: track.isrc,
				image: track.image
			}));
			const addedTracks = await onAddToSavedPlaylist(
				createdPlaylist.id,
				currentUser?.user.id,
				playlistTracks
			);

			await onRemoveFromCurrentPlaylistById(...addedTracks.map(song => song.spotifyId));

			// Show save success snack bar
			setSnackbarMessage('Playlist created successfully');
			setSnackbarSeverity('success');
			setPlaylistName('');
		} catch (error) {
			console.error('Error creating playlist:', error);
			if (error.message === 'Failed to create playlist') {
				// Show save failure snack bar for creating playlist
				setSnackbarMessage('Failed to create playlist');
				setSnackbarSeverity('error');
			} else {
				// Show save failure snack bar for adding tracks to the created playlist
				setSnackbarMessage('Failed to add tracks to the created playlist');
				setSnackbarSeverity('error');
			}
		} finally {
			setSnackbarOpen(true);
		}
	};

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	useEffect(() => {
		if (playlistAction === 'edit' && editPlaylist.id) {
			// Find the updated playlist in the playlists state
			const updatedPlaylist = playlists.find(p => p.id === editPlaylist.id);

			// Check if the playlist still exists and if there are changes in the order of tracks
			if (updatedPlaylist) {
				// Update the editPlaylist state only if there are changes
				if (
					JSON.stringify(editPlaylist.tracks) !== JSON.stringify(updatedPlaylist.tracks)
				) {
					onSetPlaylistToEdit(updatedPlaylist.id);
				}
			} else {
				// If the playlist has been removed, set selected playlist to null
				onSetSelectedPlaylist(null);
			}
		}
	}, [playlists, editPlaylist, onSetPlaylistToEdit, onSetSelectedPlaylist, playlistAction]);

	return (
		<Box>
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
							{isXsScreen || isSmScreen
								? 'Back to collections'
								: 'Build new playlist'}
						</Typography>
					</div>
				}
			>
				<Button
					onClick={() => {
						isXsScreen || isSmScreen
							? handleBackToPlaylists()
							: handleExploreMoreClick(false);
					}}
					sx={{
						color: 'white',
						background: `rgb(121, 44, 216, 0.3)`,
						border: '2px solid rgba(89, 149, 192, 0.5)',
						borderRadius: '18px',
						boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
						transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
						'&:hover, &:active, &.Mui-focusVisible': {
							background: `rgb(121, 44, 216, 0.5)`,
							boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)'
						},
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '3%',
						marginTop: '5%',
						minHeight: 'fit-content',
						width: '100%'
					}}
				>
					<Box display='flex'>
						{(isSmScreen || isXsScreen) && (
							<KeyboardDoubleArrowLeftIcon
								style={{
									color: theme.palette.primary.triadic2
								}}
								fontSize={'small'}
							/>
						)}
						<Typography
							variant={isXsScreen ? 'caption' : 'subtitle1'}
							color='white'
							letterSpacing='1px'
							sx={{
								cursor: 'pointer'
							}}
						>
							{isSmScreen || isXsScreen ? 'Back' : 'New Request'}
						</Typography>
						{!(isSmScreen || isXsScreen) && (
							<KeyboardDoubleArrowUpIcon
								style={{
									color: theme.palette.primary.triadic2
								}}
							/>
						)}
					</Box>
				</Button>
			</Tooltip>
			<Card className={classes.sidePanel}>
				<CreateOrEditPlaylist
					playlist={playlist}
					handleCreatePlaylist={handleCreatePlaylist}
					currentUser={currentUser}
					playlistName={playlistName}
					setPlaylistName={setPlaylistName}
					classes={classes}
					onAddToSavedPlaylist={onAddToSavedPlaylist}
					onRemoveFromSavedPlaylist={onRemoveFromSavedPlaylist}
					onRemoveFromPlaylistToEdit={onRemoveFromPlaylistToEdit}
					onSetCreatePlaylist={onSetCreatePlaylist}
					onSetEditPlaylist={onSetEditPlaylist}
					onSetPlaylistToEdit={onSetPlaylistToEdit}
					onRemoveFromCurrentPlaylistById={onRemoveFromCurrentPlaylistById}
					onReorderPlaylistTracks={onReorderPlaylistTracks}
					onUpdatePlaylistOrder={onUpdatePlaylistOrder}
					navigate={navigate}
					playlists={playlists}
					playlistAction={playlistAction}
					setSnackbarOpen={setSnackbarOpen}
					setSnackbarMessage={setSnackbarMessage}
					setSnackbarSeverity={setSnackbarSeverity}
				/>
			</Card>
			<Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
				<Alert
					variant='filled'
					onClose={handleSnackbarClose}
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
		playlists: state.playlist.playlists,
		createPlaylist: state.playlist.currentPlaylist.createPlaylist,
		editPlaylist: state.playlist.currentPlaylist.editPlaylist,
		playlistAction: state.playlist.currentPlaylist.action,
		playlistLoading: state.playlist.loading,
		playlistError: state.playlist.error
	};
};

const mapDispatchToProps = dispatch => ({
	onCreatePlaylist: (userId, playlist) => dispatch(createPlaylistRequest(userId, playlist)),
	onAddToSavedPlaylist: (playlistId, userId, ...songs) =>
		dispatch(addToSavedPlaylistRequest(playlistId, userId, ...songs)),
	onRemoveFromSavedPlaylist: (playlistId, userId, ...songs) =>
		dispatch(removeFromPlaylistRequest(playlistId, userId, ...songs)),
	onRemoveFromCurrentPlaylistById: (...trackIds) =>
		dispatch(removeFromCurrentPlaylistById(...trackIds)),
	onRemoveFromPlaylistToEdit: (...tracks) => dispatch(removeFromPlaylistToEdit(...tracks)),
	onSetCreatePlaylist: () => dispatch(setCreatePlaylist()),
	onSetEditPlaylist: () => dispatch(setEditPlaylist()),
	onSetPlaylistToEdit: playlistId => dispatch(setPlaylistToEdit(playlistId)),
	onSetSelectedPlaylist: playlistId => dispatch(setSelectedPlaylist(playlistId)),
	onReorderPlaylistTracks: (playlistId, reorderedTracks) =>
		dispatch(reorderPlaylistTracks(playlistId, reorderedTracks)),
	onUpdatePlaylistOrder: (userId, playlistId, updatedData) => {
		return dispatch(updatePlaylistItemsRequest(userId, playlistId, updatedData));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(RightPanel);
