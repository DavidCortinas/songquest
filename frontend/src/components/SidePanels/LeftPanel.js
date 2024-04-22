import React, { useState } from "react";
import { 
	Box, 
	Button, 
	Card, 
	Checkbox, 
	Tooltip, 
	Typography 
} from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import EditNoteIcon from '@mui/icons-material/EditNote';
import getPlaylistItems from "../../utils/playlist";
import useStyles from "../../classes/playlist";
import { connect } from "react-redux";
import { resetCurrentPlaylist, setSelectedPlaylist } from "../../actions";
import theme from "../../theme";
import { deletePlaylistRequest } from "../../thunks";
import spotifyIcon from '../../../public/images/Spotify_Icon_RGB_White.png';

const PlaylistCard = ({
	classes,
	currentUser,
	userPlaylist,
	selectedPlaylist,
	onSetSelectedPlaylist,
	onDeletePlaylist,
	isXsScreen,
	isSmScreen,
	setShowPlaylists,
	setToggleValue,
}) => {
	const [showOuterTooltip, setShowOuterTooltip] = useState(false);
	const [isCardHovered, setIsCardHovered] = useState(false);

	const playlistName = userPlaylist?.name;

	const handlePlaylistClick = () => {
		onSetSelectedPlaylist(userPlaylist.id);
		setToggleValue('Selected Playlist');

		if (isXsScreen || isSmScreen) {
			setShowPlaylists(false);
		}
	};

	const selected = Boolean(selectedPlaylist === userPlaylist);

	const handleCardMouseEnter = () => {
		setIsCardHovered(true);
		setShowOuterTooltip(true);
	};

	const handleCardMouseLeave = () => {
		setIsCardHovered(false);
		setShowOuterTooltip(false);
	};

	const handleDeletePlaylist = () => {
		onDeletePlaylist(
			[userPlaylist.id],
			currentUser?.user.id,
			null
		);
	};

	return (
		<Tooltip
			title={
				<div style={{ maxHeight: '25vh', overflowY: 'auto', padding: '8px', borderRadius: '8px' }}>
					<Box display='flex' alignItems='center'>
						<EditNoteIcon />
						<Typography variant='body2' letterSpacing='1px' paddingLeft='2%'>
							{`${playlistName.toUpperCase()}`}
						</Typography>
					</Box>
					{getPlaylistItems(userPlaylist)?.map((item, index) => (
						<Typography key={index} variant='body2' letterSpacing='1px'>
							{item}
						</Typography>
					))}
				</div>
			}
			arrow
			placement="right-start"
			open={showOuterTooltip && isCardHovered}
		>
			<Card
				onClick={handlePlaylistClick}
				onMouseEnter={handleCardMouseEnter}
				onMouseLeave={handleCardMouseLeave}
				className={`${classes.panelCard} ${selected && classes.panelCardSelected} ${classes.cardHovered}`}
			>
				<Typography
					noWrap
					variant={isXsScreen ? 'caption' : 'subtitle2'}
					color='white'
					letterSpacing='1px'
					textAlign='start'
					sx={{
						fontWeight: isXsScreen ? 'normal' : 'bold',
						maxHeight: '30%',
						maxWidth: '65%',
						overflowY: 'hidden',
						cursor: 'pointer',
					}}
				>
					{playlistName}
				</Typography>
				<img
					loading='lazy'
					src={spotifyIcon}
					style={{
						maxWidth: '8%',
						height: 'auto',
						position: 'absolute',
						right: '5%',
						bottom: '24%',
					}}
				/>
				<Tooltip
					title={
						<Typography variant='body2' letterSpacing='1px'>
							{`Delete ${playlistName}`}
						</Typography>
					}
					arrow
					placement='right'
					onMouseEnter={() => setShowOuterTooltip(false)}
					onMouseLeave={() => setShowOuterTooltip(isCardHovered)}
				>
					<DeleteIcon 
						fontSize='small' 
						className={classes.deleteIcon}
						onClick={handleDeletePlaylist}
					/>
				</Tooltip>
			</Card>
		</Tooltip>
	);
};

export const LeftPanel = ({
	userPlaylists,
	onSetSelectedPlaylist,
	onDeletePlaylist,
	onResetCurrentPlaylist,
	selectedPlaylist,
	isMdScreen,
	isSmScreen,
	isXsScreen,
	setShowPlaylists,
	setToggleValue,
	currentUser,
}) => {
	const classes = useStyles();

	const [playlistsToRemove, setPlaylistsToRemove] = useState([]);

	const isPlaylistItemChecked = (item) => {
		return playlistsToRemove.some(playlist => playlist === item.id);
	};

	const handleCheckPlaylist = (item) => {
		if (isPlaylistItemChecked(item)) {
			setPlaylistsToRemove(playlistsToRemove.filter(playlist => playlist !== item.id));
		} else {
			setPlaylistsToRemove([...playlistsToRemove, item.id])
		}
	};

	const handleSelectAllPlaylists = () => {
		if (playlistsToRemove.length !== userPlaylists.length) {
			setPlaylistsToRemove(userPlaylists.map(playlist => playlist.id))
		} else {
			setPlaylistsToRemove([]);
		}
	}
  
	const handleBulkRemove = () => {
		onDeletePlaylist(
			playlistsToRemove.map(playlistId => playlistId),
			currentUser?.user.id,
			() => setPlaylistsToRemove([])
		);
	};

	const handleSelectNewPlaylist = () => {
		onResetCurrentPlaylist();
		if (isSmScreen || isXsScreen) {
			setShowPlaylists(false);
		}
	};
  
	return (
		<Box 
			display='flex' 
			flexDirection='column'
			alignItems='center'
			paddingBottom='5%'
			position='relative'
			width={(isXsScreen || isSmScreen || isMdScreen) ? '30%' : null}
		> 
			<Tooltip
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
							{'Build new playlist'}
						</Typography>
					</div>
				}
			>
				<Button
					onClick={handleSelectNewPlaylist}
					sx={{
						color: 'white',
						background: `rgb(121, 44, 216, 0.3)`,
						border: '2px solid rgba(89, 149, 192, 0.5)',
						borderRadius: '18px',
						boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
						transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
						'&:hover, &:active, &.Mui-focusVisible': {
							background: `rgb(121, 44, 216, 0.5)`,
							boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
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
					<Box display='flex' width='100%' justifyContent='center'>
						<Typography
							variant={isXsScreen ? 'caption' : 'subtitle1'}
							color='white'
							letterSpacing='1px'
							sx={{
								cursor: 'pointer',
							}}
						>
							{isXsScreen ? 'New' : 'New Playlist'}
						</Typography>
						<AutoAwesomeIcon
							style={{ 
								color: theme.palette.primary.complementary,
								paddingLeft: '2%', 
							}}
							fontSize={isXsScreen ? 'small' : 'medium'}
						/>
					</Box>
				</Button>
			</Tooltip>
			{/* </li> */}
			<Card className={classes.sidePanel}>
				<ul
					style={{ 
						padding: '0px', 
						display: 'flex', 
						flexDirection: 'column', 
					}}
				> 
					<Box 
						display='flex' 
						alignItems='center' 
						justifyContent='space-around'
						padding={isXsScreen ? '5% 0 5% 15%' : '5% 0 5% 6%'}
					>
						<Tooltip
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
										{'Select all playlists'}
									</Typography>
								</div>
							}
						>
							<Checkbox
								onClick={handleSelectAllPlaylists} 
								sx={{ 
									padding: '0px', 
									color: theme.palette.primary.white,
									'& .MuiSvgIcon-root': { 
										fontSize: isXsScreen ? '1.25rem' : '2rem', 
										transform: 'scale(0.75)', 
									}
								}}
							/>
						</Tooltip>
						<Typography 
							variant={isXsScreen ? 'caption' : 'caption1' }
							textAlign='center'
							width='100%' 
							letterSpacing={isXsScreen ? '1px' : '2px'}
							sx={{  marginLeft: isXsScreen ? 1 : 2 }}
						>
							{isXsScreen ? 'Saved' : 'Edit Playlists'}
						</Typography>
						<Tooltip
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
										{'Delete selected playlists'}
									</Typography>
								</div>
							}
						>
							<Button
								sx={{ padding: '0'}}
							>
								<PlaylistRemoveIcon 
									style={{ color: theme.palette.primary.white }}
									fontSize={isXsScreen ? 'small' : 'medium'} 
									onClick={handleBulkRemove}
								/>
							</Button>
						</Tooltip>
					</Box>            
					{
						userPlaylists.length == 0 ? (
							<Typography 
								variant='subtitle1' 
								textAlign='center' 
								padding='10%'
								letterSpacing='2px'
							>
								{
									currentUser?.user ? 
										'You have not created any playlists' : 
										`Register to unearth new gems and add them to your collection`
								} 
							</Typography>
						) : userPlaylists?.map((userPlaylist, index) => {
							return (
								<Box 
									key={`${userPlaylist.name}`}
									display='flex' 
									flexDirection='column'
									alignItems='center'
									paddingBottom='10px'
								>
									<li 
										key={index} 
										style={{ listStyle: 'none', position: 'relative' }}
									>
										<Checkbox
											icon={
												<CircleIcon 
													fontSize={isXsScreen ? 'small' : 'medium'}
													sx={{ color: '#d2dce1', opacity: '0.5' }} 
												/>
											}
											checkedIcon={
												<CheckCircleIcon
													fontSize={isXsScreen ? 'small' : 'medium'} 
													color='info' 
												/>
											}                       
											onClick={() => handleCheckPlaylist(userPlaylist)}
											checked={isPlaylistItemChecked(userPlaylist)}
											sx={{
												color: 'white',
												position: 'absolute',
												top: !isXsScreen && '10%',
												left: !isXsScreen && '5%',
												bottom: isXsScreen && '-10%',
												zIndex: '2',
												paddingLeft: '0px',
											}}
										/>
										<PlaylistCard 
											currentUser={currentUser}
											userPlaylist={userPlaylist}
											onSetSelectedPlaylist={onSetSelectedPlaylist}
											onDeletePlaylist={onDeletePlaylist}
											index={index}
											classes={classes}
											isXsScreen={isXsScreen}
											isSmScreen={isSmScreen}
											setShowPlaylists={setShowPlaylists}
											selectedPlaylist={selectedPlaylist}
											setToggleValue={setToggleValue}
										/>
									</li>
								</Box>
							)
						}
						)}
				</ul>
			</Card>
		</Box>
	)
};

const mapStateToProps = (state) => {
	return {
		userPlaylists: state.playlist.playlists,
		selectedPlaylist: state.playlist.currentPlaylist.selectedPlaylist,
	};
};

const mapDispatchToProps = (dispatch) => ({
	onSetSelectedPlaylist: (playlistId) => dispatch(setSelectedPlaylist(playlistId)),
	onDeletePlaylist: (playlistIds, userId, onSuccess) => dispatch(deletePlaylistRequest(playlistIds, userId, onSuccess)),
	onResetCurrentPlaylist: () => dispatch(resetCurrentPlaylist()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftPanel);