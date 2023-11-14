import { Box, Typography } from "@mui/material";

export const BottomContainer = () => {
    return (
        <Box sx={{ backgroundColor: '#18212b' }}>
            <Box padding='3% 6% 5%' sx={{ textAlign: 'right' }}>
                <Typography variant='h4' color='white' paddingBottom='1%'>SongQuest</Typography>
                <Typography variant='h6' color='white' paddingBottom='1%'>Powered by:</Typography>
                <img
                    width='115em'
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