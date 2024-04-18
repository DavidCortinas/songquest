import { makeStyles } from "@mui/styles";
import theme from 'theme';

const useStyles = makeStyles(() => (
	{
		sidePanel: {
			marginTop: '10px',
			height: '85vh', 
			width: '20vw',
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
			[theme.breakpoints.down('lg')]: {
				width: '30vw',
			}
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
			[theme.breakpoints.down('md')]: {
				padding: '0',
				height: '5%',
				minWidth: '54px'
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
			[theme.breakpoints.down('md')]: {
				padding: '0',
				height: '5%',
				minWidth: '54px'
			},
		},
		dropzone: {
			borderRadius: '18px',
			borderColor: 'rgb(210,220,225, 0.6)',
			background: 'rgba(48, 130, 164, 0.15)',
			marginBottom: '2%',
			'& p': {
				color: 'white'
			},
			'& .MuiDropzoneArea-active': {
				borderColor: 'green'
			}
		},
		actionButton: {
			display: 'flex', 
			width: '18vw',
			height: '11vh', 
			alignItems: 'center',
			justifyContent: 'center',
			overflow: 'hidden',
			borderRadius: '18px',
			backgroundColor: '#282828',
			boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
			opacity: '0.8',
			'&:hover, &:active, &.MuiFocusVisible': {
				border: '2px solid rgba(89, 149, 192, 0.5)',
				background: 'rgba(48, 130, 164, 0.15)',
				boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
			},
		},
		panelCard: {
			display: 'flex', 
			width: '18vw',
			[theme.breakpoints.down('sm')]: {
				width: '30vw',
			},
			minHeight: 'fit-content', 
			padding: '5% 0',
			alignItems: 'center',
			justifyContent: 'center',
			overflow: 'hidden',
			borderRadius: '32px',
			backgroundColor: '#282828',
			boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
			opacity: '0.8',
			'&:hover, &:active, &.MuiFocusVisible': {
				border: '2px solid rgba(89, 149, 192, 0.5)',
				background: 'rgba(48, 130, 164, 0.15)',
				boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
			},
		},
		panelCardSelected: {
			border: '2px solid rgba(89, 149, 192, 0.5)',
			background: 'rgba(48, 130, 164, 0.15)',
			boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',         
		},
		playlistField: {
			width: '100%',
			[theme.breakpoints.down('md')]: {
				width: '100%',
			},
			backgroundColor: '#30313d',
			borderRadius: '8px',
			boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
		},
		currentPlaylistUl: {
			position: 'relative',
			margin: '0 0 0 0',
			listStyle: 'none',
			'&:hover $nonNestedDeleteIcon': {
				opacity: 1,
			},
		},
		resetBtn: {
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
		},
		textField: {
			width: '100%',
			// maxHeight: '30px',
			[theme.breakpoints.down('sm')]: {
				width: '80%',
			},
			input: {
				color: 'white',
			},
			backgroundColor: '#30313d',
			color: 'white',
			borderRadius: '8px',
			boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
		},
		deleteIcon: {
			opacity: 0,
			transition: 'opacity 0.3s ease',
			position: 'absolute',
			right: '-7px',
			top: '-8px',
			color: 'rgb(210,220,225, 0.8)',
			cursor: 'pointer',
		},
		nonNestedDeleteIcon: {
			opacity: 1,
			position: 'absolute',
			right: '2px',
			top: '-8px',
			color: 'rgb(210,220,225, 0.8)',
			cursor: 'pointer',
			transition: 'opacity 0.3s ease',
		},
		cardHovered: {
			'&:hover $deleteIcon': {
				opacity: 1,
			},
		},
		imagePreviewContainer: {
			display: 'flex',        
			justifyContent: 'center', 
			alignItems: 'center',    
			height: '100%',    
		},
	}
));

export default useStyles;