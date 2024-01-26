import { Box, Typography } from "@mui/material";
// import openAiBadge from ''

export const BottomContainer = () => {
    return (
        <Box sx={{ backgroundColor: 'transparent' }}>
            <Box padding='3% 6% 5%' sx={{ textAlign: 'right' }}>
                <Typography 
                    style={{
                        fontSize: '28px',
                        letterSpacing: '3px',
                    }} 
                    color='white' 
                    paddingBottom='1%'
                >
                    SongQuest
                </Typography>
                <img
                    width='150px'
                    // style={{
                    // margin: '0 auto',
                    // display: 'block', 
                    // }}
                    src={'/static/images/powered-by-openai-badge-outlined-on-dark.svg'}
                />
                <Typography 
                    variant='subtitle1' 
                    color='white'
                    padding='10px 0 0'
                    style={{
                        letterSpacing: '1px',
                    }}
                >
                    Powered by:
                </Typography>
                <img
                    width='100px'
                    // style={{
                    // margin: '0 auto',
                    // display: 'block', 
                    // }}
                    src={'/static/images/spotifyLogo.png'}
                />
            </Box>
        </Box>
    )
};