import React, { useEffect, useState } from 'react';
import { Box, Button, Card, Typography, useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import theme from '../../theme';
import { getPricing } from '../../thunks';
import eightTokens from '../../../public/images/eightTokens.png';
import eightyTokens from '../../../public/images/eightyTokens.png';
import fortyTokens from '../../../public/images/fortyTokens.png';

const useStyles = makeStyles(theme => ({
	containerBox: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '600px',
		[theme.breakpoints.down('sm')]: {
			flexDirection: 'column',
			height: 'auto'
		}
	},
	button: {
		color: 'white',
		backgroundColor: `rgb(121, 44, 216, 0.3)`,
		border: `2px solid ${theme.palette.primary.triadic1}`,
		borderRadius: '8px',
		boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
		width: 'fit-content',
		padding: '2% 5%',
		transition: 'border 0.3s, background 0.3s, boxShadow 0.3s width 0.3s',
		'&:hover, &:active, &.MuiFocusVisible': {
			border: `2px solid ${theme.palette.primary.triadic1}`,
			background: `rgb(121, 44, 216, 0.5)`,
			boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)'
		},
		[theme.breakpoints.down('sm')]: {
			background: 'rgb(44, 216, 207, 0.3)',
			marginTop: '2%',
			border: '2px solid rgba(89, 149, 192, 0.5)',
			'&.Mui-disabled': {
				background: 'rgb(44, 216, 207, 0.3)',
				color: 'grey',
				border: '1px solid rgba(88, 88, 88, 0.5)'
			}
		}
	},
	focusedCard: {
		display: 'flex',
		width: '25vw',
		height: '80vh',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
		margin: '1%',
		borderRadius: '8px',
		backgroundColor: '#282828',
		boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
		opacity: '0.8',
		transition: 'width 0.3s, height 0.3s',
		[theme.breakpoints.down('lg')]: {
			width: '30vw'
		},
		[theme.breakpoints.down('md')]: {
			width: '33vw'
		},
		[theme.breakpoints.down('sm')]: {
			width: '70%',
			height: '15vh',
			background: `rgb(121, 44, 216, 0.5)`,
			border: `2px solid ${theme.palette.primary.triadic1}`,
			boxShadow: 'inset 1px 1px 3px 2px rgba(0,0,0,0.5)'
		}
	},
	unfocusedCard: {
		display: 'flex',
		width: '20vw',
		height: '70vh',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
		margin: '1%',
		borderRadius: '8px',
		backgroundColor: '#282828',
		boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
		opacity: '0.8',
		transition: 'width 0.3s, height 0.3s',
		[theme.breakpoints.down('lg')]: {
			width: '25vw'
		},
		[theme.breakpoints.down('md')]: {
			width: '28vw'
		},
		[theme.breakpoints.down('sm')]: {
			width: '70%',
			height: '15vh'
		}
	},
	unfocusedTitleTypography: {
		color: 'white',
		letterSpacing: '2px',
		paddingBottom: '5%',
		height: 'auto',
		fontSize: '1.5rem',
		transition: 'height 0.3s ease-in-out, font-size 0.3s ease-in-out',
		[theme.breakpoints.down('sm')]: {
			textAlign: 'center',
			fontSize: '0.9rem',
			color: '#d82c8b',
			paddingBottom: '0'
		}
	},
	unfocusedPriceTypography: {
		color: '#2c8bd8',
		letterSpacing: '2px',
		height: 'auto',
		fontSize: '2rem',
		transition: 'height 0.3s ease-in-out, font-size 0.3s ease-in-out',
		[theme.breakpoints.down('sm')]: {
			textAlign: 'center',
			fontSize: '1.25rem',
			color: '#d82c8b'
		}
	},
	focusedTitleTypography: {
		color: '#d82c8b',
		letterSpacing: '2px',
		paddingBottom: '5%',
		height: 'auto',
		fontSize: '2rem',
		transition: 'height 0.3s ease-in-out, font-size 0.3s ease-in-out',
		[theme.breakpoints.down('sm')]: {
			textAlign: 'center',
			fontSize: '0.9rem',
			color: '#d82c8b',
			paddingBottom: '0'
		}
	},
	focusedPriceTypography: {
		color: '#d82c8b',
		letterSpacing: '2px',
		height: 'auto',
		fontSize: '3rem',
		transition: 'height 0.3s ease-in-out, font-size 0.3s ease-in-out',
		[theme.breakpoints.down('sm')]: {
			textAlign: 'center',
			fontSize: '1.25rem',
			color: '#d82c8b'
		}
	},
	detailBox: {
		display: 'flex',
		flexDirection: 'column',
		width: '90%'
	}
}));

export const Pricing = ({ onGetPricing }) => {
	const isSmScreen = useMediaQuery(theme.breakpoints.down('md'));
	const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const classes = useStyles(theme);
	const [focusedIndex, setFocusedIndex] = useState(isXsScreen ? null : 1);
	console.log(focusedIndex);
	const [pricing, setPricing] = useState(null);

	const navigate = useNavigate();

	const handleCardFocus = index => {
		setFocusedIndex(index);
	};

	const handleCardBlur = () => {
		if (!isXsScreen) {
			setFocusedIndex(1);
		}
	};

	useEffect(() => {
		const fetchPricing = async () => {
			try {
				const newPricing = await onGetPricing();
				setPricing(newPricing);
			} catch (error) {
				console.error('Error fetching pricing:', error);
			}
		};

		fetchPricing();
	}, [onGetPricing]);

	const handleSelectPricing = price => {
		navigate('/checkout', { state: { selectedPrice: price } });
	};

	return (
		<>
			<Typography
				textAlign='center'
				variant={isXsScreen ? 'h6' : isSmScreen ? 'h5' : 'h4'}
				color='whitesmoke'
				letterSpacing='1px'
				padding={isXsScreen && '2%'}
			>
				{'Use Tokens To Build Your Collections and More'}
			</Typography>
			<Typography
				textAlign='center'
				variant={isXsScreen ? 'body2' : isSmScreen ? 'body1' : 'h6'}
				color='whitesmoke'
				letterSpacing='1px'
				padding={isXsScreen && '2%'}
			>
				{`Tokens are required to build your collections.`}
			</Typography>
			<Typography
				textAlign='center'
				variant={isXsScreen ? 'body2' : isSmScreen ? 'body1' : 'h6'}
				color='whitesmoke'
				letterSpacing='1px'
				padding={isXsScreen && '2%'}
			>
				{`You can earn tokens through in-app achievements or you can purchase more here.`}
			</Typography>
			<Typography
				textAlign='center'
				color='whitesmoke'
				letterSpacing='1px'
				padding='0 2%'
				sx={{ fontSize: isXsScreen ? '0.75rem' : '1rem' }}
			>
				{`Select your token amount, then click 'Get Tokens' to go to checkout`}
			</Typography>
			<Box className={classes.containerBox}>
				{pricing &&
					Object.values(pricing).map((price, outerIndex) => (
						<Card
							key={outerIndex}
							className={
								outerIndex === focusedIndex
									? classes.focusedCard
									: classes.unfocusedCard
							}
							onMouseOver={() => handleCardFocus(outerIndex)}
							onMouseOut={handleCardBlur}
							onFocus={() => handleCardFocus(outerIndex)}
							onBlur={handleCardBlur}
							tabIndex={0}
						>
							{isXsScreen ? (
								<Box
									display='flex'
									alignItems='center'
									height='auto'
									justifyContent='space-around'
									width='100%'
								>
									{price.name === '80 Tokens' ? (
										<img
											loading='lazy'
											src={eightyTokens}
											style={{
												width: isXsScreen
													? '7em'
													: isSmScreen
													? '10em'
													: '15em',
												marginTop: '-1em',
												paddingLeft: '5%'
											}}
										/>
									) : price.name === '40 Tokens' ? (
										<img
											loading='lazy'
											src={fortyTokens}
											style={{
												width: isXsScreen
													? '7em'
													: isSmScreen
													? '10em'
													: '15em',
												marginTop: '-2em',
												paddingLeft: '5%'
											}}
										/>
									) : (
										<img
											loading='lazy'
											src={eightTokens}
											style={{
												width: isXsScreen
													? '7em'
													: isSmScreen
													? '10em'
													: '15em',
												marginTop: '-2em',
												paddingLeft: '5%'
											}}
										/>
									)}
									<Box display='flex' flexDirection='column' paddingRight='15%'>
										{price.name === '80 Tokens' && (
											<Typography
												color='white'
												textAlign='center'
												sx={{
													fontSize: '0.5rem'
												}}
											>
												{'* Best Value'}
											</Typography>
										)}
										<Typography
											className={
												outerIndex === focusedIndex
													? classes.focusedTitleTypography
													: classes.unfocusedTitleTypography
											}
										>
											{price.name.toUpperCase()}
										</Typography>
										<Typography
											className={
												outerIndex === focusedIndex
													? classes.focusedPriceTypography
													: classes.unfocusedPriceTypography
											}
										>
											{`$${(price.price / 100).toFixed(2)}`}
										</Typography>
									</Box>
								</Box>
							) : (
								<Box
									display='flex'
									flexDirection='column'
									alignItems='center'
									height='80%'
									justifyContent='space-around'
								>
									{price.name === '80 Tokens' && (
										<Typography color='white' variant='subtitle2'>
											{'* Best Value'}
										</Typography>
									)}
									<Typography
										className={
											outerIndex === focusedIndex
												? classes.focusedTitleTypography
												: classes.unfocusedTitleTypography
										}
									>
										{price.name.toUpperCase()}
									</Typography>
									{price.name === '80 Tokens' ? (
										<img
											loading='lazy'
											src={eightyTokens}
											style={{
												width: isSmScreen ? '10em' : '15em',
												marginTop: '-1em'
											}}
										/>
									) : price.name === '40 Tokens' ? (
										<img
											loading='lazy'
											src={fortyTokens}
											style={{
												width: isSmScreen ? '10em' : '15em'
											}}
										/>
									) : (
										<img
											loading='lazy'
											src={eightTokens}
											style={{
												width: isSmScreen ? '10em' : '15em'
											}}
										/>
									)}
									<Typography
										className={
											outerIndex === focusedIndex
												? classes.focusedPriceTypography
												: classes.unfocusedPriceTypography
										}
									>
										{`$${(price.price / 100).toFixed(2)}`}
									</Typography>
									{outerIndex === focusedIndex && (
										<Button
											className={classes.button}
											variant='contained'
											onClick={() => handleSelectPricing(price)}
										>
											{'Get Tokens'}
										</Button>
									)}
								</Box>
							)}
						</Card>
					))}
				{isXsScreen && (
					<Button
						className={classes.button}
						variant='contained'
						onClick={() => handleSelectPricing(pricing[focusedIndex])}
						disabled={focusedIndex === null}
					>
						{'Get Tokens'}
					</Button>
				)}
			</Box>
		</>
	);
};

const mapStateToProps = state => {
	return {
		user: state.user.currentUser
	};
};

const mapDispatchToProps = dispatch => ({
	onGetPricing: () => dispatch(getPricing())
});

export default connect(mapStateToProps, mapDispatchToProps)(Pricing);
