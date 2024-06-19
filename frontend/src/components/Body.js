import React from 'react';
import { Box, Button, CardHeader, Grid, Typography } from '@mui/material';
import theme from '../theme';

export const Body = ({ isSmScreen, isXsScreen, handleExploreMoreClick }) => {
	const copy = {
		section: [
			{
				emoji: '🔮',
				header:
					isSmScreen || isXsScreen
						? 'AI-Powered Music Discovery'
						: 'Advanced Features: AI-Powered Music Discovery',
				description:
					"Experience the ease of finding new music with SongQuest. Our advanced AI taps into a blend of songs, artists, and genres, using Spotify's audio analysis to deliver recommendations that match your unique taste. Discover sounds that resonate with you in ways you never imagined.",
				mobileDescription:
					'Explore music seamlessly with SongQuest. Our AI leverages Spotify’s audio tools to tailor selections to your taste. Enjoy uniquely personalized sound experiences.'
			},
			{
				emoji: '🔐',
				header:
					isSmScreen || isXsScreen
						? 'Custom Playlists and More'
						: 'Unlock a World of Music: Custom Playlists and More',
				description:
					"SongQuest opens the door to a vast universe of music. Harness the power of Spotify's recommendation algorithm to uncover tracks that align perfectly with your preferences. Create playlists that feel like they were made just for you, and explore music that fits your every mood.",
				mobileDescription:
					'Unlock music that fits your needs with SongQuest. Our AI uses Spotify’s tools to personalize tracks for your taste. Discover new and thrilling sounds.'
			},
			{
				emoji: '⚙️',
				header:
					isSmScreen || isXsScreen
						? 'Personalized Music Experience'
						: 'Fine-Tune Your Sound Journey: Personalized Music Experience',
				description:
					"Take control of your musical journey. With SongQuest, fine-tune your listening experience to your heart's content. Whether you crave songs with acoustic vibes or tracks that make you dance, you have the power to shape your music discovery. Personalize your playlists to suit your every whim.",
				mobileDescription:
					'Master your musical journey with SongQuest. Tailor your listening experience, from acoustic to dance tracks, and customize playlists to your liking.'
			},
			{
				emoji: '📊',
				header:
					isSmScreen || isXsScreen
						? 'Set Your Musical Parameters'
						: 'Set Your Musical Parameters: Dive into the Details',
				description:
					'SongQuest lets you delve deep into the music world with a range of parameters like acousticness, danceability, energy, and more. Customize your exploration to the tiniest detail, and discover music that fits your exact preferences. Your journey through sound is just a few tweaks away.',
				mobileDescription:
					'Dive into music with SongQuest by adjusting settings like acousticness and danceability. Customize your search to find music that perfectly matches your preferences.'
			},
			{
				emoji: '🚀',
				header:
					isSmScreen || isXsScreen
						? 'Get started with Songquest'
						: 'Your Journey Starts Here: Get Started with SongQuest',
				description:
					'Ready to dive into a musical exploration like no other? Begin by selecting up to five recommendation sources - songs, artists, genres - and fine-tune your preferences to discover the perfect sound for your journey. Enter your choices, adjust the parameters, and embark on an unparalleled musical adventure with SongQuest.',
				mobileDescription:
					'Start a unique musical exploration with SongQuest by selecting up to five sources—songs, artists, genres—and fine-tuning your preferences to find your perfect sound.'
			}
		]
	};

	return (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			backgroundColor='transparent'
		>
			<Box
				display='flex'
				flexDirection='column'
				alignItems='center'
				padding={isXsScreen ? '5%' : '5% 0'}
			>
				<Typography
					variant={isXsScreen ? 'h6' : 'h4'}
					textAlign='center'
					color='white'
					letterSpacing='1px'
				>
					{'Unearth New Sounds with SongQuest'}
				</Typography>
				<Typography
					textAlign='center'
					variant={isXsScreen ? 'body1' : 'h6'}
					color='whitesmoke'
					letterSpacing='1px'
				>
					{isXsScreen || isSmScreen
						? "Discover music effortlessly. Explore recommendations based on song, artist, genre, or a blend of sources. Use Spotify's audio analysis tools to pinpoint the desired sound."
						: 'Embark on an extraordinary musical adventure with SongQuest, where AI-assisted music discovery meets personalized playlist creation. Dive into a world of melodies tailored just for you, shape your unique soundscapes, and share your discoveries with others. SongQuest is your gateway to a personalized music universe.'}
				</Typography>
			</Box>
			<Grid container spacing={2}>
				{copy.section.map((item, index) => (
					<Grid item xs={12} sm={12} key={index}>
						<div
							style={{
								display: 'flex',
								flexDirection: isXsScreen || isSmScreen ? 'column' : 'row',
								alignItems: 'center',
								paddingtop: '5%'
							}}
						>
							<Typography variant={isXsScreen || isSmScreen ? 'h2' : 'h1'}>
								{item.emoji}
							</Typography>
							<div>
								<CardHeader
									title={item.header}
									titleTypographyProps={{
										color: 'white',
										letterSpacing: '1px',
										fontSize: isXsScreen ? '1.25rem' : '1.75rem'
									}}
									subheader={
										!isSmScreen && !isXsScreen
											? item.description
											: item.mobileDescription
									}
									subheaderTypographyProps={{
										color: 'whitesmoke',
										letterSpacing: '1px',
										fontSize: isXsScreen ? '1rem' : '1.25rem'
									}}
									style={{
										textAlign: 'left',
										paddingLeft: '10%'
									}}
								/>
							</div>
						</div>
					</Grid>
				))}
			</Grid>
			<Button
				onClick={() => handleExploreMoreClick(true)}
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
					Click here to see how it works!
				</Typography>
			</Button>
		</Box>
	);
};
