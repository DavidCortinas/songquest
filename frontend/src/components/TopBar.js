import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	Box,
	IconButton,
	LinearProgress,
	Tooltip,
	Typography,
	useMediaQuery,
	Menu,
	MenuItem,
	ListItemIcon,
	Avatar
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PaidIcon from '@mui/icons-material/Paid';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import {
	deletePlaylist,
	removeFromCurrentPlaylistById,
	resetDataLoaded,
	setCurrentUser
} from '../actions';
import { connect } from 'react-redux';
import '../App.css';
import theme from '../theme';
import { authSlice } from '../reducers';
import { makeStyles, withStyles } from '@mui/styles';
import { TokenCounter, KarmaCounter } from '../utils';
import logoIcon from '../../public/images/sq-logo-2.ico';
import { DemoModal } from './auth/DemoModal';

const StyledLinearProgress = withStyles({
	colorPrimary: {
		backgroundColor: 'rgb(216,44,139, 0.5)'
	},
	barColorPrimary: {
		backgroundColor: theme.palette.primary.triadic2
	}
})(LinearProgress);

const useStyles = makeStyles(() => ({
	counterContainer: {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '32px'
	},
	responsiveBox: {
		[theme.breakpoints.up('md')]: {
			width: '500px'
		},
		[theme.breakpoints.down('sm')]: {
			flex: 1,
			maxWidth: '50%'
		}
	}
}));

export const TopBar = ({
	onResetDataLoaded,
	onDeletePlaylist,
	onRemoveFromCurrentPlaylistById,
	onSetCurrentUser,
	onLogout,
	user,
	currentUser,
	userPlaylists,
	currentPlaylist
}) => {
	const classes = useStyles();
	const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleMenuClick = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const navigate = useNavigate();

	const handleNavigate = () => {
		onResetDataLoaded();
		navigate('/', { replace: true });
	};

	const handleLogout = () => {
		navigate('/');
		setAnchorEl(null);
		onLogout();
		onDeletePlaylist(...userPlaylists.map(playlist => playlist.id));
		onRemoveFromCurrentPlaylistById(...(currentPlaylist?.tracks?.map(song => song) || []));
		onSetCurrentUser(null);
		onResetDataLoaded();
	};

	const handleGetMoreTokens = () => {
		navigate('/pricing');
	};

	const handleProfileClick = () => {
		setAnchorEl(null);
		navigate('/profile');
	};

	const handleHomeClick = () => {
		setAnchorEl(null);
		navigate('/');
	};

	const xpPercentage = currentUser?.user?.karma;

	const [openDemoVideo, setOpenDemoVideo] = React.useState(false);

	const handleViewDemoVideo = () => {
		setOpenDemoVideo(true);
	};

	const handleCloseDemoVideo = () => {
		setOpenDemoVideo(false);
	};

	return (
		<Box display='flex' justifyContent='space-between' p={isXsScreen ? 1 : 2} id='topBar'>
			<Box display='flex' borderRadius='3px'>
				<Link
					to='/'
					style={{
						textDecoration: 'none',
						color: 'inherit',
						flexGrow: 1,
						display: 'flex',
						alignItems: 'center'
					}}
					onClick={handleNavigate}
				>
					<img
						loading='lazy'
						src={logoIcon}
						alt='Logo'
						style={{
							width: '13%',
							paddingRight: isXsScreen ? '2%' : '15px'
						}}
					/>
					<Typography
						variant={isXsScreen ? 'h6' : 'h5'}
						component='div'
						color='white'
						letterSpacing='2px'
					>
						SongQuest
					</Typography>
				</Link>
			</Box>
			{!user ? (
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
								{'Create account or login'}
							</Typography>
						</div>
					}
				>
					<IconButton
						color='inherit'
						component={Link}
						to='/login'
						style={{
							textDecoration: 'none',
							color: 'white'
						}}
					>
						{!isXsScreen && (
							<Typography variant='h6' letterSpacing='1px'>
								Login/Register
							</Typography>
						)}
						<LoginIcon />
					</IconButton>
				</Tooltip>
			) : (
				<Box
					display='flex'
					alignItems='center'
					className={classes.responsiveBox}
					justifyContent='flex-end'
				>
					<Box className={classes.counterContainer}>
						<TokenCounter tokens={currentUser?.user?.tokens || 0} />
					</Box>
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
									{`Click Here To Get More Tokens`}
								</Typography>
								<Box display='flex' justifyContent='center' alignItems='center'>
									<Typography variant='subtitle1' letterSpacing='1px'>
										{`Balance: `}
									</Typography>
									<PaidIcon
										fontSize='small'
										sx={{ color: '#c4a537', pl: '2%' }}
									/>
									<Typography variant='subtitle1' letterSpacing='1px' pl='1%'>
										{currentUser?.user?.tokens}
									</Typography>
								</Box>
							</div>
						}
					>
						<Box display='flex'>
							<PaidIcon
								fontSize='medium'
								sx={{ color: '#c4a537' }}
								onClick={handleGetMoreTokens}
							/>
							{currentUser?.user?.tokens === 0 && (
								<PriorityHighIcon
									color='warning'
									sx={{
										height: '15px',
										marginLeft: '-8px'
									}}
								/>
							)}
						</Box>
					</Tooltip>
					<Box
						display='flex'
						flexDirection='column'
						justifyContent='flex-end'
						sx={{
							height: '40%',
							width: '100px',
							pl: '3%'
						}}
					>
						<StyledLinearProgress
							variant='determinate'
							value={xpPercentage}
							sx={{
								borderRadius: '5px',
								height: '8px',
								marginRight: '5%'
							}}
						/>
						<Typography
							color='white'
							textAlign='center'
							letterSpacing='8px'
							sx={{
								fontSize: '.5rem'
							}}
						>
							{'KARMA'}
						</Typography>
					</Box>
					<Box className={classes.counterContainer}>
						<KarmaCounter currentKarma={currentUser?.user?.karma} />
					</Box>
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
									{`Account menu`}
								</Typography>
							</div>
						}
					>
						<IconButton onClick={handleMenuClick} size='large'>
							<Avatar
								src={
									currentUser?.user?.profileImage
										? currentUser?.user?.profileImage
										: '/path/to/nonexistent/image.jpg'
								}
								alt={currentUser?.user?.displayName}
								sx={{
									width: isXsScreen ? 32 : 48,
									height: isXsScreen ? 32 : 48
								}}
							/>
						</IconButton>
					</Tooltip>
					<Menu
						open={open}
						onClose={handleClose}
						anchorEl={anchorEl}
						slotProps={{
							paper: {
								style: {
									backgroundColor: '#282828',
									borderRadius: '8px'
								}
							}
						}}
					>
						<MenuItem onClick={handleProfileClick}>
							{!isXsScreen && (
								<ListItemIcon
									color='inherit'
									component={Link}
									style={{
										textDecoration: 'none',
										color: 'white'
									}}
								>
									<AccountCircleIcon />
								</ListItemIcon>
							)}
							<Typography
								variant={isXsScreen ? 'body2' : 'body1'}
								letterSpacing='1px'
								color='white'
							>
								{`Profile`}
							</Typography>
						</MenuItem>
						<MenuItem onClick={handleHomeClick}>
							{!isXsScreen && (
								<ListItemIcon
									color='inherit'
									component={Link}
									style={{
										textDecoration: 'none',
										color: 'white'
									}}
								>
									<HomeIcon />
								</ListItemIcon>
							)}
							<Typography
								variant={isXsScreen ? 'body2' : 'body1'}
								letterSpacing='1px'
								color='white'
							>
								{`Home`}
							</Typography>
						</MenuItem>
						<MenuItem divider onClick={handleViewDemoVideo}>
							{!isXsScreen && (
								<ListItemIcon
									color='inherit'
									component={Link}
									style={{
										textDecoration: 'none',
										color: 'white'
									}}
								>
									<SlideshowIcon />
								</ListItemIcon>
							)}
							<Typography
								variant={isXsScreen ? 'body2' : 'body1'}
								letterSpacing='1px'
								color='white'
							>
								{`Demo`}
							</Typography>
						</MenuItem>
						<MenuItem onClick={handleLogout}>
							{!isXsScreen && (
								<ListItemIcon
									color='inherit'
									component={Link}
									style={{
										textDecoration: 'none',
										color: 'white'
									}}
								>
									<LogoutIcon fontSize='small' />
								</ListItemIcon>
							)}
							<Typography
								variant={isXsScreen ? 'body2' : 'body1'}
								letterSpacing='1px'
								color='white'
							>
								{`Logout`}
							</Typography>
						</MenuItem>
					</Menu>
					<DemoModal
						openDemoVideo={openDemoVideo}
						handleCloseDemoVideo={handleCloseDemoVideo}
					/>
				</Box>
			)}
		</Box>
	);
};

const mapStateToProps = state => {
	return {
		user: state.auth.account,
		currentUser: state.user.currentUser,
		currentPlaylist: state.playlist.currentPlaylist.createPlaylist,
		userPlaylists: state.playlist.playlists
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onResetDataLoaded: () => dispatch(resetDataLoaded()),
		onSetCurrentUser: user => dispatch(setCurrentUser(user)),
		onDeletePlaylist: (...playlistIds) => dispatch(deletePlaylist(...playlistIds)),
		onRemoveFromCurrentPlaylistById: (...songs) =>
			dispatch(removeFromCurrentPlaylistById(...songs)),
		onLogout: () => dispatch(authSlice.actions.logout())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
