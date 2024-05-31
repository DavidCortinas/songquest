import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../../public/images/sq-logo-2.ico';
import { rotate } from './LoadingState';

export const VerificationError = () => {
	const navigate = useNavigate();
	const handleGoBack = () => {
		navigate('/');
	};

	return (
		<Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
			{/* <Typography
                textAlign='center'
                color='white'
                variant='h3'
            >
                Oops!
            </Typography> */}
			<Typography textAlign='center' color='white' variant='h4' letterSpacing='1px' mb='2%'>
				{'Your email has already been verified...'}
			</Typography>
			<Box
				sx={{
					position: 'relative',
					width: 'calc(200px + 26px)', // Avatar size plus gradient border
					height: 'calc(200px + 26px)', // Avatar size plus gradient border
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
						top: '-8px', // Slightly more than the padding to sit on the gradient border
						left: '48%',
						// Adjust the transform origin to the center of the avatar
						transform: 'translate(-50%, 0) rotate(0deg)', // Centers the dot
						transformOrigin: '50% calc(100% + 116px)', // Move the origin to the bottom center of the box
						animation: `${rotate} 17s linear infinite`,
						zIndex: 1 // Ensures the dot is above the gradient but below the avatar
					}
				}}
			>
				<img
					loading='lazy'
					src={logoIcon}
					alt='Logo'
					style={{
						// width: (isXsScreen || isSmScreen) ? '20%' : '13%',
						// paddingRight: (isXsScreen || isSmScreen) ? '2%' : '15px',
						height: 200,
						width: 200
					}}
				/>
			</Box>
			<Typography
				textAlign='center'
				color='white'
				variant='h5'
				paddingTop='3%'
				width='75%'
				letterSpacing='2px'
			>
				{`If you are trying to complete the onboarding please do so in 
                    the profile section, which you can access through the avatar 
                    menu in the top right corner of the page`}
			</Typography>
			<Typography
				textAlign='center'
				color='white'
				variant='body1'
				width='100%'
				letterSpacing='2px'
				pt='2%'
			>
				{`If you are experiencing another issue, please contact support@songquest.io`}
			</Typography>
			<Button
				onClick={handleGoBack}
				sx={{
					width: '15%',
					marginTop: '2%',
					color: 'white',
					backgroundColor: 'rgb(44, 216, 207, 0.3)',
					border: '2px solid rgba(89, 149, 192, 0.5)',
					borderRadius: '18px',
					boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
					transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
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
					{'Back Home'}
				</Typography>
			</Button>
		</Box>
	);
};
