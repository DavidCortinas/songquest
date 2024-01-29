import { Box, CardHeader, Grid, Typography } from "@mui/material";

export const Body = ({ 
    isSmScreen, 
    isXsScreen, 
    isMdScreen,
    isLgScreen, 
    isXlScreen, 
}) => {
    const copy = {
        section: [
            {
                emoji: "🔮",
                header: "Advanced Features: AI-Powered Music Discovery",
                description: "Experience the ease of finding new music with SongQuest. Our advanced AI taps into a blend of songs, artists, and genres, using Spotify's audio analysis to deliver recommendations that match your unique taste. Discover sounds that resonate with you in ways you never imagined.",
                mobileDescription: "We leverage Spotify's powerful recommendation algorithm to handpick selections based on your unique tastes, ensuring you find the perfect tunes for your search.",
            },
            {
                emoji: "🔐",
                header: "Unlock a World of Music: Custom Playlists and More",
                description: "SongQuest opens the door to a vast universe of music. Harness the power of Spotify's recommendation algorithm to uncover tracks that align perfectly with your preferences. Create playlists that feel like they were made just for you, and explore music that fits your every mood.",
                mobileDescription: 'Take control of your musical adventure like never before. With SongQuest, you have the power to fine-tune your recommendations.',
            },
            {
                emoji: "⚙️",
                header: "Fine-Tune Your Sound Journey: Personalized Music Experience",
                description: "Take control of your musical journey. With SongQuest, fine-tune your listening experience to your heart's content. Whether you crave songs with acoustic vibes or tracks that make you dance, you have the power to shape your music discovery. Personalize your playlists to suit your every whim.",
                mobileDescription: 'Customize your music discovery experience down to the finest detail.',
            },
            {
                emoji: "📊",
                header: "Set Your Musical Parameters: Dive into the Details",
                description: "SongQuest lets you delve deep into the music world with a range of parameters like acousticness, danceability, energy, and more. Customize your exploration to the tiniest detail, and discover music that fits your exact preferences. Your journey through sound is just a few tweaks away.",
                mobileDescription: 'Enter up to five recommendation sources above and activate the fine tuning parameters to discover new music.',
            },
            {
                emoji: "🚀",
                header: "Your Journey Starts Here: Get Started with SongQuest",
                description: "Ready to dive into a musical exploration like no other? Begin by selecting up to five recommendation sources - songs, artists, genres - and fine-tune your preferences to discover the perfect sound for your journey. Enter your choices, adjust the parameters, and embark on an unparalleled musical adventure with SongQuest.",
                mobileDescription: 'Enter up to five recommendation sources above and activate the fine tuning parameters to discover new music.',
            },
        ]
    };

    return (
        <Box flex="row" backgroundColor="transparent">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                paddingTop='5%'
            >
                <Typography 
                    variant="h4" 
                    textAlign='center' 
                    color='whitesmoke'
                    letterSpacing='1px'
                >
                    Explore Your Sound with SongQuest
                </Typography>
                <Typography 
                    textAlign='center' 
                    variant={isXsScreen || isSmScreen ? "body1" : "h6"} 
                    width='95%'
                    color='#e0e6ea'
                    letterSpacing='1px'
                >
                    {
                        isXsScreen || isSmScreen ?
                        "Discover music effortlessly. Explore recommendations based on song, artist, genre, or a blend of sources. Use Spotify's audio analysis tools to pinpoint the desired sound." : 
                        "Embark on an extraordinary musical adventure with SongQuest, where AI-assisted music discovery meets personalized playlist creation. Dive into a world of melodies tailored just for you, shape your unique soundscapes, and share your discoveries with others. SongQuest is your gateway to a personalized music universe."
                    }
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {copy.section.map((item, index) => (
                    <Grid item xs={12} sm={12} key={index}>
                        <div style={{ display: 'flex', alignItems: 'center', padding: '5%' }}>
                            <Typography variant="h1" >{item.emoji}</Typography>
                            <div>
                                <CardHeader 
                                    title={item.header}
                                    titleTypographyProps={{ color: 'whitesmoke', letterSpacing: '1px' }}
                                    subheader={!isSmScreen && !isXsScreen ? 
                                        item.description : 
                                        item.mobileDescription
                                    }
                                    subheaderTypographyProps={{ color: '#e0e6ea' }}
                                    style={{ textAlign: 'left', paddingLeft: '10%', letterSpacing: '1px' }}
                                />
                            </div>
                        </div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};