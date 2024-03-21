import { Box, Button, CardHeader, Snackbar, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SendIcon from '@mui/icons-material/Send';
import useStyles from "classes/playlist";
import { useLocation, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { resendVerification } from "thunks";
import { useEffect, useState } from "react";
import { emailVerificationFailure, emailVerificationSuccess } from "actions";

const RegistrationSuccess = ({ 
    user, 
    onResendVerification,
    onEmailVerificationFailure,
    onEmailVerificationSuccess, 
}) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const location = useLocation();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailVerified = params.get('email_verified');
        
        if (emailVerified === 'True') {
            onEmailVerificationSuccess(true);
        } else {
            onEmailVerificationFailure(false, 'Email verification failed');
        };

        params.delete('email_verified');
        window.history.replaceState(null, '', '?' + params.toString());

    }, [location.search, onEmailVerificationSuccess, onEmailVerificationFailure]);

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

    const handleNextSteps = () => {
        navigate('/spotify-connect');
    };

    console.log(user.user.emailVerified)

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
                        You steps away from unearthing new gems for your musical 
                        collection. Check your email to confirm your registration, then 
                        make sure to watch the short demo to see how SongQuest can help you dig 
                        deeper into your musical universe than ever before!
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
                    <Typography 
                        variant="body2" 
                        style={{ 
                            color: 'white', 
                            textAlign: 'center', 
                            width: '60%' 
                        }}
                    >
                        {
                            `After confirming your registration view the demo or refresh 
                            the page if the demo does not automatically appear...`
                        }
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
                    Your email is confirmed. Now watch the short demo to see how 
                    SongQuest can help you dig deeper into your musical universe 
                    than ever before!
                </Typography> 
            )}
            {user?.user.emailVerified ? (
                <Button 
                    onClick={handleNextSteps}
                    className={classes.button}
                    sx={{ marginTop: '2%' }}
                >
                    Next Steps
                    <KeyboardArrowRightIcon />
                </Button>
            ) : (
                <Button 
                    onClick={handleResendVerification}
                    className={classes.button}
                    sx={{ marginTop: '2%' }}
                >
                    Resend Link
                    <SendIcon sx={{ width: '16px', paddingLeft: '5px' }} />
                </Button>
            )}
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
    onEmailVerificationSuccess: (emailVerified) => dispatch(emailVerificationSuccess(emailVerified)),
    onEmailVerificationFailure: (emailVerified, error) => dispatch(emailVerificationFailure(emailVerified, error)),
}); 

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationSuccess);