import { Box, Typography } from "@mui/material";

export const BottomContainer = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column', // Display in a column layout
        alignItems: 'flex-end', // Align items to the right
        padding: '3% 6% 5%',
      }}
    >
      <Box sx={{ textAlign: 'right' }}>
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
          src={'/static/images/spotifyLogo.png'}
        />
      </Box>
      <Box sx={{ textAlign: 'left', paddingTop: '2%' }}>
        <Typography color='white' variant="subtitle2">
          Image by{" "}
          <a
            href="https://www.freepik.com/free-vector/realistic-galaxy-background_14960493.htm#query=space%20texture&position=8&from_view=search&track=ais&uuid=089902d2-5014-42e6-b3de-ccf9823c39b5"
            style={{ textDecoration: 'none', color: 'white' }}
          >
            Freepik
          </a>
        </Typography>
      </Box>
    </Box>
  );
};
