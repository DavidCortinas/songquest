import React from 'react';
import { Box, keyframes, Typography } from "@mui/material";
import '../App.css';

export const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const LoadingSpinner = () => {
	return (
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
					zIndex: -1,
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
					animation: `${rotate} 17s linear infinite`, // Apply the animation
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
					zIndex: 1, // Ensures the dot is above the gradient but below the avatar
				},
			}}
		>
			<img
				src={'static/images/sq-logo-2.png'}
				alt="Spinning-Logo"
				className='spin'
				style={{ 
					// width: (isXsScreen || isSmScreen) ? '20%' : '13%',
					// paddingRight: (isXsScreen || isSmScreen) ? '2%' : '15px',
					height: 200,
					width: 200,
				}}
			/>
		</Box>
	)
}

export const LoadingState = () => {
    
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '55vh',
				position: 'relative',
			}}
		>
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
						zIndex: -1,
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
						animation: `${rotate} 17s linear infinite`, // Apply the animation
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
						zIndex: 1, // Ensures the dot is above the gradient but below the avatar
					},
				}}
			>
				<img
					src={'static/images/sq-logo-2.png'}
					alt="Spinning-Logo"
					className='spin'
					style={{ 
						// width: (isXsScreen || isSmScreen) ? '20%' : '13%',
						// paddingRight: (isXsScreen || isSmScreen) ? '2%' : '15px',
						height: 200,
						width: 200,
					}}
				/>
			</Box>
			<Typography
				variant='h4'
				sx={{
					position: 'absolute',
					color: 'whitesmoke',
					letterSpacing: '1px',
					bottom: '0%', // Place it at the bottom of the container or adjust as needed
					textAlign: 'center',
					width: '100%',
				}}
			>
				{`Loading...`}
			</Typography>
		</Box>
	)};