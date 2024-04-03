import { Box, Button, CardHeader, Snackbar, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import useStyles from "classes/playlist";
import { connect } from "react-redux";
import { resendVerification } from "thunks";
import { useState } from "react";

const RegistrationSuccess = ({ 
    user, 
    onResendVerification,
}) => {
    const classes = useStyles();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleResendVerification = async () => {
        try {
            await onResendVerification(user?.user.id);
            setSnackbarOpen(true);
            setSnackbarMessage('Verification email resent successfully');
        } catch (error) {
            setSnackbarOpen(true);
            setSnackbarMessage('Failed to resend verification email');
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            style={{ height: '100vh' }}
        >
            <Typography 
                variant="h5"  
                gutterBottom 
                style={{ 
                    color: 'white', 
                    textAlign: 'center' 
                }}
            >
                Welcome to SongQuest
            </Typography>
            {!user?.user.emailVerified ? (
                <>
                    <Typography 
                        variant="body1" 
                        style={{ 
                            color: 'whitesmoke', 
                            textAlign: 'left', 
                            width: '60%' 
                        }}
                    >
                        You are steps away from unearthing new gems for your musical 
                        collection. Check your email to confirm your registration!
                    </Typography>
                    <Typography 
                        variant="body1"
                        padding='1% 0' 
                        style={{ 
                            color: 'white', 
                            textAlign: 'left', 
                            width: '60%' 
                        }}
                    >
                        If the confirmation link does not appear in your inbox within a 
                        a few minutes, please resend the link with the button below.
                    </Typography>
                </>
            ) : (
                <Typography 
                    variant="body1" 
                    style={{ 
                        color: 'whitesmoke', 
                        textAlign: 'left', 
                        width: '60%' 
                    }}
                >
                    Your email is confirmed! Now watch the short demo to see how 
                    SongQuest can help you dig deeper into your musical universe 
                    than ever before!
                </Typography> 
            )}
            <Button 
                onClick={handleResendVerification}
                className={classes.button}
                sx={{ marginTop: '2%' }}
            >
                Resend Link
                <SendIcon sx={{ width: '16px', paddingLeft: '5px' }} />
            </Button>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                autoHideDuration={5000}
            />
        </Box>
    );
};

const mapStateToProps = (state) => ({
    user: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
    onResendVerification: (userId) => dispatch(resendVerification(userId)),
}); 

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationSuccess);